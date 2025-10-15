import { Link } from 'react-router-dom';

const BrandCard = ({ brand }) => {
  return (
    <Link
      to={`/brands/${brand.slug}`}
      className="card group hover:shadow-lg transition-all duration-300"
    >
      <div className="p-8 flex flex-col items-center text-center">
        <div className="w-32 h-32 mb-4 overflow-hidden rounded-full">
          <img
            src={brand.logo}
            alt={brand.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
          {brand.name}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {brand.description}
        </p>
        <div className="text-sm text-gray-500">
          {brand.productCount} Products
        </div>
      </div>
    </Link>
  );
};

export default BrandCard;

