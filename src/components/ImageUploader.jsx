import { useRef, useState } from 'react';
import { FiAlertCircle, FiUpload, FiX } from 'react-icons/fi';
import { formatFileSize, generateThumbnail, IMAGE_SPECS, processImage, validateImage } from '../utils/imageUtils';

const ImageUploader = ({ 
  onUpload, 
  onRemove, 
  currentImage, 
  specType = 'PRODUCT_IMAGE',
  multiple = false,
  maxFiles = 5,
  className = '',
  label = 'Upload Image',
  required = false,
  showPreview = true
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef(null);
  
  const spec = IMAGE_SPECS[specType];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = async (e) => {
    if (e.target.files && e.target.files[0]) {
      await handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files) => {
    setErrors([]);
    setUploading(true);
    
    const fileArray = Array.from(files);
    const validFiles = [];
    const newErrors = [];
    
    // Validate files
    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      const validation = validateImage(file, spec);
      
      if (!validation.isValid) {
        newErrors.push(`${file.name}: ${validation.errors.join(', ')}`);
      } else {
        validFiles.push(file);
      }
    }
    
    if (newErrors.length > 0) {
      setErrors(newErrors);
      setUploading(false);
      return;
    }
    
    // Check file count limit
    if (!multiple && validFiles.length > 1) {
      setErrors(['Only one file allowed']);
      setUploading(false);
      return;
    }
    
    if (validFiles.length > maxFiles) {
      setErrors([`Maximum ${maxFiles} files allowed`]);
      setUploading(false);
      return;
    }
    
    try {
      const processedFiles = [];
      const newPreviews = [];
      
      for (const file of validFiles) {
        // Process image (compress/resize)
        const processedBlob = await processImage(file, spec);
        const processedFile = new File([processedBlob], file.name, { type: file.type });
        
        // Generate thumbnail
        const thumbnail = await generateThumbnail(file);
        
        processedFiles.push(processedFile);
        newPreviews.push({
          file: processedFile,
          thumbnail,
          originalName: file.name,
          size: processedFile.size
        });
      }
      
      setPreviews(newPreviews);
      
      if (onUpload) {
        if (multiple) {
          onUpload(processedFiles);
        } else {
          onUpload(processedFiles[0]);
        }
      }
      
    } catch (error) {
      setErrors([`Error processing images: ${error.message}`]);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
    
    if (onRemove) {
      onRemove(index);
    }
  };

  const removeCurrentImage = () => {
    if (onRemove) {
      onRemove();
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${uploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={spec.formats.join(',')}
          onChange={handleFileInput}
          className="hidden"
        />
        
        <div className="space-y-2">
          <FiUpload className="mx-auto h-8 w-8 text-gray-400" />
          <div className="text-sm text-gray-600">
            <span className="font-medium text-primary-600 hover:text-primary-500">
              Click to upload
            </span>
            {' '}or drag and drop
          </div>
          <div className="text-xs text-gray-500">
            {spec.formats.map(format => format.split('/')[1].toUpperCase()).join(', ')} up to {formatFileSize(spec.maxSize)}
          </div>
          <div className="text-xs text-gray-500">
            {spec.maxWidth}×{spec.maxHeight}px max
          </div>
        </div>
      </div>
      
      {/* Errors */}
      {errors.length > 0 && (
        <div className="space-y-1">
          {errors.map((error, index) => (
            <div key={index} className="flex items-center text-sm text-red-600">
              <FiAlertCircle className="mr-2 h-4 w-4" />
              {error}
            </div>
          ))}
        </div>
      )}
      
      {/* Current Image */}
      {currentImage && !previews.length && (
        <div className="relative inline-block">
          <img
            src={currentImage}
            alt="Current"
            className="h-24 w-24 object-cover rounded-lg border"
          />
          <button
            type="button"
            onClick={removeCurrentImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
          >
            <FiX className="h-3 w-3" />
          </button>
        </div>
      )}
      
      {/* Preview Images */}
      {showPreview && previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <img
                src={preview.thumbnail}
                alt={preview.originalName}
                className="w-full h-24 object-cover rounded-lg border"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>
              <div className="absolute bottom-1 left-1 right-1">
                <div className="bg-black bg-opacity-75 text-white text-xs p-1 rounded truncate">
                  {preview.originalName}
                </div>
                <div className="bg-black bg-opacity-75 text-white text-xs p-1 rounded">
                  {formatFileSize(preview.size)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Upload Progress */}
      {uploading && (
        <div className="flex items-center text-sm text-gray-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"></div>
          Processing images...
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
