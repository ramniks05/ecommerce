import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productService, attributeService, fileService } from '../services/supabaseService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useNotification } from '../context/NotificationContext';
import ProductCard from '../components/ProductCard';
import Breadcrumb from '../components/Breadcrumb';
import RequestPriceModal from '../components/RequestPriceModal';
import { FiHeart, FiShoppingCart, FiTruck, FiShield, FiRefreshCw, FiImage, FiDollarSign } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [attributes, setAttributes] = useState([]);
  const [attributeValues, setAttributeValues] = useState({});
  const [loading, setLoading] = useState(true);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [showRequestPriceModal, setShowRequestPriceModal] = useState(false);
  
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { showNotification } = useNotification();
  
  const isB2B = String(product?.product_type || 'b2c').toLowerCase() === 'b2b';

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const { data: products, error } = await productService.getProducts();
        if (error) throw error;
        
        const foundProduct = products.find(p => p.slug === slug || String(p.id) === String(slug));
        if (foundProduct) {
          setProduct(foundProduct);
          
          // Load attributes and their values
          const { data: attrs } = await attributeService.getAttributes();
          setAttributes(attrs || []);
          
          // Load attribute values for each attribute
          const valuesPromises = (attrs || []).map(async (attr) => {
            const { data: values } = await attributeService.getAttributeValues(attr.id);
            return { attributeId: attr.id, values: values || [] };
          });
          
          const valuesResults = await Promise.all(valuesPromises);
          const valuesMap = {};
          valuesResults.forEach(({ attributeId, values }) => {
            valuesMap[attributeId] = values;
          });
          setAttributeValues(valuesMap);
        }
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading product...</p>
      </div>
    );
  }

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

  // Normalize image URL to public URL if needed
  const toPublicImageUrl = (val) => {
    if (!val) return '';
    const s = String(val);
    if (s.startsWith('http') || s.includes('/storage/v1/object/public/')) return s;
    return fileService.getPublicUrl('product-images', s);
  };

  // Get all images from grouped images
  const getAllImages = () => {
    const images = [];
    if (product.image_groups) {
      Object.values(product.image_groups).forEach(group => {
        images.push(...group.map(g => toPublicImageUrl(g)));
      });
    }
    // Fallback to regular images if no grouped images
    if (images.length === 0 && product.images) {
      images.push(...product.images.map(img => {
        if (typeof img === 'string') return toPublicImageUrl(img);
        return toPublicImageUrl(img?.url || img?.path || '');
      }));
    }
    return images;
  };

  const allImages = getAllImages();
  const inWishlist = isInWishlist(product.id);
  const stockQty = product.stock_quantity ?? product.stock ?? product.inventory ?? 0;
  const inStock = Number(stockQty) > 0;
  const productReviews = [];
  const relatedProducts = [];

  const handleAddToCart = () => {
    if (isB2B) {
      setShowRequestPriceModal(true);
      return;
    }
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
          { label: product.category?.name || product.categoryName || 'Category', path: `/products?category=${product.category_id || product.categoryId || ''}` },
          { label: product.name }
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8">
        {/* Image Gallery */}
        <div>
          {allImages.length > 0 ? (
            <>
              <div className="mb-4 relative overflow-hidden rounded-lg border border-gray-200">
                <img
                  src={allImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-[500px] object-contain bg-white"
                />
                {product.discount_percentage > 0 && (
                  <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-4 py-2 rounded">
                    -{product.discount_percentage}% OFF
                  </span>
                )}
                {product.is_new && (
                  <span className="absolute top-4 right-4 bg-green-500 text-white text-sm font-bold px-4 py-2 rounded">
                    NEW
                  </span>
                )}
              </div>
              <div className="grid grid-cols-4 gap-4">
                {allImages.map((image, index) => (
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
                      className="w-full h-24 object-contain bg-white"
                    />
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="mb-4 relative overflow-hidden rounded-lg border border-gray-200 bg-gray-100 h-[500px] flex items-center justify-center">
              <div className="text-center text-gray-500">
                <FiImage className="h-16 w-16 mx-auto mb-4" />
                <p>No images available</p>
              </div>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
          
          {/* Price or B2B Message */}
          {isB2B ? (
            <div className="mb-6 p-4 bg-primary-50 border border-primary-200 rounded-lg">
              <p className="text-lg font-semibold text-primary-900 mb-2">
                Price on Request
              </p>
              <p className="text-sm text-primary-700">
                This is a B2B product. Please request a quote for pricing and availability.
              </p>
            </div>
          ) : (
            <div className="mb-6">
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold text-gray-900">
                  ₹{product.price}
                </span>
                {(product.original_price ?? product.mrp) && (
                  <span className="text-2xl text-gray-400 line-through">
                    ₹{product.original_price ?? product.mrp}
                  </span>
                )}
              </div>
              {(product.discount_percentage || (product.original_price && product.price)) && (
                <p className="text-green-600 font-medium mt-2">
                  {product.original_price && product.price ? (
                    <>You save ₹{(Number(product.original_price) - Number(product.price)).toFixed(2)}</>
                  ) : null}
                </p>
              )}
            </div>
          )}

          {/* Description */}
          <p className="text-gray-700 mb-6 leading-relaxed">
            {product.short_description || product.description || ''}
          </p>

          {/* Features */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Key Features:</h3>
            <ul className="space-y-2">
              {(product.features || []).map((feature, index) => (
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
          {!isB2B && (
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
                  {inStock ? `In Stock${Number.isFinite(Number(stockQty)) ? ` (${Number(stockQty)})` : ''}` : 'Out of Stock'}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 mb-8">
            {isB2B ? (
              <button
                onClick={() => setShowRequestPriceModal(true)}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                <FiDollarSign size={20} />
                Request Price
              </button>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                <FiShoppingCart size={20} />
                Add to Cart
              </button>
            )}
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
              onClick={() => setActiveTab('attributes')}
              className={`pb-4 font-semibold ${
                activeTab === 'attributes'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Attributes
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 font-semibold ${
                activeTab === 'reviews'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Reviews (0)
            </button>
          </div>
        </div>

        <div className="py-8">
          {activeTab === 'description' && (
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
              {product.features && product.features.length > 0 && (
                <>
                  <h3 className="text-xl font-bold text-gray-900 mt-6 mb-4">Key Features</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="text-gray-700">{feature}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}

          {activeTab === 'attributes' && (
            <div className="space-y-6">
              {attributes.filter(attr => attr.is_active).map((attribute) => {
                const productAttributeValue = product.attributes?.[attribute.id];
                if (!productAttributeValue) return null;
                
                return (
                  <div key={attribute.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{attribute.name}</h4>
                      <span className="text-xs text-gray-500 capitalize">
                        {attribute.type.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <div className="text-gray-700">
                      {attribute.type === 'color' && productAttributeValue && (
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-6 h-6 rounded-full border"
                            style={{ backgroundColor: productAttributeValue }}
                          />
                          <span>{productAttributeValue}</span>
                        </div>
                      )}
                      
                      {attribute.type === 'checkbox' && Array.isArray(productAttributeValue) && (
                        <div className="flex flex-wrap gap-2">
                          {productAttributeValue.map((value, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 rounded text-sm">
                              {value}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {!['color', 'checkbox'].includes(attribute.type) && (
                        <span>{Array.isArray(productAttributeValue) ? productAttributeValue.join(', ') : productAttributeValue}</span>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {attributes.filter(attr => attr.is_active).length === 0 && (
                <p className="text-gray-500 text-center py-8">No attributes available for this product.</p>
              )}
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
            More from {product.brand?.name || product.brandName || 'Brand'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(relatedProduct => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      )}
      
      <RequestPriceModal
        product={product}
        isOpen={showRequestPriceModal}
        onClose={() => setShowRequestPriceModal(false)}
      />
    </div>
  );
};

export default ProductDetail;

