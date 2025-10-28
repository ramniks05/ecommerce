import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

import Header from './components/Header';
import Footer from './components/Footer';
import Notification from './components/Notification';

import Home from './pages/Home';
import Landing from './pages/Landing';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Brands from './pages/Brands';
import BrandDetail from './pages/BrandDetail';
import Categories from './pages/Categories';
import CategoryDetail from './pages/CategoryDetail';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import OrderConfirmation from './pages/OrderConfirmation';
import AuthCallback from './pages/AuthCallback';

// Admin
import AdminLayout from './components/AdminLayout';
import AdminInit from './components/AdminInit';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import ProductsManagement from './pages/admin/ProductsManagement';
import OrdersManagement from './pages/admin/OrdersManagement';
import BannerManagement from './pages/admin/BannerManagement';
import BrandManagement from './pages/admin/BrandManagement';
import CategoryManagement from './pages/admin/CategoryManagement';
import UserManagement from './pages/admin/UserManagement';
import Health from './pages/admin/Health';

function App() {
  return (
    <Router>
      <NotificationProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <div className="flex flex-col min-h-screen">
                <Header />
                <Notification />
                <main className="flex-grow">
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Landing />} />
                    <Route path="/home-old" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:slug" element={<ProductDetail />} />
                    <Route path="/brands" element={<Brands />} />
                    <Route path="/brands/:slug" element={<BrandDetail />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/category/:slug" element={<CategoryDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/auth/callback" element={<AuthCallback />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
                    
                    {/* Admin Routes */}
                    <Route path="/admin/init" element={<AdminInit />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
                    <Route path="/admin/products" element={<AdminLayout><ProductsManagement /></AdminLayout>} />
                    <Route path="/admin/orders" element={<AdminLayout><OrdersManagement /></AdminLayout>} />
                    <Route path="/admin/banners" element={<AdminLayout><BannerManagement /></AdminLayout>} />
                    <Route path="/admin/brands" element={<AdminLayout><BrandManagement /></AdminLayout>} />
                    <Route path="/admin/categories" element={<AdminLayout><CategoryManagement /></AdminLayout>} />
                    <Route path="/admin/users" element={<AdminLayout><UserManagement /></AdminLayout>} />
                    <Route path="/admin/health" element={<AdminLayout><Health /></AdminLayout>} />
                    <Route path="/admin/settings" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </NotificationProvider>
    </Router>
  );
}

export default App;
