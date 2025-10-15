import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById, getProductsByBrand, reviews } from '../data/mockData';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useNotification } from '../context/NotificationContext';
import ProductCard from '../components/ProductCard';
import Breadcrumb from '../components/Breadcrumb';
import { FiHeart, FiShoppingCart, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';

const ProductDetail = () => {
  const { slug } = useParams();
  const product = getProductById(slug) || Object.values(getProductById).find(p => p.slug === slug);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { showNotification } = useNotification();

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
        <Link to="/products" className="text-primary-600 hover:text-primary-700">
          ← Back to Products
        </Link>
      </div>
    );
  }

  const relatedProducts = getProductsByBrand(product.brandName).filter(p => p.id !== product.id).slice(0, 4);
  const productReviews = reviews.filter(r => r.productId === product.id);
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    showNotification(`Added ${quantity} ${quantity === 1 ? 'item' : 'items'} to cart!`);
  };

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
      showNotification('Removed from wishlist', 'info');
    } else {
      addToWishlist(product);
      showNotification('Added to wishlist!');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: 'Products', path: '/products' },
          { label: product.categoryName, path: `/products?category=${product.categoryId}` },
          { label: product.name }
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8">
        {/* Image Gallery */}
        <div>
          <div className="mb-4 relative overflow-hidden rounded-lg border border-gray-200">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-[500px] object-cover"
            />
            {product.discount > 0 && (
              <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-4 py-2 rounded">
                -{product.discount}% OFF
              </span>
            )}
            {product.isNew && (
              <span className="absolute top-4 right-4 bg-green-500 text-white text-sm font-bold px-4 py-2 rounded">
                NEW
              </span>
            )}
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`border-2 rounded-lg overflow-hidden ${
                  selectedImage === index
                    ? 'border-primary-600'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-24 object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <Link
            to={`/brands/${product.brandName.toLowerCase().replace(/\s+/g, '')}`}
            className="text-primary-600 font-semibold hover:text-primary-700 mb-2 inline-block"
          >
            {product.brandName}
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
          
          {/* Rating */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-2xl ${
                    i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-gray-600">
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-gray-900">
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-2xl text-gray-400 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
            {product.discount > 0 && (
              <p className="text-green-600 font-medium mt-2">
                You save ₹{(product.originalPrice - product.price).toFixed(2)} ({product.discount}% off)
              </p>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-700 mb-6 leading-relaxed">
            {product.description}
          </p>

          {/* Features */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Key Features:</h3>
            <ul className="space-y-2">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-700">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Quantity & Actions */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Quantity
            </label>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-6 py-2 font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
              <span className="text-gray-600">
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <FiShoppingCart size={20} />
              Add to Cart
            </button>
            <button
              onClick={handleWishlistToggle}
              className="btn-outline px-6"
            >
              {inWishlist ? (
                <FaHeart className="text-red-500" size={20} />
              ) : (
                <FiHeart size={20} />
              )}
            </button>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
            <div className="flex items-start gap-3">
              <FiTruck className="text-primary-600 flex-shrink-0 mt-1" size={24} />
              <div>
                <h4 className="font-semibold text-sm text-gray-900">Free Shipping</h4>
                <p className="text-xs text-gray-600">On orders over $100</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FiShield className="text-primary-600 flex-shrink-0 mt-1" size={24} />
              <div>
                <h4 className="font-semibold text-sm text-gray-900">Warranty</h4>
                <p className="text-xs text-gray-600">1 year warranty</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FiRefreshCw className="text-primary-600 flex-shrink-0 mt-1" size={24} />
              <div>
                <h4 className="font-semibold text-sm text-gray-900">Easy Returns</h4>
                <p className="text-xs text-gray-600">30-day return policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-16">
        <div className="border-b border-gray-200">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-4 font-semibold ${
                activeTab === 'description'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 font-semibold ${
                activeTab === 'reviews'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Reviews ({productReviews.length})
            </button>
          </div>
        </div>

        <div className="py-8">
          {activeTab === 'description' && (
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
              <h3 className="text-xl font-bold text-gray-900 mt-6 mb-4">Specifications</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="text-gray-700">{feature}</li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              {productReviews.length > 0 ? (
                <div className="space-y-6">
                  {productReviews.map(review => (
                    <div key={review.id} className="border-b border-gray-200 pb-6">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">{review.userName}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  className={`text-sm ${
                                    i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                  }`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">{review.date}</span>
                          </div>
                        </div>
                      </div>
                      <h5 className="font-semibold text-gray-900 mb-2">{review.title}</h5>
                      <p className="text-gray-700 mb-2">{review.comment}</p>
                      <button className="text-sm text-gray-600 hover:text-gray-900">
                        Helpful ({review.helpful})
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            More from {product.brandName}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(relatedProduct => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;

