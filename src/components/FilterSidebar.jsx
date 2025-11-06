import { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const FilterSidebar = ({ filters, onFilterChange, brands = [], categories = [] }) => {
  const [expandedSections, setExpandedSections] = useState({
    brands: true,
    categories: true,
    productType: true,
    price: true,
    rating: true,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Calculate price ranges based on actual product prices
  const getPriceRanges = () => {
    // Default ranges in Indian Rupees
    return [
      { label: 'Under ₹500', min: 0, max: 500 },
      { label: '₹500 - ₹1,000', min: 500, max: 1000 },
      { label: '₹1,000 - ₹2,500', min: 1000, max: 2500 },
      { label: '₹2,500 - ₹5,000', min: 2500, max: 5000 },
      { label: '₹5,000 - ₹10,000', min: 5000, max: 10000 },
      { label: 'Over ₹10,000', min: 10000, max: Infinity },
    ];
  };

  const priceRanges = getPriceRanges();

  const ratings = [5, 4, 3, 2, 1];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Product Type */}
      <div className="mb-6 border-b border-gray-200 pb-4">
        <button
          onClick={() => toggleSection('productType')}
          className="flex justify-between items-center w-full mb-3"
        >
          <h4 className="font-semibold text-gray-900">Product Type</h4>
          {expandedSections.productType ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        {expandedSections.productType && (
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="productType"
                checked={!filters.productType}
                onChange={() => {
                  const { productType, ...rest } = filters;
                  onFilterChange(rest);
                }}
                className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">All</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="productType"
                checked={filters.productType === 'b2c'}
                onChange={() => onFilterChange({ ...filters, productType: 'b2c' })}
                className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">B2C (Retail)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="productType"
                checked={filters.productType === 'b2b'}
                onChange={() => onFilterChange({ ...filters, productType: 'b2b' })}
                className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">B2B (Wholesale)</span>
            </label>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900">Filters</h3>
        <button
          onClick={() => onFilterChange({})}
          className="text-sm text-primary-600 hover:text-primary-700"
        >
          Clear All
        </button>
      </div>

      {/* Brands */}
      <div className="mb-6 border-b border-gray-200 pb-4">
        <button
          onClick={() => toggleSection('brands')}
          className="flex justify-between items-center w-full mb-3"
        >
          <h4 className="font-semibold text-gray-900">Brands</h4>
          {expandedSections.brands ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        {expandedSections.brands && (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {brands.length > 0 ? (
              brands.map(brand => (
                <label key={brand.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.brands?.includes(brand.id) || false}
                    onChange={(e) => {
                      const newBrands = e.target.checked
                        ? [...(filters.brands || []), brand.id]
                        : (filters.brands || []).filter(id => id !== brand.id);
                      onFilterChange({ ...filters, brands: newBrands });
                    }}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">{brand.name}</span>
                </label>
              ))
            ) : (
              <p className="text-sm text-gray-500">No brands available</p>
            )}
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="mb-6 border-b border-gray-200 pb-4">
        <button
          onClick={() => toggleSection('categories')}
          className="flex justify-between items-center w-full mb-3"
        >
          <h4 className="font-semibold text-gray-900">Categories</h4>
          {expandedSections.categories ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        {expandedSections.categories && (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {categories.length > 0 ? (
              categories.map(category => (
                <label key={category.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.categories?.includes(category.id) || false}
                    onChange={(e) => {
                      const newCategories = e.target.checked
                        ? [...(filters.categories || []), category.id]
                        : (filters.categories || []).filter(id => id !== category.id);
                      onFilterChange({ ...filters, categories: newCategories });
                    }}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">{category.name}</span>
                </label>
              ))
            ) : (
              <p className="text-sm text-gray-500">No categories available</p>
            )}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="mb-6 border-b border-gray-200 pb-4">
        <button
          onClick={() => toggleSection('price')}
          className="flex justify-between items-center w-full mb-3"
        >
          <h4 className="font-semibold text-gray-900">Price</h4>
          {expandedSections.price ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        {expandedSections.price && (
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="priceRange"
                checked={filters.priceMin === undefined && filters.priceMax === undefined}
                onChange={() => {
                  const { priceMin, priceMax, ...rest } = filters;
                  onFilterChange(rest);
                }}
                className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">All Prices</span>
            </label>
            {priceRanges.map((range, index) => (
              <label key={index} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="priceRange"
                  checked={filters.priceMin === range.min && filters.priceMax === range.max}
                  onChange={() => {
                    onFilterChange({
                      ...filters,
                      priceMin: range.min,
                      priceMax: range.max
                    });
                  }}
                  className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{range.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Rating */}
      <div>
        <button
          onClick={() => toggleSection('rating')}
          className="flex justify-between items-center w-full mb-3"
        >
          <h4 className="font-semibold text-gray-900">Rating</h4>
          {expandedSections.rating ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        {expandedSections.rating && (
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="rating"
                checked={filters.rating === undefined}
                onChange={() => {
                  const { rating, ...rest } = filters;
                  onFilterChange(rest);
                }}
                className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">All Ratings</span>
            </label>
            {ratings.map(rating => (
              <label key={rating} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  checked={filters.rating === rating}
                  onChange={() => {
                    onFilterChange({ ...filters, rating });
                  }}
                  className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400">★</span>
                  <span className="text-sm text-gray-700">{rating} & up</span>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterSidebar;

