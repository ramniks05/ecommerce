import { supabase } from '../lib/supabase';

// =============================================
// AUTHENTICATION SERVICES
// =============================================

export const authService = {
  // Sign up new user
  async signUp(email, password, userData = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    return { data, error };
  },

  // Sign in user
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  // Sign out user
  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  // Update user profile
  async updateProfile(userId, profileData) {
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({ id: userId, ...profileData })
      .select()
      .single();
    return { data, error };
  },

  // Get user profile
  async getUserProfile(userId) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  }
};

// =============================================
// ADMIN SERVICES
// =============================================

export const adminService = {
  // Get all admin users
  async getAdminUsers() {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Create admin user
  async createAdminUser(adminData) {
    const { data, error } = await supabase
      .from('admin_users')
      .insert(adminData)
      .select()
      .single();
    return { data, error };
  },

  // Update admin user
  async updateAdminUser(id, adminData) {
    const { data, error } = await supabase
      .from('admin_users')
      .update(adminData)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  // Delete admin user
  async deleteAdminUser(id) {
    const { error } = await supabase
      .from('admin_users')
      .delete()
      .eq('id', id);
    return { error };
  }
};

// =============================================
// SITE SETTINGS SERVICES
// =============================================

export const settingsService = {
  // Get all settings
  async getSettings() {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*');
    
    if (error) return { data: null, error };
    
    // Convert array to object
    const settings = {};
    data.forEach(setting => {
      settings[setting.key] = setting.value;
    });
    
    return { data: settings, error: null };
  },

  // Update setting
  async updateSetting(key, value, description = null) {
    const { data, error } = await supabase
      .from('site_settings')
      .upsert({ key, value, description })
      .select()
      .single();
    return { data, error };
  },

  // Get specific setting
  async getSetting(key) {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('key', key)
      .single();
    return { data, error };
  }
};

// =============================================
// BANNER SERVICES
// =============================================

export const bannerService = {
  // Get all banners
  async getBanners() {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .order('position', { ascending: true });
    return { data, error };
  },

  // Get active banners
  async getActiveBanners() {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .eq('is_active', true)
      .order('position', { ascending: true });
    return { data, error };
  },

  // Create banner
  async createBanner(bannerData) {
    const { data, error } = await supabase
      .from('banners')
      .insert(bannerData)
      .select()
      .single();
    return { data, error };
  },

  // Update banner
  async updateBanner(id, bannerData) {
    const { data, error } = await supabase
      .from('banners')
      .update(bannerData)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  // Delete banner
  async deleteBanner(id) {
    const { error } = await supabase
      .from('banners')
      .delete()
      .eq('id', id);
    return { error };
  },

  // Reorder banners
  async reorderBanners(bannerIds) {
    const updates = bannerIds.map((id, index) => 
      supabase
        .from('banners')
        .update({ position: index })
        .eq('id', id)
    );
    
    const results = await Promise.all(updates);
    const errors = results.filter(result => result.error);
    
    return { error: errors.length > 0 ? errors[0].error : null };
  }
};

// =============================================
// CATEGORY SERVICES
// =============================================

export const categoryService = {
  // Get all categories
  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });
    return { data, error };
  },

  // Get active categories
  async getActiveCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    return { data, error };
  },

  // Get category by slug
  async getCategoryBySlug(slug) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single();
    return { data, error };
  },

  // Create category
  async createCategory(categoryData) {
    const { data, error } = await supabase
      .from('categories')
      .insert(categoryData)
      .select()
      .single();
    return { data, error };
  },

  // Update category
  async updateCategory(id, categoryData) {
    const { data, error } = await supabase
      .from('categories')
      .update(categoryData)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  // Delete category
  async deleteCategory(id) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    return { error };
  }
};

// =============================================
// BRAND SERVICES
// =============================================

