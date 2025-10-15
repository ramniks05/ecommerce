import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube } from 'react-icons/fi';
import { brands } from '../data/mockData';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">BrandStore</h3>
            <p className="text-sm mb-4">
              Your premier destination for authentic branded products. Quality, style, and trust in every purchase.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary-400 transition-colors" aria-label="Facebook">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors" aria-label="Twitter">
                <FiTwitter size={20} />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors" aria-label="Instagram">
                <FiInstagram size={20} />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors" aria-label="YouTube">
                <FiYoutube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-primary-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary-400 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-primary-400 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-primary-400 transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-primary-400 transition-colors">
                  Returns Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Featured Brands */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Featured Brands</h3>
            <ul className="space-y-2 text-sm">
              {brands.slice(0, 5).map(brand => (
                <li key={brand.id}>
                  <Link
                    to={`/brands/${brand.slug}`}
                    className="hover:text-primary-400 transition-colors"
                  >
                    {brand.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Newsletter</h3>
            <p className="text-sm mb-4">
              Subscribe to get special offers and updates.
            </p>
            <form className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 rounded bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-primary-500"
              />
              <button
                type="submit"
                className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p>&copy; 2024 BrandStore. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-primary-400 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-primary-400 transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="hover:text-primary-400 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

