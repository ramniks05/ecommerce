import { useEffect, useState } from 'react';
import { FiEdit, FiExternalLink, FiEye, FiEyeOff, FiImage, FiPlus, FiStar, FiTrash2, FiX } from 'react-icons/fi';
import ImageUploader from '../../components/ImageUploader';
import Modal from '../../components/Modal';
import { brandService, fileService } from '../../services/supabaseService';

const BrandManagement = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    story: '',
    logo_url: '',
    hero_image_url: '',
    website_url: '',
    founded_year: '',
    country: '',
    categories: [],
    is_featured: false,
    is_active: true,
    sort_order: 0
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => setLoading(false), 4000);
    loadBrands().finally(() => clearTimeout(timeoutId));
  }, []);

  const loadBrands = async () => {
    try {
      const { data, error } = await brandService.getBrands();
      if (error) throw error;
      setBrands(data || []);
    } catch (error) {
      console.error('Error loading brands:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      console.log('Saving brand with data:', formData);
      
      if (editingBrand) {
        const result = await brandService.updateBrand(editingBrand.id, formData);
        console.log('Update result:', result);
        if (result.error) throw result.error;
        alert('Brand updated successfully!');
      } else {
        const result = await brandService.createBrand(formData);
        console.log('Create result:', result);
        if (result.error) throw result.error;
        alert('Brand created successfully!');
      }
      
      setShowModal(false);
      setEditingBrand(null);
      resetForm();
      loadBrands();
    } catch (error) {
      console.error('Error saving brand:', error);
      alert('Error saving brand: ' + (error.message || 'Please check console for details'));
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name || '',
      slug: brand.slug || '',
      description: brand.description || '',
      story: brand.story || '',
      logo_url: brand.logo_url || '',
      hero_image_url: brand.hero_image_url || '',
      website_url: brand.website_url || '',
      founded_year: brand.founded_year || '',
      country: brand.country || '',
      categories: brand.categories || [],
      is_featured: brand.is_featured || false,
      is_active: brand.is_active,
      sort_order: brand.sort_order || 0
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this brand?')) {
      try {
        await brandService.deleteBrand(id);
        loadBrands();
      } catch (error) {
        console.error('Error deleting brand:', error);
      }
    }
  };

  const handleToggleActive = async (brand) => {
    try {
      await brandService.updateBrand(brand.id, { is_active: !brand.is_active });
      loadBrands();
    } catch (error) {
      console.error('Error updating brand:', error);
    }
  };

  const handleToggleFeatured = async (brand) => {
    try {
      await brandService.updateBrand(brand.id, { is_featured: !brand.is_featured });
      loadBrands();
    } catch (error) {
      console.error('Error updating brand:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      story: '',
      logo_url: '',
      hero_image_url: '',
      website_url: '',
      founded_year: '',
      country: '',
      categories: [],
      is_featured: false,
      is_active: true,
      sort_order: 0
    });
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  };

  const handleNameChange = (name) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }));
  };

  const handleImageUpload = async (file, type = 'logo') => {
    if (!file) return;

    try {
      const fileName = `brand-${Date.now()}-${type}.${file.name.split('.').pop()}`;
      const bucketName = type === 'logo' ? 'brand-logos' : 'brand-heroes';
      
      const { data, error } = await fileService.uploadFile(
        bucketName, 
        file, 
        fileName
      );
      
      if (error) {
        console.error(`Upload error for ${type}:`, error);
        throw error;
      }
      
      const publicUrl = fileService.getPublicUrl(bucketName, data.path);
      
      if (type === 'logo') {
        setFormData(prev => ({ ...prev, logo_url: publicUrl }));
      } else {
        setFormData(prev => ({ ...prev, hero_image_url: publicUrl }));
      }
    } catch (error) {
      console.error(`Error uploading ${type} image:`, error);
      alert(`Error uploading ${type} image: ${error.message}`);
    }
  };

  const handleLogoUpload = async (file) => {
    if (file) {
      await handleImageUpload(file, 'logo');
    }
  };

  const handleHeroUpload = async (file) => {
    if (file) {
      await handleImageUpload(file, 'hero');
    }
  };

  const handleLogoRemove = () => {
    setFormData(prev => ({ ...prev, logo_url: '' }));
  };

  const handleHeroRemove = () => {
    setFormData(prev => ({ ...prev, hero_image_url: '' }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Brand Management</h1>
          <p className="text-gray-600">Manage brand information and assets</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingBrand(null);
            setShowModal(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <FiPlus size={20} />
          Add Brand
        </button>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {brands.map((brand) => (
          <div key={brand.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <div className="brand-card-container">
              {brand.hero_image_url ? (
                <img
                  src={brand.hero_image_url}
                  alt={brand.name}
                  className="brand-card-image"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <FiImage size={48} className="text-gray-400" />
                </div>
              )}
              
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => handleToggleFeatured(brand)}
                  className={`p-2 rounded-full ${
                    brand.is_featured 
                      ? 'bg-yellow-500 text-white' 
                      : 'bg-white text-gray-600'
                  }`}
                  title={brand.is_featured ? 'Featured' : 'Not Featured'}
                >
                  <FiStar size={16} />
                </button>
                <button
                  onClick={() => handleToggleActive(brand)}
                  className={`p-2 rounded-full ${
                    brand.is_active 
                      ? 'bg-green-500 text-white' 
                      : 'bg-white text-gray-600'
                  }`}
                  title={brand.is_active ? 'Active' : 'Inactive'}
                >
                  {brand.is_active ? <FiEye size={16} /> : <FiEyeOff size={16} />}
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                {brand.logo_url ? (
                  <img
                    src={brand.logo_url}
                    alt={`${brand.name} logo`}
                    className="w-12 h-12 object-contain"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                    <FiImage size={20} className="text-gray-400" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-gray-900">{brand.name}</h3>
                  {brand.founded_year && (
                    <p className="text-sm text-gray-500">Founded {brand.founded_year}</p>
                  )}
                </div>
              </div>

              {brand.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {brand.description}
                </p>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {brand.website_url && (
                    <a
                      href={brand.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-800"
                      title="Visit Website"
                    >
                      <FiExternalLink size={16} />
                    </a>
                  )}
                  <span className="text-xs text-gray-500">
                    {brand.categories?.length || 0} categories
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(brand)}
                    className="text-primary-600 hover:text-primary-800"
                    title="Edit"
                  >
                    <FiEdit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(brand.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <div className="p-5">
          <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingBrand ? 'Edit Brand' : 'Add New Brand'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Brand Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Slug *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand Story
                  </label>
                  <textarea
                    rows={4}
                    value={formData.story}
                    onChange={(e) => setFormData(prev => ({ ...prev, story: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ImageUploader
                    onUpload={handleLogoUpload}
                    onRemove={handleLogoRemove}
                    currentImage={formData.logo_url}
                    specType="BRAND_LOGO"
                    label="Brand Logo"
                    required={true}
                    className="w-full"
                  />

                  <ImageUploader
                    onUpload={handleHeroUpload}
                    onRemove={handleHeroRemove}
                    currentImage={formData.hero_image_url}
                    specType="BRAND_HERO"
                    label="Hero Image"
                    required={false}
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website URL
                    </label>
                    <input
                      type="url"
                      value={formData.website_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, website_url: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Founded Year
                    </label>
                    <input
                      type="number"
                      value={formData.founded_year}
                      onChange={(e) => setFormData(prev => ({ ...prev, founded_year: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sort Order
                    </label>
                    <input
                      type="number"
                      value={formData.sort_order}
                      onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div className="flex items-center gap-6 pt-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.is_featured}
                        onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-900">Featured</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-900">Active</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
                  >
                    {uploading ? 'Saving...' : editingBrand ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
      </Modal>
    </div>
  );
};

export default BrandManagement;
