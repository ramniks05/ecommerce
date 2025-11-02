import React, { useEffect, useState } from 'react';
import { FiEdit, FiEye, FiEyeOff, FiImage, FiPlus, FiSearch, FiStar, FiTrash2, FiUpload, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Modal from '../../components/Modal';
import { attributeService, brandService, categoryService, fileService, productService } from '../../services/supabaseService';

const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [attributeValues, setAttributeValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBrand, setFilterBrand] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    brand_id: '',
    category_id: '',
    sku: '',
    price: '',
    original_price: '',
    cost_price: '',
    discount_percentage: 0,
    stock_quantity: 0,
    min_stock_level: 5,
    weight: '',
    dimensions: { length: '', width: '', height: '' },
    images: [],
    image_groups: {
      main: [],
      gallery: [],
      thumbnails: [],
      lifestyle: [],
      detail: []
    },
    primary_image_index: 0,
    description: '',
    short_description: '',
    features: [],
    specifications: {},
    attributes: {},
    tags: [],
    is_featured: false,
    is_new: false,
    is_bestseller: false,
    is_active: true,
    meta_title: '',
    meta_description: ''
  });
  const [uploading, setUploading] = useState(false);
  const [newFeature, setNewFeature] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');
  const [activeImageGroup, setActiveImageGroup] = useState('main');

  useEffect(() => {
    const timeoutId = setTimeout(() => setLoading(false), 4000);
    loadData().finally(() => clearTimeout(timeoutId));
  }, []);

  const loadData = async () => {
    try {
      // Fetch core lists first (products, brands, categories)
      const [productsRes, brandsRes, categoriesRes] = await Promise.all([
        productService.getProducts(),
        brandService.getBrands(),
        categoryService.getCategoriesWithHierarchy()
      ]);

      if (productsRes?.error) console.error('Products load error:', productsRes.error);
      if (brandsRes?.error) console.error('Brands load error:', brandsRes.error);
      if (categoriesRes?.error) console.error('Categories load error:', categoriesRes.error);

      setProducts(productsRes?.data || []);
      setBrands(brandsRes?.data || []);
      setCategories(categoriesRes?.data || []);

      // Fetch attributes separately; don't block brand/category dropdowns if this fails
      try {
        const attributesRes = await attributeService.getAttributes();
        if (attributesRes?.error) {
          console.warn('Attributes load error:', attributesRes.error?.message || attributesRes.error);
          setAttributes([]);
          setAttributeValues({});
        } else {
          setAttributes(attributesRes.data || []);
          const valuesPromises = (attributesRes.data || []).map(async (attr) => {
            const { data: values } = await attributeService.getAttributeValues(attr.id);
            return { attributeId: attr.id, values: values || [] };
          });
          const valuesResults = await Promise.all(valuesPromises);
          const valuesMap = {};
          valuesResults.forEach(({ attributeId, values }) => {
            valuesMap[attributeId] = values;
          });
          setAttributeValues(valuesMap);
        }
      } catch (attrErr) {
        console.warn('Attributes fetch failed:', attrErr?.message || attrErr);
        setAttributes([]);
        setAttributeValues({});
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBrand = filterBrand === 'all' || product.brand_id === filterBrand;
    const matchesCategory = filterCategory === 'all' || product.category_id === filterCategory;
    return matchesSearch && matchesBrand && matchesCategory;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      // Normalize payload to match DB schema
      const grouped = formData.image_groups || {};
      const groupedAll = [
        ...(grouped.main || []),
        ...(grouped.gallery || []),
        ...(grouped.thumbnails || []),
        ...(grouped.lifestyle || []),
        ...(grouped.detail || [])
      ];

      const images = Array.from(new Set([...(formData.images || []), ...groupedAll]));

      const payload = {
        name: formData.name,
        slug: formData.slug,
        brand_id: formData.brand_id || null,
        category_id: formData.category_id || null,
        sku: formData.sku || null,
        price: formData.price === '' ? null : Number(formData.price),
        original_price: formData.original_price === '' ? null : Number(formData.original_price),
        cost_price: formData.cost_price === '' ? null : Number(formData.cost_price),
        discount_percentage: Number(formData.discount_percentage) || 0,
        stock_quantity: Number(formData.stock_quantity) || 0,
        min_stock_level: Number(formData.min_stock_level) || 0,
        weight: formData.weight === '' ? null : Number(formData.weight),
        dimensions: formData.dimensions || null,
        images,
        description: formData.description || null,
        short_description: formData.short_description || null,
        features: formData.features || [],
        specifications: formData.specifications || {},
        tags: formData.tags || [],
        is_featured: !!formData.is_featured,
        is_new: !!formData.is_new,
        is_bestseller: !!formData.is_bestseller,
        is_active: !!formData.is_active,
        meta_title: formData.meta_title || null,
        meta_description: formData.meta_description || null,
      };

      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, payload);
      } else {
        await productService.createProduct(payload);
      }
      
      setShowModal(false);
      setEditingProduct(null);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      slug: product.slug || '',
      brand_id: product.brand_id || '',
      category_id: product.category_id || '',
      sku: product.sku || '',
      price: product.price || '',
      original_price: product.original_price || '',
      cost_price: product.cost_price || '',
      discount_percentage: product.discount_percentage || 0,
      stock_quantity: product.stock_quantity || 0,
      min_stock_level: product.min_stock_level || 5,
      weight: product.weight || '',
      dimensions: product.dimensions || { length: '', width: '', height: '' },
      images: product.images || [],
      image_groups: product.image_groups || {
        main: [],
        gallery: [],
        thumbnails: [],
        lifestyle: [],
        detail: []
      },
      primary_image_index: product.primary_image_index || 0,
      description: product.description || '',
      short_description: product.short_description || '',
      features: product.features || [],
      specifications: product.specifications || {},
      attributes: product.attributes || {},
      tags: product.tags || [],
      is_featured: product.is_featured || false,
      is_new: product.is_new || false,
      is_bestseller: product.is_bestseller || false,
      is_active: product.is_active,
      meta_title: product.meta_title || '',
      meta_description: product.meta_description || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(id);
        loadData();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleToggleActive = async (product) => {
    try {
      await productService.updateProduct(product.id, { is_active: !product.is_active });
      loadData();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleToggleFeatured = async (product) => {
    try {
      await productService.updateProduct(product.id, { is_featured: !product.is_featured });
      loadData();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      brand_id: '',
      category_id: '',
      sku: '',
      price: '',
      original_price: '',
      cost_price: '',
      discount_percentage: 0,
      stock_quantity: 0,
      min_stock_level: 5,
      weight: '',
      dimensions: { length: '', width: '', height: '' },
      images: [],
      image_groups: {
        main: [],
        gallery: [],
        thumbnails: [],
        lifestyle: [],
        detail: []
      },
      primary_image_index: 0,
      description: '',
      short_description: '',
      features: [],
      specifications: {},
      attributes: {},
      tags: [],
      is_featured: false,
      is_new: false,
      is_bestseller: false,
      is_active: true,
      meta_title: '',
      meta_description: ''
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

  const handleImageUpload = async (files) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Resize/compress to product spec before upload
        let fileToUpload = file;
        try {
          const { processImage, IMAGE_SPECS } = await import('../../utils/imageUtils');
          const blob = await processImage(file, IMAGE_SPECS.PRODUCT_IMAGE);
          fileToUpload = new File([blob], file.name, { type: file.type });
        } catch (_) {}
        const fileName = `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${file.name.split('.').pop()}`;
        const { data, error } = await fileService.uploadFile('product-images', fileToUpload, fileName);
        
        if (error) throw error;
        
        return fileService.getPublicUrl('product-images', data.path);
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }));
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setUploading(false);
    }
  };

  const setPrimaryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      primary_image_index: index
    }));
  };

  // Image group management functions
  const handleImageGroupUpload = async (files, groupType) => {
    if (!files || files.length === 0) return;
    
    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Resize/compress to product spec before upload
        let fileToUpload = file;
        try {
          const { processImage, IMAGE_SPECS } = await import('../../utils/imageUtils');
          const blob = await processImage(file, IMAGE_SPECS.PRODUCT_IMAGE);
          fileToUpload = new File([blob], file.name, { type: file.type });
        } catch (_) {}
        const fileName = `product-${groupType}-${Date.now()}-${Math.random().toString(36).slice(2)}.${file.name.split('.').pop()}`;
        const { data, error } = await fileService.uploadFile('product-images', fileToUpload, fileName);
        if (error) throw error;
        return fileService.getPublicUrl('product-images', data.path);
      });
      const uploadedUrls = await Promise.all(uploadPromises);
      
      setFormData(prev => ({
        ...prev,
        image_groups: {
          ...prev.image_groups,
          [groupType]: [...prev.image_groups[groupType], ...uploadedUrls]
        }
      }));
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setUploading(false);
    }
  };

  const removeImageFromGroup = (groupType, index) => {
    setFormData(prev => ({
      ...prev,
      image_groups: {
        ...prev.image_groups,
        [groupType]: prev.image_groups[groupType].filter((_, i) => i !== index)
      }
    }));
  };

  const moveImageBetweenGroups = (fromGroup, toGroup, imageIndex) => {
    const image = formData.image_groups[fromGroup][imageIndex];
    setFormData(prev => ({
      ...prev,
      image_groups: {
        ...prev.image_groups,
        [fromGroup]: prev.image_groups[fromGroup].filter((_, i) => i !== imageIndex),
        [toGroup]: [...prev.image_groups[toGroup], image]
      }
    }));
  };

  // Helper function to flatten categories for filtering
  const getAllCategories = (categories) => {
    const result = [];
    categories.forEach(category => {
      result.push(category);
      if (category.children) {
        result.push(...getAllCategories(category.children));
      }
    });
    return result;
  };

  const allCategories = getAllCategories(categories);

  // Helper function to get category name by ID
  const getCategoryName = (categoryId) => {
    const category = allCategories.find(cat => cat.id === categoryId);
    return category ? category.name : 'N/A';
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const addSpecification = () => {
    if (newSpecKey.trim() && newSpecValue.trim()) {
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [newSpecKey.trim()]: newSpecValue.trim()
        }
      }));
      setNewSpecKey('');
      setNewSpecValue('');
    }
  };

  const removeSpecification = (key) => {
    setFormData(prev => {
      const newSpecs = { ...prev.specifications };
      delete newSpecs[key];
      return { ...prev, specifications: newSpecs };
    });
  };

  const addTag = () => {
    if (newTag.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (index) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
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
          <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingProduct(null);
            setShowModal(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <FiPlus size={20} />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <select
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Brands</option>
            {brands.map(brand => (
              <option key={brand.id} value={brand.id}>{brand.name}</option>
            ))}
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Categories</option>
            {allCategories.map(category => (
              <option key={category.id} value={category.id}>
                {category.parent_id ? `└ ${category.name}` : category.name}
              </option>
            ))}
          </select>

          <div className="text-sm text-gray-600 flex items-center">
            {filteredProducts.length} of {products.length} products
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Brand
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        {(() => {
                          // Try to get main image first, then fallback to regular images
                          const mainImages = product.image_groups?.main || [];
                          const regularImages = product.images || [];
                          const displayImage = mainImages[0] || regularImages[product.primary_image_index || 0];
                          
                          return displayImage ? (
                            <Link to={`/products/${product.slug}`} title="View product">
                              <img
                                className="h-12 w-12 object-cover rounded"
                                src={displayImage}
                                alt={product.name}
                              />
                            </Link>
                          ) : (
                            <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center">
                              <FiImage className="text-gray-400" size={20} />
                            </div>
                          );
                        })()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">SKU: {product.sku || 'N/A'}</div>
                        {product.image_groups && (
                          <div className="flex gap-1 mt-1">
                            {Object.entries(product.image_groups).map(([group, images]) => (
                              images.length > 0 && (
                                <span
                                  key={group}
                                  className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-600"
                                  title={`${group}: ${images.length} images`}
                                >
                                  {group.charAt(0).toUpperCase()}: {images.length}
                                </span>
                              )
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.brands?.name || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{getCategoryName(product.category_id)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">₹{product.price}</div>
                    {product.original_price && (
                      <div className="text-sm text-gray-500 line-through">₹{product.original_price}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      product.stock_quantity > 0
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.stock_quantity} units
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleFeatured(product)}
                        className={`p-1 rounded ${
                          product.is_featured 
                            ? 'bg-yellow-100 text-yellow-600' 
                            : 'bg-gray-100 text-gray-400'
                        }`}
                        title={product.is_featured ? 'Featured' : 'Not Featured'}
                      >
                        <FiStar size={14} />
                      </button>
                      <button
                        onClick={() => handleToggleActive(product)}
                        className={`p-1 rounded ${
                          product.is_active 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-gray-100 text-gray-400'
                        }`}
                        title={product.is_active ? 'Active' : 'Inactive'}
                      >
                        {product.is_active ? <FiEye size={14} /> : <FiEyeOff size={14} />}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <div className="p-5">
          <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name *
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Brand *
                    </label>
                    <select
                      required
                      value={formData.brand_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, brand_id: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select Brand</option>
                      {brands.map(brand => (
                        <option key={brand.id} value={brand.id}>{brand.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      required
                      value={formData.category_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <React.Fragment key={category.id}>
                          {/* parent */}
                          <option value={category.id}>{category.name}</option>
                          {category.children && category.children.map(subcategory => (
                            <option key={subcategory.id} value={subcategory.id}>
                              &nbsp;&nbsp;└ {subcategory.name}
                            </option>
                          ))}
                        </React.Fragment>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SKU
                    </label>
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.price === null || formData.price === undefined ? '' : formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value === '' ? '' : e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Original Price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.original_price === null || formData.original_price === undefined ? '' : formData.original_price}
                      onChange={(e) => setFormData(prev => ({ ...prev, original_price: e.target.value === '' ? '' : e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cost Price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.cost_price === null || formData.cost_price === undefined ? '' : formData.cost_price}
                      onChange={(e) => setFormData(prev => ({ ...prev, cost_price: e.target.value === '' ? '' : e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                {/* Stock */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      value={formData.stock_quantity === null || formData.stock_quantity === undefined ? '' : formData.stock_quantity}
                      onChange={(e) => {
                        const value = e.target.value === '' ? '' : (isNaN(parseInt(e.target.value)) ? '' : parseInt(e.target.value));
                        setFormData(prev => ({ ...prev, stock_quantity: value }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Min Stock Level
                    </label>
                    <input
                      type="number"
                      value={formData.min_stock_level === null || formData.min_stock_level === undefined ? '' : formData.min_stock_level}
                      onChange={(e) => {
                        const value = e.target.value === '' ? '' : (isNaN(parseInt(e.target.value)) ? '' : parseInt(e.target.value));
                        setFormData(prev => ({ ...prev, min_stock_level: value }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                {/* Product Images - Grouped Management */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Product Images
                  </label>
                  
                  {/* Image Group Tabs */}
                  <div className="flex flex-wrap gap-2 mb-4 border-b border-gray-200">
                    {Object.keys(formData.image_groups).map((groupType) => (
                      <button
                        key={groupType}
                        type="button"
                        onClick={() => setActiveImageGroup(groupType)}
                        className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                          activeImageGroup === groupType
                            ? 'bg-primary-100 text-primary-700 border-b-2 border-primary-500'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {groupType.charAt(0).toUpperCase() + groupType.slice(1)} 
                        ({formData.image_groups[groupType].length})
                      </button>
                    ))}
                  </div>

                  {/* Active Group Image Management */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-medium text-gray-900">
                        {activeImageGroup.charAt(0).toUpperCase() + activeImageGroup.slice(1)} Images
                      </h4>
                      <div className="text-sm text-gray-500">
                        {formData.image_groups[activeImageGroup].length} images
                      </div>
                    </div>

                    {/* Upload Area for Active Group */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleImageGroupUpload(e.target.files, activeImageGroup)}
                        className="hidden"
                        id={`upload-${activeImageGroup}`}
                      />
                      <label
                        htmlFor={`upload-${activeImageGroup}`}
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <FiUpload className="h-8 w-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">
                          Click to upload {activeImageGroup} images
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                          PNG, JPG, WEBP up to 10MB each
                        </span>
                      </label>
                    </div>

                    {/* Display Images in Active Group */}
                    {formData.image_groups[activeImageGroup].length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {formData.image_groups[activeImageGroup].map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image}
                              alt={`${activeImageGroup} ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border border-gray-200"
                            />
                            
                            {/* Image Actions */}
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                                {/* Move to other groups */}
                                {Object.keys(formData.image_groups).map((targetGroup) => (
                                  targetGroup !== activeImageGroup && (
                                    <button
                                      key={targetGroup}
                                      type="button"
                                      onClick={() => moveImageBetweenGroups(activeImageGroup, targetGroup, index)}
                                      className="p-1 bg-white text-gray-700 rounded hover:bg-gray-100"
                                      title={`Move to ${targetGroup}`}
                                    >
                                      <FiImage size={14} />
                                    </button>
                                  )
                                ))}
                                
                                {/* Remove image */}
                                <button
                                  type="button"
                                  onClick={() => removeImageFromGroup(activeImageGroup, index)}
                                  className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                                  title="Remove image"
                                >
                                  <FiX size={14} />
                                </button>
                              </div>
                            </div>

                            {/* Image index badge */}
                            <div className="absolute top-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                              {index + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Group Description */}
                    <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
                      <strong>{activeImageGroup.charAt(0).toUpperCase() + activeImageGroup.slice(1)} Images:</strong>{' '}
                      {activeImageGroup === 'main' && 'Primary product images shown on listing pages'}
                      {activeImageGroup === 'gallery' && 'Additional images for product gallery'}
                      {activeImageGroup === 'thumbnails' && 'Small images for quick previews'}
                      {activeImageGroup === 'lifestyle' && 'Lifestyle images showing product in use'}
                      {activeImageGroup === 'detail' && 'Detailed close-up images of features'}
                    </div>
                  </div>
                </div>

                {/* Descriptions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Short Description
                  </label>
                  <textarea
                    rows={2}
                    value={formData.short_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Description
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {/* Features */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Features
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Add a feature"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <button
                      type="button"
                      onClick={addFeature}
                      className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                    >
                      Add
                    </button>
                  </div>
                  {formData.features.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.features.map((feature, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                        >
                          {feature}
                          <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="ml-2 text-primary-600 hover:text-primary-800"
                          >
                            <FiX size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                    >
                      Add
                    </button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(index)}
                            className="ml-2 text-gray-600 hover:text-gray-800"
                          >
                            <FiX size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Attributes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Attributes
                  </label>
                  <div className="space-y-4">
                    {attributes.filter(attr => attr.is_active).map((attribute) => (
                      <div key={attribute.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium text-gray-700">
                            {attribute.name}
                            {attribute.is_required && <span className="text-red-500 ml-1">*</span>}
                          </label>
                          <span className="text-xs text-gray-500 capitalize">
                            {attribute.type.replace('_', ' ')}
                          </span>
                        </div>
                        
                        {attribute.type === 'select' && (
                          <select
                            value={formData.attributes[attribute.id] || ''}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              attributes: {
                                ...prev.attributes,
                                [attribute.id]: e.target.value
                              }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          >
                            <option value="">Select {attribute.name}</option>
                            {attributeValues[attribute.id]?.map(value => (
                              <option key={value.id} value={value.value}>
                                {value.label || value.value}
                              </option>
                            ))}
                          </select>
                        )}
                        
                        {attribute.type === 'text' && (
                          <input
                            type="text"
                            value={formData.attributes[attribute.id] || ''}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              attributes: {
                                ...prev.attributes,
                                [attribute.id]: e.target.value
                              }
                            }))}
                            placeholder={`Enter ${attribute.name}`}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        )}
                        
                        {attribute.type === 'number' && (
                          <input
                            type="number"
                            value={formData.attributes[attribute.id] || ''}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              attributes: {
                                ...prev.attributes,
                                [attribute.id]: e.target.value
                              }
                            }))}
                            placeholder={`Enter ${attribute.name}`}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        )}
                        
                        {attribute.type === 'textarea' && (
                          <textarea
                            rows={3}
                            value={formData.attributes[attribute.id] || ''}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              attributes: {
                                ...prev.attributes,
                                [attribute.id]: e.target.value
                              }
                            }))}
                            placeholder={`Enter ${attribute.name}`}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        )}
                        
                        {attribute.type === 'color' && (
                          <input
                            type="color"
                            value={formData.attributes[attribute.id] || '#000000'}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              attributes: {
                                ...prev.attributes,
                                [attribute.id]: e.target.value
                              }
                            }))}
                            className="w-full h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        )}
                        
                        {attribute.type === 'date' && (
                          <input
                            type="date"
                            value={formData.attributes[attribute.id] || ''}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              attributes: {
                                ...prev.attributes,
                                [attribute.id]: e.target.value
                              }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        )}
                        
                        {attribute.type === 'checkbox' && (
                          <div className="space-y-2">
                            {attributeValues[attribute.id]?.map(value => (
                              <label key={value.id} className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={formData.attributes[attribute.id]?.includes(value.value) || false}
                                  onChange={(e) => {
                                    const currentValues = formData.attributes[attribute.id] || [];
                                    const newValues = e.target.checked
                                      ? [...currentValues, value.value]
                                      : currentValues.filter(v => v !== value.value);
                                    setFormData(prev => ({
                                      ...prev,
                                      attributes: {
                                        ...prev.attributes,
                                        [attribute.id]: newValues
                                      }
                                    }));
                                  }}
                                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                />
                                <span className="ml-2 text-sm text-gray-900">
                                  {value.label || value.value}
                                </span>
                                {value.color && (
                                  <div 
                                    className="ml-2 w-4 h-4 rounded-full border"
                                    style={{ backgroundColor: value.color }}
                                  />
                                )}
                              </label>
                            ))}
                          </div>
                        )}
                        
                        {attribute.type === 'radio' && (
                          <div className="space-y-2">
                            {attributeValues[attribute.id]?.map(value => (
                              <label key={value.id} className="flex items-center">
                                <input
                                  type="radio"
                                  name={`attribute_${attribute.id}`}
                                  value={value.value}
                                  checked={formData.attributes[attribute.id] === value.value}
                                  onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    attributes: {
                                      ...prev.attributes,
                                      [attribute.id]: e.target.value
                                    }
                                  }))}
                                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                                />
                                <span className="ml-2 text-sm text-gray-900">
                                  {value.label || value.value}
                                </span>
                                {value.color && (
                                  <div 
                                    className="ml-2 w-4 h-4 rounded-full border"
                                    style={{ backgroundColor: value.color }}
                                  />
                                )}
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Specifications */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specifications
                  </label>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <input
                      type="text"
                      value={newSpecKey}
                      onChange={(e) => setNewSpecKey(e.target.value)}
                      placeholder="Specification name"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <input
                      type="text"
                      value={newSpecValue}
                      onChange={(e) => setNewSpecValue(e.target.value)}
                      placeholder="Specification value"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addSpecification}
                    className="mb-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                  >
                    Add Specification
                  </button>
                  {Object.keys(formData.specifications).length > 0 && (
                    <div className="space-y-1">
                      {Object.entries(formData.specifications).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span className="text-sm"><strong>{key}:</strong> {value}</span>
                          <button
                            type="button"
                            onClick={() => removeSpecification(key)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <FiX size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* SKU and Weight */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SKU
                    </label>
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.weight === null || formData.weight === undefined ? '' : formData.weight}
                      onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value === '' ? '' : e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                {/* Dimensions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dimensions (cm)
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Length</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.dimensions?.length || ''}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          dimensions: { ...(prev.dimensions || {}), length: e.target.value === '' ? '' : e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Width</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.dimensions?.width || ''}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          dimensions: { ...(prev.dimensions || {}), width: e.target.value === '' ? '' : e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Height</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.dimensions?.height || ''}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          dimensions: { ...(prev.dimensions || {}), height: e.target.value === '' ? '' : e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Discount and Min Stock */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Percentage
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.discount_percentage === null || formData.discount_percentage === undefined ? 0 : formData.discount_percentage}
                      onChange={(e) => {
                        const value = e.target.value === '' ? 0 : (isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value));
                        setFormData(prev => ({ ...prev, discount_percentage: value }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Min Stock Level
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.min_stock_level === null || formData.min_stock_level === undefined ? '' : formData.min_stock_level}
                      onChange={(e) => {
                        const value = e.target.value === '' ? '' : (isNaN(parseInt(e.target.value)) ? '' : parseInt(e.target.value));
                        setFormData(prev => ({ ...prev, min_stock_level: value }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                    >
                      Add
                    </button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(index)}
                            className="ml-2 text-primary-600 hover:text-primary-800"
                          >
                            <FiX size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* SEO Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      value={formData.meta_title}
                      onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="SEO title for search engines"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meta Description
                    </label>
                    <textarea
                      rows={3}
                      value={formData.meta_description}
                      onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="SEO description for search engines"
                    />
                  </div>
                </div>

                {/* Status Options */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                      checked={formData.is_new}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_new: e.target.checked }))}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-900">New</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.is_bestseller}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_bestseller: e.target.checked }))}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-900">Bestseller</span>
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
                    {uploading ? 'Saving...' : editingProduct ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
      </Modal>
    </div>
  );
};

export default ProductsManagement;