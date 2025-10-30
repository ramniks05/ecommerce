import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';
import { WishlistProvider } from './context/WishlistContext';

import Footer from './components/Footer';
import Header from './components/Header';
import Notification from './components/Notification';

import AuthCallback from './pages/AuthCallback';
import BrandDetail from './pages/BrandDetail';
import Brands from './pages/Brands';
import Cart from './pages/Cart';
import Categories from './pages/Categories';
import CategoryDetail from './pages/CategoryDetail';
import Checkout from './pages/Checkout';
import Home from './pages/Home';
import Landing from './pages/Landing';
import Login from './pages/Login';
import OrderConfirmation from './pages/OrderConfirmation';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import ProductDetail from './pages/ProductDetail';
import Products from './pages/Products';
import Profile from './pages/Profile';
import Register from './pages/Register';
import Wishlist from './pages/Wishlist';

// Admin
import AdminInit from './components/AdminInit';
import AdminLayout from './components/AdminLayout';
import AttributeManagement from './pages/admin/AttributeManagement';
import BannerManagement from './pages/admin/BannerManagement';
import BrandManagement from './pages/admin/BrandManagement';
import CategoryManagement from './pages/admin/CategoryManagement';
import AdminDashboard from './pages/admin/Dashboard';
import Health from './pages/admin/Health';
import AdminLogin from './pages/admin/Login';
import OrdersManagement from './pages/admin/OrdersManagement';
import ProductsManagement from './pages/admin/ProductsManagement';
import UserManagement from './pages/admin/UserManagement';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <NotificationProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <div className="flex flex-col min-h-screen">
              {!isAdminRoute && <Header />}
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
                  <Route path="/orders/:orderId" element={<OrderDetail />} />
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
                  <Route path="/admin/attributes" element={<AdminLayout><AttributeManagement /></AdminLayout>} />
                  <Route path="/admin/health" element={<AdminLayout><Health /></AdminLayout>} />
                  <Route path="/admin/settings" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
                </Routes>
              </main>
              {!isAdminRoute && <Footer />}
            </div>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
