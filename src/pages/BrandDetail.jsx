import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBrandBySlug, getProductsByBrand } from '../data/mockData';
import ProductCard from '../components/ProductCard';
import Breadcrumb from '../components/Breadcrumb';
import { FiGrid, FiList } from 'react-icons/fi';

const BrandDetail = () => {
  const { slug } = useParams();
  const brand = getBrandBySlug(slug);
  const products = getProductsByBrand(slug);
  
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedCategory, setSelectedCategory] = useState('all');

  if (!brand) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Brand Not Found</h1>
        <Link to="/brands" className="text-primary-600 hover:text-primary-700">
          ← Back to Brands
        </Link>
      </div>
    );
  }

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.categoryName === selectedCategory);
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => b.isNew - a.isNew);
        break;
      default:
        break;
    }

    return filtered;
  }, [products, sortBy, selectedCategory]);

  const brandCategories = ['all', ...new Set(products.map(p => p.categoryName))];

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: 'Brands', path: '/brands' },
            { label: brand.name }
          ]}
        />

        {/* Brand Banner - Above Products */}
        <section className="my-8 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 md:p-8 text-white shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="bg-white rounded-xl p-3 shadow-lg flex-shrink-0">
                <img
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  className="h-16 md:h-20 w-auto object-contain"
                />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">{brand.name}</h2>
                <p className="text-white/90 text-sm md:text-base">{brand.description}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-white/20 backdrop-blur-sm px-4 md:px-6 py-3 rounded-xl text-center">
                <div className="text-2xl md:text-3xl font-bold">{brand.productCount}</div>
                <div className="text-xs md:text-sm text-white/80">Products</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 md:px-6 py-3 rounded-xl text-center">
                <div className="text-2xl md:text-3xl font-bold">{brand.founded}</div>
                <div className="text-xs md:text-sm text-white/80">Est.</div>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section id="products">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                {brand.name} Products
              </h2>
              <p className="text-gray-600 mt-1">
                {filteredProducts.length} products available
              </p>
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {brandCategories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>

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

          {/* Products Grid/List */}
          {filteredProducts.length > 0 ? (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                  : 'flex flex-col gap-4'
              }
            >
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No products found in this category.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default BrandDetail;

