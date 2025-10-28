import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useNotification } from '../context/NotificationContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { showNotification } = useNotification();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    showNotification('Product added to cart!');
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      showNotification('Removed from wishlist', 'info');
    } else {
      addToWishlist(product);
      showNotification('Added to wishlist!');
    }
  };

  const inWishlist = isInWishlist(product.id);

  return (
    <Link to={`/products/${product.slug}`} className="card group hover:shadow-lg transition-shadow duration-300">
      <div className="relative overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-48 sm:h-56 md:h-64 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded shadow-md">
              NEW
            </span>
          )}
          {product.discount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded shadow-md">
              -{product.discount}%
            </span>
          )}
        </div>

        {/* Quick Actions - Always visible on mobile, hover on desktop */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleWishlistToggle}
            className="bg-white rounded-full p-2 md:p-2.5 shadow-lg hover:bg-primary-50 transition-colors active:scale-95"
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {inWishlist ? (
              <FaHeart className="text-red-500" size={16} />
            ) : (
              <FiHeart size={16} />
            )}
          </button>
          <button
            onClick={handleAddToCart}
            className="bg-white rounded-full p-2 md:p-2.5 shadow-lg hover:bg-primary-50 transition-colors active:scale-95"
            aria-label="Add to cart"
          >
            <FiShoppingCart size={16} />
          </button>
        </div>

        {/* Out of Stock Overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-white text-gray-900 font-bold px-4 py-2 rounded">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-3 md:p-4">
        <p className="text-xs md:text-sm text-primary-600 font-medium mb-1">{product.brandName}</p>
        <h3 className="font-semibold text-sm md:text-base text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center">
            <span className="text-yellow-400 text-xs md:text-sm">★</span>
            <span className="text-xs md:text-sm text-gray-600 ml-1">{product.rating}</span>
          </div>
          <span className="text-xs md:text-sm text-gray-400">({product.reviewCount})</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-lg md:text-xl font-bold text-gray-900">₹{product.price}</span>
          {product.originalPrice && (
            <span className="text-xs md:text-sm text-gray-400 line-through">
              ₹{product.originalPrice}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

