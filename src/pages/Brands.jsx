import { brands } from '../data/mockData';
import BrandCard from '../components/BrandCard';
import Breadcrumb from '../components/Breadcrumb';

const Brands = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: 'Brands' }]} />

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Brands</h1>
        <p className="text-lg text-gray-600">
          Explore our carefully curated collection of premium brands. Each brand represents quality, innovation, and style.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {brands.map(brand => (
          <BrandCard key={brand.id} brand={brand} />
        ))}
      </div>

      {/* Brand Stats */}
      <section className="mt-16 bg-gradient-to-r from-primary-600 to-primary-800 text-white rounded-2xl p-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-5xl font-bold mb-2">{brands.length}+</div>
            <div className="text-primary-100">Premium Brands</div>
          </div>
          <div>
            <div className="text-5xl font-bold mb-2">
              {brands.reduce((sum, b) => sum + b.productCount, 0)}+
            </div>
            <div className="text-primary-100">Products Available</div>
          </div>
          <div>
            <div className="text-5xl font-bold mb-2">100%</div>
            <div className="text-primary-100">Authentic Guarantee</div>
          </div>
        </div>
      </section>

      {/* Why Shop Brands */}
      <section className="mt-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Why Shop By Brand?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Quality Assurance</h3>
            <p className="text-gray-600">
              Every product is guaranteed authentic and meets the highest quality standards.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Brand Innovation</h3>
            <p className="text-gray-600">
              Access the latest innovations and exclusive collections from leading brands.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Trust & Heritage</h3>
            <p className="text-gray-600">
              Shop with confidence from brands with proven track records and loyal followings.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Brands;

