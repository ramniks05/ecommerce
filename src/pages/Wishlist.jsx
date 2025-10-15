import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';
import { FiHeart, FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import Breadcrumb from '../components/Breadcrumb';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showNotification } = useNotification();

  const handleMoveToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product.id);
    showNotification('Product moved to cart!');
  };

  const handleRemove = (productId, productName) => {
    removeFromWishlist(productId);
    showNotification(`${productName} removed from wishlist`, 'info');
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Breadcrumb items={[{ label: 'Wishlist' }]} />
        <div className="text-center py-16">
          <FiHeart className="mx-auto text-gray-300 mb-4" size={80} />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-8">
            Save your favorite items here to easily find them later.
          </p>
          <Link to="/products" className="btn-primary inline-block">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: 'Wishlist' }]} />

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">My Wishlist</h1>
        <p className="text-gray-600">{wishlistItems.length} items</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.map(item => (
          <div key={item.id} className="card group">
            <div className="relative">
              <Link to={`/products/${item.slug}`}>
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="w-full h-64 object-cover"
                />
              </Link>
              <button
                onClick={() => handleRemove(item.id, item.name)}
                className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition-colors"
                aria-label="Remove from wishlist"
              >
                <FiTrash2 className="text-red-500" size={18} />
              </button>
              
              {item.discount > 0 && (
                <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded">
                  -{item.discount}%
                </span>
              )}
            </div>

            <div className="p-4">
              <p className="text-sm text-primary-600 font-medium mb-1">
                {item.brandName}
              </p>
              <Link
                to={`/products/${item.slug}`}
                className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-primary-600 transition-colors block"
              >
                {item.name}
              </Link>
              
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl font-bold text-gray-900">
                  ₹{item.price}
                </span>
                {item.originalPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    ₹{item.originalPrice}
                  </span>
                )}
              </div>

              <button
                onClick={() => handleMoveToCart(item)}
                disabled={!item.inStock}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <FiShoppingCart size={18} />
                {item.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;

