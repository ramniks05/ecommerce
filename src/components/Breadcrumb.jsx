import { Link } from 'react-router-dom';
import { FiChevronRight, FiHome } from 'react-icons/fi';

const Breadcrumb = ({ items }) => {
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-600 py-4">
      <Link to="/" className="hover:text-primary-600 transition-colors flex items-center gap-1">
        <FiHome size={16} />
        Home
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <FiChevronRight size={16} className="text-gray-400" />
          {index === items.length - 1 ? (
            <span className="text-gray-900 font-medium">{item.label}</span>
          ) : (
            <Link to={item.path} className="hover:text-primary-600 transition-colors">
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb;

