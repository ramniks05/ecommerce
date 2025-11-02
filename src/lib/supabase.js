import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase is configured
const isSupabaseConfigured = supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project.supabase.co' && 
  !supabaseAnonKey.includes('your-anon-key');

// Show helpful message if not configured
if (!isSupabaseConfigured) {
  console.warn('%c⚠️ Supabase Not Configured', 'color: orange; font-weight: bold; font-size: 14px');
  console.warn('%cPlease configure Supabase in .env.local', 'color: orange; font-size: 12px');
}

// Create Supabase client with proper configuration
const supabaseConfig = {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  }
};

const supabase = createClient(
  supabaseUrl || 'https://demo.supabase.co',
  supabaseAnonKey || 'demo-key',
  supabaseConfig
);

export { supabase, isSupabaseConfigured };

// Helper functions for common operations
export const supabaseHelpers = {
  // Products
  async getProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*, brands(name, slug), categories(name, slug)')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getProductBySlug(slug) {
    const { data, error } = await supabase
      .from('products')
      .select('*, brands(name, slug), categories(name, slug)')
      .eq('slug', slug)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Brands
  async getBrands() {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  },

  async getBrandBySlug(slug) {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Orders
  async createOrder(orderData) {
    const { data, error } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUserOrders(userId) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Categories
  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  },
};