export const brandService = {
  // Get all brands
  async getBrands() {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .order('sort_order', { ascending: true });
    return { data, error };
  },

  // Get active brands
  async getActiveBrands() {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    return { data, error };
  },

  // Get featured brands
  async getFeaturedBrands() {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('is_active', true)
      .eq('is_featured', true)
      .order('sort_order', { ascending: true });
    return { data, error };
  },

  // Get brand by slug
  async getBrandBySlug(slug) {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('slug', slug)
      .single();
    return { data, error };
  },

  // Get brand products count
  async getBrandProductsCount(brandId) {
    const { count, error } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('brand_id', brandId)
      .eq('is_active', true);
    return { count, error };
  },

  // Create brand
  async createBrand(brandData) {
    const { data, error } = await supabase
      .from('brands')
      .insert(brandData)
      .select()
      .single();
    return { data, error };
  },

  // Update brand
  async updateBrand(id, brandData) {
    const { data, error } = await supabase
      .from('brands')
      .update(brandData)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  // Delete brand
  async deleteBrand(id) {
    const { error } = await supabase
      .from('brands')
      .delete()
      .eq('id', id);
    return { error };
  }
};

// =============================================
// PRODUCT SERVICES
// =============================================

export const productService = {
  // Get all products with filters
  async getProducts(filters = {}) {
    let query = supabase
      .from('products')
      .select(`
        *,
        brands(name, slug, logo_url),
        categories(name, slug)
      `);

    // Apply filters
    if (filters.brand_id) {
      query = query.eq('brand_id', filters.brand_id);
    }
    if (filters.category_id) {
      query = query.eq('category_id', filters.category_id);
    }
    if (filters.is_featured !== undefined) {
      query = query.eq('is_featured', filters.is_featured);
    }
    if (filters.is_new !== undefined) {
      query = query.eq('is_new', filters.is_new);
    }
    if (filters.is_bestseller !== undefined) {
      query = query.eq('is_bestseller', filters.is_bestseller);
    }
    if (filters.min_price) {
      query = query.gte('price', filters.min_price);
    }
    if (filters.max_price) {
      query = query.lte('price', filters.max_price);
    }
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    // Apply sorting
    const sortBy = filters.sortBy || 'created_at';
    const sortOrder = filters.sortOrder || 'desc';
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    if (filters.page && filters.limit) {
      const from = (filters.page - 1) * filters.limit;
      const to = from + filters.limit - 1;
      query = query.range(from, to);
    }

    const { data, error, count } = await query;
    return { data, error, count };
  },

  // Get active products only
  async getActiveProducts(filters = {}) {
    return this.getProducts({ ...filters, is_active: true });
  },

  // Get product by slug
  async getProductBySlug(slug) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        brands(name, slug, logo_url, description),
        categories(name, slug),
        product_variants(*)
      `)
      .eq('slug', slug)
      .single();
    return { data, error };
  },

  // Get featured products
  async getFeaturedProducts(limit = 8) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        brands(name, slug, logo_url),
        categories(name, slug)
      `)
      .eq('is_active', true)
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(limit);
    return { data, error };
  },

  // Get new products
  async getNewProducts(limit = 8) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        brands(name, slug, logo_url),
        categories(name, slug)
      `)
      .eq('is_active', true)
      .eq('is_new', true)
      .order('created_at', { ascending: false })
      .limit(limit);
    return { data, error };
  },

  // Get bestseller products
  async getBestsellerProducts(limit = 8) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        brands(name, slug, logo_url),
        categories(name, slug)
      `)
      .eq('is_active', true)
      .eq('is_bestseller', true)
      .order('view_count', { ascending: false })
      .limit(limit);
    return { data, error };
  },

  // Create product
  async createProduct(productData) {
    const { data, error } = await supabase
      .from('products')
      .insert(productData)
      .select()
      .single();
    return { data, error };
  },

  // Update product
  async updateProduct(id, productData) {
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  // Delete product
  async deleteProduct(id) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    return { error };
  },

  // Update product view count
  async updateViewCount(productId) {
    const { error } = await supabase
      .from('products')
      .update({ view_count: supabase.raw('view_count + 1') })
      .eq('id', productId);
    return { error };
  }
};

// =============================================
// CART SERVICES
// =============================================

export const cartService = {
  // Get user cart
  async getUserCart(userId) {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        products(*),
        product_variants(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Add to cart
  async addToCart(userId, productId, quantity = 1, variantId = null) {
    const { data, error } = await supabase
      .from('cart_items')
      .upsert({
        user_id: userId,
        product_id: productId,
        variant_id: variantId,
        quantity
      })
      .select()
      .single();
    return { data, error };
  },

  // Update cart item quantity
  async updateCartItemQuantity(cartItemId, quantity) {
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', cartItemId)
      .select()
      .single();
    return { data, error };
  },

  // Remove from cart
  async removeFromCart(cartItemId) {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId);
    return { error };
  },

  // Clear user cart
  async clearUserCart(userId) {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);
    return { error };
  }
};

// =============================================
// WISHLIST SERVICES
// =============================================

