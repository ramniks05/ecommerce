import { Link } from 'react-router-dom';
import BrandSlider from '../components/BrandSlider';
import { useEffect, useMemo, useState } from 'react';
import { brandService, categoryService, productService, fileService } from '../services/supabaseService';

const Landing = () => {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [brandsResult, categoriesResult, productsResult] = await Promise.all([
          brandService.getBrands(),
          categoryService.getCategories(),
          productService.getProducts()
        ]);
        if (brandsResult.data) setBrands(brandsResult.data);
        if (categoriesResult.data) setCategories(categoriesResult.data);
        if (productsResult.data) setProducts(productsResult.data);
      } catch (e) {
        console.error('Error loading landing data:', e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const featuredBrands = useMemo(() => brands.slice(0, 3), [brands]);

  const brandIdToProductCount = useMemo(() => {
    const counts = new Map();
    products.forEach(p => {
      const id = p.brand_id || p.brand?.id || p.brands?.id;
      if (id) counts.set(id, (counts.get(id) || 0) + 1);
    });
    return counts;
  }, [products]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Brand Slider */}
      <section className="bg-gray-900">
        <BrandSlider brands={brands} products={products} />
      </section>

      {/* About Us Section */}
      <section className="py-8 md:py-12 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 md:mb-6">
              About Us
            </h2>
            <div className="text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed space-y-4 mb-6 md:mb-8 text-left md:text-center">
              <p>
                Catalixo Global Pvt. Ltd. is a consumer-first FMCG company delivering national-brand-equivalent products at accessible price points for Indian households.
              </p>
              <p>
                The company plans to offer a growing portfolio of essentials under trusted brands like KlenShine, Japotup, LaRejouis, and Bonheur catering to diverse consumer needs across home care, personal care, pooja needs, and lifestyle accessories.
              </p>
              <p>
                The company is driven by deep consumer insights, strong execution, and a commitment to sustainable growth.
              </p>
              <p>
                With plans of nationwide distribution, a sharp focus on BTL initiatives and social media-driven brand activation, CGPL is building strong visibility and consumer trust across markets.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-8 md:mt-12">
              <div className="text-center">
                <div className="bg-primary-100 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <svg className="w-7 h-7 md:w-8 md:h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Consumer-First Approach</h3>
                <p className="text-sm md:text-base text-gray-600">We prioritize customer needs and insights to craft impactful, daily-use products.</p>
              </div>
              <div className="text-center">
                <div className="bg-primary-100 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <svg className="w-7 h-7 md:w-8 md:h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Trusted Brands</h3>
                <p className="text-sm md:text-base text-gray-600">We offer products under recognizable and reliable brands like KlenShine and Bonheur.</p>
              </div>
              <div className="text-center">
                <div className="bg-primary-100 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <svg className="w-7 h-7 md:w-8 md:h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Pan-India Presence</h3>
                <p className="text-sm md:text-base text-gray-600">With a growing network and marketing efforts, we're building trust across the country.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Brands with Shop Now */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Shop by Brand
            </h2>
            <p className="text-lg text-gray-600">
              Explore our premium brand partners and discover quality products
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredBrands.map(brand => (
              <div key={brand.id} className="card overflow-hidden group hover:shadow-xl transition-all duration-300">
                {/* Brand Image */}
                <div className="relative h-64 overflow-hidden">
                  {brand.hero_image_url ? (
                    <img
                      src={brand.hero_image_url.startsWith('http') || brand.hero_image_url.includes('/storage/v1/object/public/')
                        ? brand.hero_image_url
                        : fileService.getPublicUrl('brand-heroes', brand.hero_image_url)}
                      alt={brand.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  
                  {/* Brand Logo Overlay */}
                  <div className="absolute top-4 left-4">
                    <div className="bg-white rounded-lg p-3 shadow-lg">
                      {brand.logo_url ? (
                        <img
                          src={brand.logo_url.startsWith('http') || brand.logo_url.includes('/storage/v1/object/public/')
                            ? brand.logo_url
                            : fileService.getPublicUrl('brand-logos', brand.logo_url)}
                          alt={`${brand.name} logo`}
                          className="h-12 w-auto object-contain"
                        />
                      ) : (
                        <div className="h-12 w-28 bg-gray-100 rounded" />
                      )}
                    </div>
                  </div>

                  {/* Brand Name Overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white text-2xl font-bold mb-1">{brand.name}</h3>
                    <p className="text-white/90 text-sm">
                      {(brandIdToProductCount.get(brand.id) || 0)} Products Available
                    </p>
                  </div>
                </div>

                {/* Brand Info */}
                <div className="p-6">
                  <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                    {brand.description || 'Explore premium products from this brand.'}
                  </p>
                  
                  {/* Shop Now Button */}
                  <Link
                    to={`/brands/${brand.slug}`}
                    className="btn-primary w-full text-center inline-flex items-center justify-center gap-2 group/btn"
                  >
                    Shop {brand.name}
                    <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* View All Brands Button */}
          <div className="text-center mt-12">
            <Link
              to="/brands"
              className="btn-outline inline-flex items-center gap-2 text-lg"
            >
              View All Brands
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-8 md:py-12 lg:py-20 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-6">Why Choose Us</h2>
            <p className="text-base md:text-lg lg:text-xl text-white/90 mb-8 md:mb-12">India's consumer-first multi-brand platform</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 text-left">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 lg:p-8">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="bg-white/20 p-2 md:p-3 rounded-lg flex-shrink-0">
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg lg:text-xl font-bold mb-1 md:mb-2">Consumer-First Approach</h3>
                    <p className="text-sm md:text-base text-white/80">We prioritize customer needs and insights to craft impactful, daily-use products.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 lg:p-8">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="bg-white/20 p-2 md:p-3 rounded-lg flex-shrink-0">
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg lg:text-xl font-bold mb-1 md:mb-2">Trusted Brands</h3>
                    <p className="text-sm md:text-base text-white/80">Recognizable and reliable brands like KlenShine and Bonheur.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 lg:p-8">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="bg-white/20 p-2 md:p-3 rounded-lg flex-shrink-0">
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg lg:text-xl font-bold mb-1 md:mb-2">Pan-India Presence</h3>
                    <p className="text-sm md:text-base text-white/80">Growing network and marketing efforts building trust across the country.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action - Improved Design */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-primary-50"></div>
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%230284c7" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}}></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Main Heading */}
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Ready to Start Shopping?
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Discover thousands of authentic products from premium brands. Experience quality, trust, and value with every purchase at Catalix.
              </p>
            </div>

            {/* CTA Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <Link
                to="/products"
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-primary-600"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary-100 p-4 rounded-xl group-hover:bg-primary-600 transition-colors">
                    <svg className="w-8 h-8 text-primary-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                      Browse Products
                    </h3>
                    <p className="text-gray-600">Explore our full catalog</p>
                  </div>
                  <svg className="w-6 h-6 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>

              <Link
                to="/brands"
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-primary-600"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary-100 p-4 rounded-xl group-hover:bg-primary-600 transition-colors">
                    <svg className="w-8 h-8 text-primary-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                      Explore Brands
                    </h3>
                    <p className="text-gray-600">Discover premium partners</p>
                  </div>
                  <svg className="w-6 h-6 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">5+</div>
                  <div className="text-sm md:text-base text-gray-600">Premium Brands</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">19+</div>
                  <div className="text-sm md:text-base text-gray-600">Products</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">100%</div>
                  <div className="text-sm md:text-base text-gray-600">Authentic</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">24/7</div>
                  <div className="text-sm md:text-base text-gray-600">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;

