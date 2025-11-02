import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link, useLocation } from 'react-router-dom';
import { productService, brandService, categoryService, fileService } from '../services/supabaseService';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import Breadcrumb from '../components/Breadcrumb';
import { FiGrid, FiList, FiSliders, FiRefreshCw } from 'react-icons/fi';
import { clearAppCache } from '../utils/clearCache';

const Products = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let timeoutId = null;

    const loadData = async () => {
      setLoading(true);
      
      // Add cache-busting timestamp to prevent stale cached responses
      const cacheBuster = Date.now();
      console.log(`🔄 [Products] Starting load (timestamp: ${cacheBuster})`);
      console.log(`🔄 [Products] isSupabaseConfigured: ${import.meta.env.VITE_SUPABASE_URL ? 'YES' : 'NO'}`);
      
      try {
        // Fetch only active products with better error handling
        console.log(`🔄 [Products] Calling getActiveProducts...`);
        const [productsResult, brandsResult, categoriesResult] = await Promise.all([
          productService.getActiveProducts().catch(err => {
            console.error('❌ [Products] Error fetching active products:', err);
            console.error('❌ [Products] Error details:', {
              message: err?.message,
              code: err?.code,
              stack: err?.stack
            });
            // Fallback: try fetching all products if active filter fails
            console.log('🔄 [Products] Trying fallback: getProducts()...');
            return productService.getProducts().catch(fallbackErr => {
              console.error('❌ [Products] Fallback fetch also failed:', fallbackErr);
              return { data: null, error: fallbackErr };
            });
          }),
          brandService.getBrands().catch(err => {
            console.error('Error fetching brands:', err);
            return { data: null, error: err };
          }),
          categoryService.getCategories().catch(err => {
            console.error('Error fetching categories:', err);
            return { data: null, error: err };
          })
        ]);

        // Only update state if component is still mounted
        if (!isMounted) return;

        // Validate and set data - only set if we have valid array data
        console.log(`📊 [Products] Results:`, {
          productsHasError: !!productsResult?.error,
          productsHasData: !!productsResult?.data,
          productsDataLength: Array.isArray(productsResult?.data) ? productsResult.data.length : 'not array',
          brandsHasError: !!brandsResult?.error,
          categoriesHasError: !!categoriesResult?.error
        });

        if (productsResult?.error) {
          console.error('❌ [Products] Products fetch error:', productsResult.error);
          console.error('❌ [Products] Error details:', {
            message: productsResult.error?.message,
            code: productsResult.error?.code,
            status: productsResult.error?.status,
            details: productsResult.error?.details,
            hint: productsResult.error?.hint
          });
          setProducts([]);
        } else {
          const productData = Array.isArray(productsResult?.data) ? productsResult.data : [];
          console.log(`✅ [Products] Loaded ${productData.length} products from API`);
          
          if (productData.length > 0) {
            console.log(`📦 [Products] First product sample:`, {
              id: productData[0]?.id,
              name: productData[0]?.name,
              is_active: productData[0]?.is_active
            });
          }
          
          // Filter out inactive products client-side as additional safety
          const activeProducts = productData.filter(p => p.is_active !== false);
          console.log(`✅ [Products] ${activeProducts.length} active products after client-side filter`);
          setProducts(activeProducts);
          
          if (activeProducts.length === 0 && productData.length > 0) {
            console.warn('⚠️ [Products] All products are inactive!');
          }
        }

        if (brandsResult?.error) {
          console.error('Brands fetch error:', brandsResult.error);
          setBrands([]);
        } else {
          setBrands(Array.isArray(brandsResult?.data) ? brandsResult.data : []);
        }

        if (categoriesResult?.error) {
          console.error('Categories fetch error:', categoriesResult.error);
          setCategories([]);
        } else {
          setCategories(Array.isArray(categoriesResult?.data) ? categoriesResult.data : []);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        // Only update state if component is still mounted
        if (isMounted) {
          setProducts([]);
          setBrands([]);
          setCategories([]);
        }
      } finally {
        // Only update loading state if component is still mounted
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Add timeout as safety net (only if data hasn't loaded)
    timeoutId = setTimeout(() => {
      if (isMounted) {
        setLoading(false);
      }
    }, 10000); // Increased to 10 seconds

    // Scroll to top on route navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Load data
    loadData().finally(() => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    });
    
    // Cleanup function
    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [location.key]);

  const filteredProducts = useMemo(() => {
    let result = searchQuery 
      ? products.filter(p => 
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.brand?.name || p.brands?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
        )
      : [...products];

    // Apply brand filter
    if (filters.brands?.length > 0) {
      result = result.filter(p => filters.brands.includes(p.brand_id) || filters.brands.includes(p.brands?.id));
    }

    // Apply category filter
    if (filters.categories?.length > 0) {
      result = result.filter(p => filters.categories.includes(p.category_id) || filters.categories.includes(p.categories?.id));
    }

    // Apply price filter
    if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
      result = result.filter(p => {
        const price = parseFloat(p.price) || 0;
        const min = filters.priceMin || 0;
        const max = filters.priceMax || Infinity;
        return price >= min && price <= max;
      });
    }

    // Apply rating filter
    if (filters.rating) {
      result = result.filter(p => (p.rating || 0) >= filters.rating);
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0));
        break;
      case 'price-high':
        result.sort((a, b) => (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0));
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'popular':
        result.sort((a, b) => (b.review_count || 0) - (a.review_count || 0));
        break;
      default:
        break;
    }

    return result;
  }, [products, sortBy, filters, searchQuery]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

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
                    src={(() => {
                      const raw = brand.logo_url || brand.logo || '';
                      if (!raw) return '';
                      return (String(raw).startsWith('http') || String(raw).includes('/storage/v1/object/public/'))
                        ? raw
                        : fileService.getPublicUrl('brand-logos', raw);
                    })()}
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
              <p className="text-gray-600 mb-4">
                {products.length === 0 && !loading 
                  ? 'No products available. Please check the console for errors or ensure products exist in the database.'
                  : 'Try adjusting your filters or search terms'}
              </p>
              {products.length === 0 && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-left max-w-md mx-auto">
                  <p className="text-sm text-yellow-800 mb-2">
                    <strong>Debugging info:</strong>
                  </p>
                  <ul className="text-xs text-yellow-700 list-disc list-inside space-y-1 mb-3">
                    <li>Total products loaded: {products.length}</li>
                    <li>Check browser console for error messages</li>
                    <li>Verify products exist in Supabase database</li>
                    <li>Check if products have is_active = true</li>
                  </ul>
                  <p className="text-xs text-yellow-800 mb-2">
                    <strong>⚠️ Cache Issue?</strong> If this works in private window but not regular window, try:
                  </p>
                  <button
                    onClick={() => {
                      console.log('🧹 Clearing cache and reloading...');
                      clearAppCache();
                    }}
                    className="w-full mt-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 flex items-center justify-center gap-2 text-sm"
                  >
                    <FiRefreshCw size={16} />
                    Clear Cache & Reload
                  </button>
                </div>
              )}
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
    </div>
  );
};

export default Products;

