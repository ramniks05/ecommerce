import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { categoryService, productService, brandService, fileService } from '../services/supabaseService';
import Breadcrumb from '../components/Breadcrumb';
import { FiArrowRight, FiPackage, FiTrendingUp, FiAward } from 'react-icons/fi';

const CategoryDetail = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategoryData = async () => {
      try {
        const [categoriesResult, productsResult, brandsResult] = await Promise.all([
          categoryService.getCategories(),
          productService.getProducts(),
          brandService.getBrands()
        ]);

        let foundCategory = null;
        if (categoriesResult.data) {
          foundCategory = categoriesResult.data.find(c => c.slug === slug) || null;
          setCategory(foundCategory);
        }

        if (productsResult.data) {
          const categoryProducts = productsResult.data.filter(p => {
            const nestedSlug = (p.category?.slug || p.categories?.slug);
            const nestedId = (p.category?.id || p.categories?.id);
            return (
              nestedSlug === slug ||
              (foundCategory?.id && (p.category_id === foundCategory.id || nestedId === foundCategory.id))
            );
          });
          setProducts(categoryProducts);
        }

        if (brandsResult.data) {
          setBrands(brandsResult.data);
        }
      } catch (error) {
        console.error('Error loading category data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategoryData();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Category Not Found</h1>
        <Link to="/" className="text-primary-600 hover:text-primary-700">
          ← Back to Home
        </Link>
      </div>
    );
  }

  const categoryProducts = products.filter(p => (p.category_id === category.id) || (p.categories?.id === category.id));
  const categoryBrands = [...new Set(categoryProducts.map(p => p.brand?.name).filter(Boolean))];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        {category.image_url ? (
          <img
            src={category.image_url.startsWith('http') || category.image_url.includes('/storage/v1/object/public/')
              ? category.image_url
              : fileService.getPublicUrl('category-images', category.image_url)}
            alt={category.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-100" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl text-white">
              <h1 className="text-6xl font-bold mb-4">{category.name}</h1>
              <p className="text-2xl mb-6 text-white/90">{category.tagline}</p>
              <p className="text-lg mb-8 text-white/80">{category.description}</p>
              <Link
                to={`/products?category=${category.slug}`}
                className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 transition-colors duration-200"
              >
                Shop Now
                <FiArrowRight size={24} />
              </Link>
            </div>
          </div>
        </div>
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
                  {brand.logo_url ? (
                    <img
                      src={brand.logo_url.startsWith('http') || brand.logo_url.includes('/storage/v1/object/public/')
                        ? brand.logo_url
                        : fileService.getPublicUrl('brand-logos', brand.logo_url)}
                      alt={brand.name}
                      className="h-12 w-20 object-contain"
                    />
                  ) : (
                    <div className="h-12 w-20 bg-white/30 rounded" />
                  )}
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

      <div className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: 'Home', path: '/' },
            { label: category.name }
          ]}
        />

        {/* Category Stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
          <div className="card p-8 text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiPackage className="text-primary-600" size={32} />
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {categoryProducts.length}
            </div>
            <div className="text-gray-600">Products Available</div>
          </div>

          <div className="card p-8 text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiTrendingUp className="text-primary-600" size={32} />
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {categoryBrands.length}
            </div>
            <div className="text-gray-600">Premium Brands</div>
          </div>

          <div className="card p-8 text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiAward className="text-primary-600" size={32} />
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">
              100%
            </div>
            <div className="text-gray-600">Quality Guaranteed</div>
          </div>
        </section>

        {/* Category Story */}
        <section className="my-16 bg-white rounded-lg shadow-sm border border-gray-200 p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            About {category.name}
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto">
            {category.story}
          </p>
        </section>

        {/* Featured Brands in Category */}
        <section className="my-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Brands in {category.name}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categoryBrands.map((brandName, index) => (
              <div
                key={index}
                className="card p-6 text-center hover:shadow-lg transition-shadow"
              >
                <h3 className="font-semibold text-gray-900">{brandName}</h3>
                <p className="text-sm text-gray-600 mt-2">
                  {categoryProducts.filter(p => p.brandName === brandName).length} Products
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Shop This Category */}
        <section className="my-16 bg-gradient-to-r from-primary-600 to-primary-800 text-white rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Why Shop {category.name}?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Curated Selection</h3>
              <p className="text-white/90">
                Every product is handpicked for quality, style, and value.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Latest Trends</h3>
              <p className="text-white/90">
                Stay ahead with the newest products and innovations.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Best Prices</h3>
              <p className="text-white/90">
                Competitive pricing with regular deals and discounts.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="my-16 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ready to Explore?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Browse {categoryProducts.length} amazing products in {category.name}
          </p>
          <Link
            to={`/products?category=${category.slug}`}
            className="inline-flex items-center gap-2 btn-primary text-lg px-10 py-4"
          >
            Shop {category.name}
            <FiArrowRight size={24} />
          </Link>
        </section>
      </div>
    </div>
  );
};

export default CategoryDetail;

