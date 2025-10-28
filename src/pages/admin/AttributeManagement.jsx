import { useEffect, useState } from 'react';
import { FiChevronDown, FiChevronRight, FiEdit, FiEye, FiEyeOff, FiPlus, FiTrash2, FiX } from 'react-icons/fi';
import Modal from '../../components/Modal';
import { attributeService } from '../../services/supabaseService';

const AttributeManagement = () => {
  const [attributes, setAttributes] = useState([]);
  const [attributeValues, setAttributeValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showValueModal, setShowValueModal] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState(null);
  const [editingValue, setEditingValue] = useState(null);
  const [expandedAttributes, setExpandedAttributes] = useState(new Set());
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    type: 'select',
    description: '',
    is_required: false,
    is_filterable: true,
    is_active: true,
    sort_order: 0
  });
  const [valueFormData, setValueFormData] = useState({
    value: '',
    label: '',
    color: '',
    image_url: '',
    sort_order: 0,
    is_active: true
  });

  const attributeTypes = [
    { value: 'select', label: 'Dropdown Select' },
    { value: 'radio', label: 'Radio Buttons' },
    { value: 'checkbox', label: 'Checkboxes' },
    { value: 'text', label: 'Text Input' },
    { value: 'textarea', label: 'Text Area' },
    { value: 'number', label: 'Number Input' },
    { value: 'color', label: 'Color Picker' },
    { value: 'date', label: 'Date Picker' }
  ];

  useEffect(() => {
    loadAttributes();
  }, []);

  const loadAttributes = async () => {
    try {
      const { data, error } = await attributeService.getAttributes();
      if (error) throw error;
      setAttributes(data || []);
      
      // Load values for each attribute
      const valuesPromises = (data || []).map(async (attr) => {
        const { data: values } = await attributeService.getAttributeValues(attr.id);
        return { attributeId: attr.id, values: values || [] };
      });
      
      const valuesResults = await Promise.all(valuesPromises);
      const valuesMap = {};
      valuesResults.forEach(({ attributeId, values }) => {
        valuesMap[attributeId] = values;
      });
      setAttributeValues(valuesMap);
    } catch (error) {
      console.error('Error loading attributes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAttribute) {
        await attributeService.updateAttribute(editingAttribute.id, formData);
      } else {
        await attributeService.createAttribute(formData);
      }
      
      setShowModal(false);
      setEditingAttribute(null);
      resetForm();
      loadAttributes();
    } catch (error) {
      console.error('Error saving attribute:', error);
    }
  };

  const handleValueSubmit = async (e) => {
    e.preventDefault();
    try {
      const attributeId = editingValue?.attribute_id || editingAttribute?.id;
      if (!attributeId) return;

      if (editingValue) {
        await attributeService.updateAttributeValue(editingValue.id, valueFormData);
      } else {
        await attributeService.createAttributeValue({
          ...valueFormData,
          attribute_id: attributeId
        });
      }
      
      setShowValueModal(false);
      setEditingValue(null);
      resetValueForm();
      loadAttributes();
    } catch (error) {
      console.error('Error saving attribute value:', error);
    }
  };

  const handleEdit = (attribute) => {
    setEditingAttribute(attribute);
    setFormData({
      name: attribute.name || '',
      slug: attribute.slug || '',
      type: attribute.type || 'select',
      description: attribute.description || '',
      is_required: attribute.is_required || false,
      is_filterable: attribute.is_filterable !== false,
      is_active: attribute.is_active !== false,
      sort_order: attribute.sort_order || 0
    });
    setShowModal(true);
  };

  const handleValueEdit = (value, attributeId) => {
    setEditingValue(value);
    setEditingAttribute({ id: attributeId });
    setValueFormData({
      value: value.value || '',
      label: value.label || '',
      color: value.color || '',
      image_url: value.image_url || '',
      sort_order: value.sort_order || 0,
      is_active: value.is_active !== false
    });
    setShowValueModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this attribute? This will also delete all its values.')) {
      try {
        await attributeService.deleteAttribute(id);
        loadAttributes();
      } catch (error) {
        console.error('Error deleting attribute:', error);
      }
    }
  };

  const handleValueDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this attribute value?')) {
      try {
        await attributeService.deleteAttributeValue(id);
        loadAttributes();
      } catch (error) {
        console.error('Error deleting attribute value:', error);
      }
    }
  };

  const handleToggleActive = async (attribute) => {
    try {
      await attributeService.updateAttribute(attribute.id, { is_active: !attribute.is_active });
      loadAttributes();
    } catch (error) {
      console.error('Error updating attribute:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      type: 'select',
      description: '',
      is_required: false,
      is_filterable: true,
      is_active: true,
      sort_order: 0
    });
  };

  const resetValueForm = () => {
    setValueFormData({
      value: '',
      label: '',
      color: '',
      image_url: '',
      sort_order: 0,
      is_active: true
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

  const toggleExpanded = (attributeId) => {
    const newExpanded = new Set(expandedAttributes);
    if (newExpanded.has(attributeId)) {
      newExpanded.delete(attributeId);
    } else {
      newExpanded.add(attributeId);
    }
    setExpandedAttributes(newExpanded);
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
          <h1 className="text-2xl font-bold text-gray-900">Attribute Management</h1>
          <p className="text-gray-600">Manage product attributes and their values</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingAttribute(null);
            setShowModal(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <FiPlus size={20} />
          Add Attribute
        </button>
      </div>

      {/* Attributes List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attribute
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Values
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
              {attributes.map((attribute) => (
                <React.Fragment key={attribute.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <button
                          onClick={() => toggleExpanded(attribute.id)}
                          className="mr-2 p-1 hover:bg-gray-200 rounded"
                        >
                          {expandedAttributes.has(attribute.id) ? (
                            <FiChevronDown size={16} />
                          ) : (
                            <FiChevronRight size={16} />
                          )}
                        </button>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{attribute.name}</div>
                          <div className="text-sm text-gray-500">{attribute.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {attributeTypes.find(t => t.value === attribute.type)?.label || attribute.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {attributeValues[attribute.id]?.length || 0} values
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleActive(attribute)}
                          className={`p-1 rounded ${
                            attribute.is_active 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-gray-100 text-gray-400'
                          }`}
                          title={attribute.is_active ? 'Active' : 'Inactive'}
                        >
                          {attribute.is_active ? <FiEye size={14} /> : <FiEyeOff size={14} />}
                        </button>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          attribute.is_required 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {attribute.is_required ? 'Required' : 'Optional'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingAttribute(attribute);
                            setShowValueModal(true);
                            resetValueForm();
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="Add Value"
                        >
                          <FiPlus size={16} />
                        </button>
                        <button
                          onClick={() => handleEdit(attribute)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <FiEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(attribute.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  {/* Attribute Values */}
                  {expandedAttributes.has(attribute.id) && attributeValues[attribute.id] && (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 bg-gray-50">
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-gray-900">Attribute Values</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {attributeValues[attribute.id].map((value) => (
                              <div key={value.id} className="flex items-center justify-between bg-white p-3 rounded border">
                                <div className="flex items-center gap-2">
                                  {value.color && (
                                    <div 
                                      className="w-4 h-4 rounded-full border"
                                      style={{ backgroundColor: value.color }}
                                    />
                                  )}
                                  <div>
                                    <div className="text-sm font-medium">{value.label || value.value}</div>
                                    <div className="text-xs text-gray-500">{value.value}</div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleValueEdit(value, attribute.id)}
                                    className="text-primary-600 hover:text-primary-900 p-1"
                                  >
                                    <FiEdit size={12} />
                                  </button>
                                  <button
                                    onClick={() => handleValueDelete(value.id)}
                                    className="text-red-600 hover:text-red-900 p-1"
                                  >
                                    <FiTrash2 size={12} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attribute Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <div className="p-5">
          <div className="mt-3">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingAttribute ? 'Edit Attribute' : 'Add New Attribute'}
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
                    Attribute Name *
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
                  Attribute Type *
                </label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {attributeTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_required}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_required: e.target.checked }))}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-900">Required</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_filterable}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_filterable: e.target.checked }))}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-900">Filterable</span>
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
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  {editingAttribute ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>

      {/* Attribute Value Modal */}
      <Modal open={showValueModal} onClose={() => setShowValueModal(false)}>
        <div className="p-5">
          <div className="mt-3">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingValue ? 'Edit Attribute Value' : 'Add New Attribute Value'}
              </h3>
              <button
                onClick={() => setShowValueModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleValueSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Value *
                  </label>
                  <input
                    type="text"
                    required
                    value={valueFormData.value}
                    onChange={(e) => setValueFormData(prev => ({ ...prev, value: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Label
                  </label>
                  <input
                    type="text"
                    value={valueFormData.label}
                    onChange={(e) => setValueFormData(prev => ({ ...prev, label: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color (for color attributes)
                  </label>
                  <input
                    type="color"
                    value={valueFormData.color}
                    onChange={(e) => setValueFormData(prev => ({ ...prev, color: e.target.value }))}
                    className="w-full h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={valueFormData.image_url}
                    onChange={(e) => setValueFormData(prev => ({ ...prev, image_url: e.target.value }))}
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
                    value={valueFormData.sort_order}
                    onChange={(e) => setValueFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={valueFormData.is_active}
                      onChange={(e) => setValueFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-900">Active</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowValueModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  {editingValue ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AttributeManagement;
