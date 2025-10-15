import { useState } from 'react';
import { brands, categories } from '../data/mockData';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const FilterSidebar = ({ filters, onFilterChange }) => {
  const [expandedSections, setExpandedSections] = useState({
    brands: true,
    categories: true,
    price: true,
    rating: true,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const priceRanges = [
    { label: 'Under $50', min: 0, max: 50 },
    { label: '$50 - $100', min: 50, max: 100 },
    { label: '$100 - $200', min: 100, max: 200 },
    { label: '$200 - $500', min: 200, max: 500 },
    { label: 'Over $500', min: 500, max: Infinity },
  ];

  const ratings = [5, 4, 3, 2, 1];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
          <div className="space-y-2">
            {brands.map(brand => (
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
            ))}
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
          <div className="space-y-2">
            {categories.map(category => (
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
            ))}
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

