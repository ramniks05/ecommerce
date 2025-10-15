import { Link } from 'react-router-dom';
import { categories, products } from '../data/mockData';
import Breadcrumb from '../components/Breadcrumb';

const Categories = () => {
  const getCategoryProductCount = (categoryId) => {
    return products.filter(p => p.categoryId === categoryId).length;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: 'Categories' }]} />

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Shop by Category</h1>
        <p className="text-lg text-gray-600">
          Browse products by category and find exactly what you're looking for.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(category => {
          const productCount = getCategoryProductCount(category.id);
          return (
            <Link
              key={category.id}
              to={`/category/${category.slug}`}
              className="card group hover:shadow-lg transition-all duration-300"
            >
              <div className="relative overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-6 w-full">
                    <h3 className="text-white font-bold text-2xl mb-2">
                      {category.name}
                    </h3>
                    <p className="text-white/90 mb-3">
                      {productCount} Products
                    </p>
                    <span className="text-primary-300 font-semibold group-hover:underline">
                      Explore Category →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Category Benefits */}
      <section className="mt-16 bg-gray-50 rounded-2xl p-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Why Shop by Category?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Easy Navigation</h3>
            <p className="text-gray-600">
              Find products faster by browsing specific categories that match your needs.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Curated Selection</h3>
            <p className="text-gray-600">
              Discover handpicked products within each category, ensuring quality choices.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Best Deals</h3>
            <p className="text-gray-600">
              Exclusive category deals and offers on premium products across all ranges.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Categories;

