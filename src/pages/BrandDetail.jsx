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
      {/* Brand Hero */}
      <section className="relative h-96 overflow-hidden">
        <img
          src={brand.heroImage}
          alt={brand.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl text-white">
              <h1 className="text-5xl font-bold mb-4">{brand.name}</h1>
              <p className="text-xl mb-6 text-white/90">{brand.description}</p>
              <div className="flex gap-6 text-sm">
                <div>
                  <span className="text-white/70">Founded</span>
                  <div className="font-bold text-lg">{brand.founded}</div>
                </div>
                <div>
                  <span className="text-white/70">Products</span>
                  <div className="font-bold text-lg">{brand.productCount}</div>
                </div>
                <div>
                  <span className="text-white/70">Categories</span>
                  <div className="font-bold text-lg">{brand.categories.length}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: 'Brands', path: '/brands' },
            { label: brand.name }
          ]}
        />

        {/* Brand Story */}
        <section className="my-12 bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
          <p className="text-gray-700 leading-relaxed text-lg">{brand.story}</p>
        </section>

        {/* Products Section */}
        <section>
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

        {/* Brand Categories */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {brand.name} Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {brand.categories.map((category, index) => (
              <div
                key={index}
                className="card p-6 text-center hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedCategory(category)}
              >
                <h3 className="font-semibold text-gray-900">{category}</h3>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default BrandDetail;

