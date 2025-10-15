import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { products, searchProducts, brands } from '../data/mockData';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import Breadcrumb from '../components/Breadcrumb';
import { FiGrid, FiList, FiSliders } from 'react-icons/fi';

const Products = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = searchQuery ? searchProducts(searchQuery) : [...products];

    // Apply brand filter
    if (filters.brands?.length > 0) {
      result = result.filter(p => filters.brands.includes(p.brandId));
    }

    // Apply category filter
    if (filters.categories?.length > 0) {
      result = result.filter(p => filters.categories.includes(p.categoryId));
    }

    // Apply price filter
    if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
      result = result.filter(p => {
        const price = p.price;
        const min = filters.priceMin || 0;
        const max = filters.priceMax || Infinity;
        return price >= min && price <= max;
      });
    }

    // Apply rating filter
    if (filters.rating) {
      result = result.filter(p => p.rating >= filters.rating);
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort((a, b) => b.isNew - a.isNew);
        break;
      case 'popular':
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      default:
        break;
    }

    return result;
  }, [products, sortBy, filters, searchQuery]);

  return (
    <div>
      {/* Brand Banner Strip */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 py-4 md:py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-white">
              <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h3 className="font-bold text-lg md:text-xl">Shop Authentic Brands</h3>
                <p className="text-sm text-white/90">100% Original Products from Trusted Brands</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 md:gap-6 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto justify-center">
              {brands.slice(0, 5).map(brand => (
                <Link
                  key={brand.id}
                  to={`/brands/${brand.slug}`}
                  className="flex-shrink-0 bg-white rounded-lg p-2 hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="h-10 md:h-12 w-16 md:w-20 object-contain"
                  />
                </Link>
              ))}
            </div>
            
            <Link 
              to="/brands" 
              className="bg-white text-primary-600 px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-50 transition-colors whitespace-nowrap text-sm md:text-base"
            >
              View All Brands →
            </Link>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={[{ label: 'Products' }]} />

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
          </h1>
          <p className="text-gray-600">
            {filteredProducts.length} products found
          </p>
        </div>

      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <FilterSidebar filters={filters} onFilterChange={setFilters} />
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <FiSliders size={18} />
                  Filters
                </button>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest</option>
                  <option value="popular">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              {/* View Mode */}
              <div className="flex gap-2 border border-gray-300 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${
                    viewMode === 'grid'
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  aria-label="Grid view"
                >
                  <FiGrid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${
                    viewMode === 'list'
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  aria-label="List view"
                >
                  <FiList size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Filter Sidebar */}
          {showFilters && (
            <div className="lg:hidden mb-6">
              <FilterSidebar filters={filters} onFilterChange={setFilters} />
            </div>
          )}

          {/* Products Grid/List */}
          {filteredProducts.length > 0 ? (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'flex flex-col gap-4'
              }
            >
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Products Found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your filters or search terms
              </p>
              <button
                onClick={() => setFilters({})}
                className="btn-primary"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;

