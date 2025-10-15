import { Link } from 'react-router-dom';

const BrandCard = ({ brand }) => {
  return (
    <Link
      to={`/brands/${brand.slug}`}
      className="card group hover:shadow-lg transition-all duration-300 active:scale-95"
    >
      <div className="p-4 md:p-6 lg:p-8 flex flex-col items-center text-center">
        <div className="w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 mb-3 md:mb-4 overflow-hidden rounded-full">
          <img
            src={brand.logo}
            alt={brand.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
        <h3 className="text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-1 md:mb-2 group-hover:text-primary-600 transition-colors">
          {brand.name}
        </h3>
        <p className="text-xs md:text-sm text-gray-600 mb-2 md:mb-4 line-clamp-2 hidden sm:block">
          {brand.description}
        </p>
        <div className="text-xs md:text-sm text-gray-500 font-medium">
          {brand.productCount} Products
        </div>
      </div>
    </Link>
  );
};

export default BrandCard;

