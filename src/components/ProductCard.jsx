import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiDollarSign } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useNotification } from '../context/NotificationContext';
import { fileService } from '../services/supabaseService';
import RequestPriceModal from './RequestPriceModal';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { showNotification } = useNotification();
  const [showRequestPriceModal, setShowRequestPriceModal] = useState(false);
  
  const productType = String(product.product_type || 'b2c').toLowerCase();
  const isB2B = productType === 'b2b';

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isB2B) {
      setShowRequestPriceModal(true);
      return;
    }
    addToCart(product);
    showNotification('Product added to cart!');
  };

  const handleRequestPrice = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowRequestPriceModal(true);
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

  // Derive image URL from various possible shapes
  const rawFirstImage = Array.isArray(product.images) && product.images.length > 0
    ? (typeof product.images[0] === 'string' ? product.images[0] : (product.images[0]?.url || product.images[0]?.path || ''))
    : (product.thumbnail_url || product.main_image_url || product.image_url || '');
  const imageSrc = (() => {
    if (!rawFirstImage) return '';
    const val = String(rawFirstImage);
    if (val.startsWith('http')) return val; // already a full URL
    if (val.includes('/storage/v1/object/public/')) return val; // already public storage URL
    return fileService.getPublicUrl('product-images', val);
  })();

  // Derive stock state from DB fields
  const stockQty =
    product.stock_quantity ??
    product.stock ??
    product.inventory ??
    0;
  const isOutOfStock = Number(stockQty) <= 0;

  const fallbackSlug = (product.slug && String(product.slug).trim()) || String(product.id || '').trim() || '';
  return (
    <>
    <Link to={`/products/${fallbackSlug}`} className="card group hover:shadow-lg transition-shadow duration-300">
      <div className="product-card-container bg-white">
        <img
          src={imageSrc}
          alt={product.name}
          className="product-card-image group-hover:scale-110 transition-transform duration-300"
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
          {isB2B ? (
            <button
              onClick={handleRequestPrice}
              className="bg-white rounded-full p-2 md:p-2.5 shadow-lg hover:bg-primary-50 transition-colors active:scale-95"
              aria-label="Request price"
            >
              <FiDollarSign size={16} />
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              className="bg-white rounded-full p-2 md:p-2.5 shadow-lg hover:bg-primary-50 transition-colors active:scale-95"
              aria-label="Add to cart"
            >
              <FiShoppingCart size={16} />
            </button>
          )}
        </div>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-white text-gray-900 font-bold px-4 py-2 rounded">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-3 md:p-4">
        <p className="text-xs md:text-sm text-primary-600 font-medium mb-1">{product.brand?.name || product.brands?.name || product.brandName || ''}</p>
        <h3 className="font-semibold text-sm md:text-base text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center">
            <span className="text-yellow-400 text-xs md:text-sm">★</span>
            <span className="text-xs md:text-sm text-gray-600 ml-1">{product.rating ?? product.average_rating ?? 0}</span>
          </div>
          <span className="text-xs md:text-sm text-gray-400">({product.review_count ?? product.reviewCount ?? 0})</span>
        </div>

        {isB2B ? (
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowRequestPriceModal(true);
              }}
              className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors text-sm font-medium"
            >
              Request Price
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-lg md:text-xl font-bold text-gray-900">₹{product.price}</span>
            {(product.originalPrice ?? product.mrp) && (
              <span className="text-xs md:text-sm text-gray-400 line-through">
                ₹{product.originalPrice ?? product.mrp}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
    <RequestPriceModal
      product={product}
      isOpen={showRequestPriceModal}
      onClose={() => setShowRequestPriceModal(false)}
    />
    </>
  );
};

export default ProductCard;

