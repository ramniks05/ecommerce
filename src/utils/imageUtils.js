// Image processing and validation utilities

// Standard image specifications for ecommerce
export const IMAGE_SPECS = {
  // Brand logos - square format
  BRAND_LOGO: {
    maxSize: 1024 * 1024, // 1MB
    maxWidth: 512,
    maxHeight: 512,
    aspectRatio: 1, // 1:1
    formats: ['image/jpeg', 'image/png', 'image/webp'],
    quality: 0.9
  },
  
  // Brand hero images - wide format
  BRAND_HERO: {
    maxSize: 2 * 1024 * 1024, // 2MB
    maxWidth: 1920,
    maxHeight: 1080,
    aspectRatio: 16/9, // 16:9
    formats: ['image/jpeg', 'image/png', 'image/webp'],
    quality: 0.85
  },
  
  // Category icons - square format
  CATEGORY_ICON: {
    maxSize: 512 * 1024, // 512KB
    maxWidth: 256,
    maxHeight: 256,
    aspectRatio: 1, // 1:1
    formats: ['image/jpeg', 'image/png', 'image/webp'],
    quality: 0.9
  },
  
  // Category hero images - wide format
  CATEGORY_HERO: {
    maxSize: 2 * 1024 * 1024, // 2MB
    maxWidth: 1920,
    maxHeight: 1080,
    aspectRatio: 16/9, // 16:9
    formats: ['image/jpeg', 'image/png', 'image/webp'],
    quality: 0.85
  },
  
  // Product images - square format
  PRODUCT_IMAGE: {
    maxSize: 2 * 1024 * 1024, // 2MB
    maxWidth: 1200,
    maxHeight: 1200,
    aspectRatio: 1, // 1:1
    formats: ['image/jpeg', 'image/png', 'image/webp'],
    quality: 0.9
  },
  
  // Banner images - ultra-wide format
  BANNER_IMAGE: {
    maxSize: 3 * 1024 * 1024, // 3MB
    maxWidth: 1920,
    maxHeight: 600,
    aspectRatio: 16/5, // 21:9 equivalent
    formats: ['image/jpeg', 'image/png', 'image/webp'],
    quality: 0.85
  }
};

// Validate file against specifications
export const validateImage = (file, spec) => {
  const errors = [];
  
  // Check file type
  if (!spec.formats.includes(file.type)) {
    errors.push(`File must be one of: ${spec.formats.join(', ')}`);
  }
  
  // Check file size
  if (file.size > spec.maxSize) {
    const maxSizeMB = (spec.maxSize / (1024 * 1024)).toFixed(1);
    errors.push(`File size must be less than ${maxSizeMB}MB`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Compress and resize image
export const processImage = (file, spec) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions maintaining aspect ratio
      let { width, height } = img;
      const aspectRatio = width / height;
      
      if (aspectRatio > spec.aspectRatio) {
        // Image is wider than target ratio
        width = Math.min(width, spec.maxWidth);
        height = width / spec.aspectRatio;
      } else {
        // Image is taller than target ratio
        height = Math.min(height, spec.maxHeight);
        width = height * spec.aspectRatio;
      }
      
      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        file.type,
        spec.quality
      );
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

// Generate thumbnail
export const generateThumbnail = (file, size = 150) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate thumbnail dimensions maintaining aspect ratio
      let { width, height } = img;
      const aspectRatio = width / height;
      
      if (width > height) {
        width = size;
        height = size / aspectRatio;
      } else {
        height = size;
        width = size * aspectRatio;
      }
      
      canvas.width = size;
      canvas.height = size;
      
      // Center the image
      const x = (size - width) / 2;
      const y = (size - height) / 2;
      
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, x, y, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(URL.createObjectURL(blob));
          } else {
            reject(new Error('Failed to generate thumbnail'));
          }
        },
        'image/jpeg',
        0.8
      );
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

// Format file size for display
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Get image dimensions
export const getImageDimensions = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};
