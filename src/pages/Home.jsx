import { Link } from 'react-router-dom';
import { brands, categories, getFeaturedProducts, getNewProducts } from '../data/mockData';
import ProductCard from '../components/ProductCard';
import BrandCard from '../components/BrandCard';
import BrandSlider from '../components/BrandSlider';

const Home = () => {
  const featuredProducts = getFeaturedProducts();
  const newProducts = getNewProducts();

  return (
    <div>
      {/* Brand Slider Section */}
      <section className="bg-gray-900">
        <BrandSlider brands={brands} />
      </section>

      {/* Brand Banner Strip */}
      <section className="bg-gray-100 py-8 border-y border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary-600 p-2 rounded">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Trusted Brands</h3>
                <p className="text-sm text-gray-600">100% Authentic Products</p>
              </div>
            </div>
            
            <div className="flex items-center gap-8 overflow-x-auto py-2">
              {brands.map(brand => (
                <Link
                  key={brand.id}
                  to={`/brands/${brand.slug}`}
                  className="flex-shrink-0 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
                >
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="h-12 w-20 object-contain"
                  />
                </Link>
              ))}
            </div>
            
            <Link 
              to="/brands" 
              className="text-primary-600 font-semibold hover:text-primary-700 whitespace-nowrap"
            >
              View All Brands →
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Brands */}
      <section className="py-8 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">Featured Brands</h2>
              <p className="text-sm md:text-base text-gray-600">Discover our premium brand partners</p>
            </div>
            <Link to="/brands" className="text-sm md:text-base text-primary-600 font-semibold hover:text-primary-700 whitespace-nowrap">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {brands.map(brand => (
              <BrandCard key={brand.id} brand={brand} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">Shop by Category</h2>
            <p className="text-sm md:text-base text-gray-600">Find what you're looking for</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
            {categories.map(category => (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="card group hover:shadow-lg transition-all duration-300"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                    <h3 className="text-white font-bold text-lg p-4">{category.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-8 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">Featured Products</h2>
              <p className="text-sm md:text-base text-gray-600">Hand-picked products just for you</p>
            </div>
            <Link to="/products" className="text-sm md:text-base text-primary-600 font-semibold hover:text-primary-700 whitespace-nowrap">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.slice(0, 8).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-8 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">New Arrivals</h2>
              <p className="text-sm md:text-base text-gray-600">Check out our latest products</p>
            </div>
            <Link to="/products?filter=new" className="text-sm md:text-base text-primary-600 font-semibold hover:text-primary-700 whitespace-nowrap">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {newProducts.slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Brand Stories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Brand Stories</h2>
            <p className="text-gray-600">Discover the brands behind the products</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {brands.slice(0, 2).map(brand => (
              <Link
                key={brand.id}
                to={`/brands/${brand.slug}`}
                className="card group hover:shadow-lg transition-all duration-300"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={brand.heroImage}
                    alt={brand.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <div className="p-6">
                      <h3 className="text-white font-bold text-2xl mb-2">{brand.name}</h3>
                      <p className="text-white/90">{brand.description}</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4 line-clamp-3">{brand.story}</p>
                  <span className="text-primary-600 font-semibold group-hover:underline">
                    Explore {brand.name} →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and get exclusive deals, new arrivals, and brand stories delivered to your inbox.
          </p>
          <form className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;

