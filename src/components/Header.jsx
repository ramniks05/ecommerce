import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiHeart, FiUser, FiMenu, FiX } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { getCartCount } = useCart();
  const { wishlistItems } = useWishlist();
  const { user, logout } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-primary-600 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            <p>Free shipping on orders over ₹5,000</p>
            <div className="flex gap-4">
              <Link to="/brands" className="hover:underline">Brands</Link>
              <Link to="/about" className="hover:underline">About Us</Link>
              <Link to="/contact" className="hover:underline">Contact</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary-600">
            BrandStore
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Products
            </Link>
            <Link to="/brands" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Brands
            </Link>
            <Link to="/categories" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Categories
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-gray-700 hover:text-primary-600 transition-colors"
              aria-label="Search"
            >
              <FiSearch size={22} />
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative text-gray-700 hover:text-primary-600 transition-colors"
              aria-label="Wishlist"
            >
              <FiHeart size={22} />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative text-gray-700 hover:text-primary-600 transition-colors"
              aria-label="Shopping Cart"
            >
              <FiShoppingCart size={22} />
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <div className="relative group">
              <button className="text-gray-700 hover:text-primary-600 transition-colors" aria-label="User menu">
                <FiUser size={22} />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {user ? (
                  <>
                    <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      My Profile
                    </Link>
                    <Link to="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      My Orders
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Login
                    </Link>
                    <Link to="/register" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-700 hover:text-primary-600 transition-colors"
              aria-label="Menu"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="mt-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products, brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full input-field pr-10"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-600"
              >
                <FiSearch size={20} />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-700 hover:text-primary-600 font-medium"
            >
              Home
            </Link>
            <Link
              to="/products"
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-700 hover:text-primary-600 font-medium"
            >
              Products
            </Link>
            <Link
              to="/brands"
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-700 hover:text-primary-600 font-medium"
            >
              Brands
            </Link>
            <Link
              to="/categories"
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-700 hover:text-primary-600 font-medium"
            >
              Categories
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;

