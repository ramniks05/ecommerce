import { Link } from 'react-router-dom';
import { brands } from '../data/mockData';
import BrandSlider from '../components/BrandSlider';

const Landing = () => {
  // Featured 3 brands
  const featuredBrands = brands.slice(0, 3);

  return (
    <div>
      {/* Brand Slider */}
      <section className="bg-gray-900">
        <BrandSlider brands={brands} />
      </section>

      {/* About Us Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Welcome to Catalix
            </h2>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8">
              Your trusted destination for premium branded products in India. At Catalix, we bring together 
              the world's leading brands under one roof, offering you an unparalleled shopping experience 
              with authenticity, quality, and value.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">100% Authentic</h3>
                <p className="text-gray-600">
                  Every product is guaranteed genuine from authorized brand partners.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Quality</h3>
                <p className="text-gray-600">
                  Curated selection of high-quality products from trusted brands.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Fast Delivery</h3>
                <p className="text-gray-600">
                  Quick and reliable shipping across India with tracking.
                </p>
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
                  <img
                    src={brand.heroImage}
                    alt={brand.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  
                  {/* Brand Logo Overlay */}
                  <div className="absolute top-4 left-4">
                    <div className="bg-white rounded-lg p-3 shadow-lg">
                      <img
                        src={brand.logo}
                        alt={`${brand.name} logo`}
                        className="h-12 w-auto object-contain"
                      />
                    </div>
                  </div>

                  {/* Brand Name Overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white text-2xl font-bold mb-1">{brand.name}</h3>
                    <p className="text-white/90 text-sm">{brand.productCount} Products Available</p>
                  </div>
                </div>

                {/* Brand Info */}
                <div className="p-6">
                  <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    {brand.description}
                  </p>
                  
                  {/* Stats */}
                  <div className="flex gap-4 mb-6 pb-6 border-b border-gray-200">
                    <div>
                      <div className="text-2xl font-bold text-primary-600">{brand.founded}</div>
                      <div className="text-xs text-gray-500">Established</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary-600">{brand.categories.length}</div>
                      <div className="text-xs text-gray-500">Categories</div>
                    </div>
                  </div>

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

      {/* Why Choose Catalix */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Why Choose Catalix?
            </h2>
            <p className="text-xl text-white/90 mb-12">
              Experience the difference of shopping with India's most trusted multi-brand platform
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 text-left">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="bg-white/20 p-3 rounded-lg flex-shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Secure Shopping</h3>
                    <p className="text-white/80">
                      Your data is protected with industry-standard encryption and secure payment gateways.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="bg-white/20 p-3 rounded-lg flex-shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Easy Payments</h3>
                    <p className="text-white/80">
                      Multiple payment options including UPI, cards, net banking, and cash on delivery.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="bg-white/20 p-3 rounded-lg flex-shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Free Shipping</h3>
                    <p className="text-white/80">
                      Enjoy free delivery on orders above ₹5,000 across all major cities in India.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="bg-white/20 p-3 rounded-lg flex-shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Easy Returns</h3>
                    <p className="text-white/80">
                      30-day hassle-free returns and exchange policy for your peace of mind.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Brands with Shop Now */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore Premium Brands
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Shop from India's most trusted brands. Quality products, authentic guarantee, and exceptional value.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {featuredBrands.map(brand => (
              <div key={brand.id} className="card group hover:shadow-2xl transition-all duration-300">
                {/* Brand Header Image */}
                <div className="relative h-48 md:h-56 overflow-hidden">
                  <img
                    src={brand.heroImage}
                    alt={brand.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  
                  {/* Brand Logo */}
                  <div className="absolute bottom-4 left-4">
                    <div className="bg-white rounded-lg p-2.5 shadow-lg">
                      <img
                        src={brand.logo}
                        alt={`${brand.name} logo`}
                        className="h-10 md:h-12 w-auto object-contain"
                      />
                    </div>
                  </div>
                </div>

                {/* Brand Content */}
                <div className="p-6 md:p-8">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                    {brand.name}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed min-h-[60px]">
                    {brand.description}
                  </p>

                  {/* Quick Stats */}
                  <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-200">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary-600">{brand.productCount}</div>
                      <div className="text-sm text-gray-500">Products</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary-600">{brand.categories.length}</div>
                      <div className="text-sm text-gray-500">Categories</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary-600">{brand.founded}</div>
                      <div className="text-sm text-gray-500">Est.</div>
                    </div>
                  </div>

                  {/* Shop Now Button */}
                  <Link
                    to={`/brands/${brand.slug}`}
                    className="btn-primary w-full text-center inline-flex items-center justify-center gap-2 group/btn"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Shop {brand.name}
                    <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-24 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Start Shopping?
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
            Discover thousands of authentic products from premium brands. Shop with confidence at Catalix.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/products"
              className="bg-primary-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-primary-700 transition-all duration-300 inline-flex items-center gap-3 shadow-2xl hover:scale-105 w-full sm:w-auto justify-center"
            >
              Browse All Products
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              to="/brands"
              className="border-2 border-white text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-gray-900 transition-all duration-300 inline-flex items-center gap-3 w-full sm:w-auto justify-center"
            >
              Explore Brands
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;