export const wishlistService = {
  // Get user wishlist
  async getUserWishlist(userId) {
    const { data, error } = await supabase
      .from('wishlist_items')
      .select(`
        *,
        products(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Add to wishlist
  async addToWishlist(userId, productId) {
    const { data, error } = await supabase
      .from('wishlist_items')
      .insert({
        user_id: userId,
        product_id: productId
      })
      .select()
      .single();
    return { data, error };
  },

  // Remove from wishlist
  async removeFromWishlist(userId, productId) {
    const { error } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);
    return { error };
  },

  // Check if product is in wishlist
  async isInWishlist(userId, productId) {
    const { data, error } = await supabase
      .from('wishlist_items')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();
    return { data: !!data, error };
  }
};

// =============================================
// ORDER SERVICES
// =============================================

export const orderService = {
  // Get user orders
  async getUserOrders(userId) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(
          *,
          products(name, images)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Get all orders (admin)
  async getAllOrders(filters = {}) {
    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items(
          *,
          products(name, images)
        ),
        user_profiles(first_name, last_name, email)
      `);

    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.payment_status) {
      query = query.eq('payment_status', filters.payment_status);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error, count } = await query;
    return { data, error, count };
  },

  // Get order by ID
  async getOrderById(orderId) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(
          *,
          products(name, images, slug)
        ),
        user_profiles(first_name, last_name, email, phone)
      `)
      .eq('id', orderId)
      .single();
    return { data, error };
  },

  // Create order
  async createOrder(orderData) {
    const { data, error } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();
    return { data, error };
  },

  // Update order status
  async updateOrderStatus(orderId, status, additionalData = {}) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status, ...additionalData })
      .eq('id', orderId)
      .select()
      .single();
    return { data, error };
  },

  // Update payment status
  async updatePaymentStatus(orderId, paymentStatus, paymentId = null) {
    const { data, error } = await supabase
      .from('orders')
      .update({ 
        payment_status: paymentStatus,
        payment_id: paymentId
      })
      .eq('id', orderId)
      .select()
      .single();
    return { data, error };
  }
};

// =============================================
// REVIEW SERVICES
// =============================================

export const reviewService = {
  // Get product reviews
  async getProductReviews(productId) {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        user_profiles(first_name, last_name, avatar_url)
      `)
      .eq('product_id', productId)
      .eq('is_approved', true)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Create review
  async createReview(reviewData) {
    const { data, error } = await supabase
      .from('reviews')
      .insert(reviewData)
      .select()
      .single();
    return { data, error };
  },

  // Update review
  async updateReview(reviewId, reviewData) {
    const { data, error } = await supabase
      .from('reviews')
      .update(reviewData)
      .eq('id', reviewId)
      .select()
      .single();
    return { data, error };
  },

  // Delete review
  async deleteReview(reviewId) {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId);
    return { error };
  }
};

// =============================================
// ANALYTICS SERVICES
// =============================================

export const analyticsService = {
  // Track page view
  async trackPageView(pageData) {
    const { data, error } = await supabase
      .from('page_views')
      .insert(pageData);
    return { data, error };
  },

  // Track product view
  async trackProductView(productId, userId = null) {
    const { data, error } = await supabase
      .from('product_views')
      .insert({
        product_id: productId,
        user_id: userId
      });
    return { data, error };
  },

  // Get dashboard stats
  async getDashboardStats() {
    const [
      { count: totalProducts },
      { count: totalOrders },
      { count: totalUsers },
      { data: revenueData }
    ] = await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('total_amount').eq('payment_status', 'paid')
    ]);

    const totalRevenue = revenueData?.reduce((sum, order) => sum + order.total_amount, 0) || 0;

    return {
      totalProducts: totalProducts || 0,
      totalOrders: totalOrders || 0,
      totalUsers: totalUsers || 0,
      totalRevenue
    };
  }
};

// =============================================
// FILE UPLOAD SERVICES
// =============================================

export const fileService = {
  // Upload file to storage
  async uploadFile(bucket, file, fileName, options = {}) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, options);
    return { data, error };
  },

  // Get public URL
  getPublicUrl(bucket, fileName) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);
    return data.publicUrl;
  },

  // Delete file
  async deleteFile(bucket, fileName) {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName]);
    return { error };
  },

  // Upload product image
  async uploadProductImage(file, productId) {
    const fileName = `product-${productId}-${Date.now()}.${file.name.split('.').pop()}`;
    return this.uploadFile('product-images', file, fileName);
  },

  // Upload brand logo
  async uploadBrandLogo(file, brandId) {
    const fileName = `brand-${brandId}-logo-${Date.now()}.${file.name.split('.').pop()}`;
    return this.uploadFile('brand-logos', file, fileName);
  },

  // Upload brand hero image
  async uploadBrandHero(file, brandId) {
    const fileName = `brand-${brandId}-hero-${Date.now()}.${file.name.split('.').pop()}`;
    return this.uploadFile('brand-heroes', file, fileName);
  },

  // Upload category image
  async uploadCategoryImage(file, categoryId) {
    const fileName = `category-${categoryId}-${Date.now()}.${file.name.split('.').pop()}`;
    return this.uploadFile('category-images', file, fileName);
  },

  // Upload banner image
  async uploadBannerImage(file, bannerId) {
    const fileName = `banner-${bannerId}-${Date.now()}.${file.name.split('.').pop()}`;
    return this.uploadFile('banner-images', file, fileName);
  }
};
