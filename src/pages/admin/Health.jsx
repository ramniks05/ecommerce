import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

const REQUIRED_BUCKETS = [
  'brand-logos',
  'brand-heroes',
  'category-images',
  'product-images',
  'banner-images'
];

const Health = () => {
  const [checks, setChecks] = useState({
    env: { ok: false, details: '' },
    brands: { ok: false, details: '' },
    categories: { ok: false, details: '' },
    products: { ok: false, details: '' },
    buckets: { ok: false, details: '' },
  });
  const [loading, setLoading] = useState(true);
  const [envDetails, setEnvDetails] = useState({ url: '', key: '' });

  useEffect(() => {
    const runChecks = async () => {
      const results = { ...checks };

      // Check environment variables
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      setEnvDetails({
        url: supabaseUrl || 'NOT SET',
        key: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'NOT SET'
      });

      // Env/config
      let envMessage = '';
      if (!supabaseUrl || supabaseUrl === 'https://your-project.supabase.co') {
        envMessage = 'VITE_SUPABASE_URL is missing or has default value';
      } else if (!supabaseAnonKey || supabaseAnonKey.includes('your-anon-key')) {
        envMessage = 'VITE_SUPABASE_ANON_KEY is missing or has default value';
      } else {
        envMessage = 'Environment variables configured';
      }
      
      results.env.ok = !!isSupabaseConfigured;
      results.env.details = envMessage;

      // Tables (head count selects) with timeout
      try {
        const brandsPromise = supabase.from('brands').select('*', { count: 'exact', head: true });
        const brandsTimeout = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Brands check timeout after 15s')), 15000)
        );
        const brands = await Promise.race([brandsPromise, brandsTimeout]);
        results.brands.ok = !brands.error;
        results.brands.details = brands.error 
          ? `${brands.error.message} (code: ${brands.error.code || 'N/A'})` 
          : `OK (count available)`;
      } catch (e) {
        results.brands.ok = false;
        results.brands.details = e.message || 'brands check failed';
      }

      try {
        const categoriesPromise = supabase.from('categories').select('*', { count: 'exact', head: true });
        const categoriesTimeout = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Categories check timeout after 15s')), 15000)
        );
        const categories = await Promise.race([categoriesPromise, categoriesTimeout]);
        results.categories.ok = !categories.error;
        results.categories.details = categories.error 
          ? `${categories.error.message} (code: ${categories.error.code || 'N/A'})` 
          : `OK (count available)`;
      } catch (e) {
        results.categories.ok = false;
        results.categories.details = e.message || 'categories check failed';
      }

      try {
        const productsPromise = supabase.from('products').select('*', { count: 'exact', head: true });
        const productsTimeout = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Products check timeout after 15s')), 15000)
        );
        const products = await Promise.race([productsPromise, productsTimeout]);
        results.products.ok = !products.error;
        results.products.details = products.error 
          ? `${products.error.message} (code: ${products.error.code || 'N/A'})` 
          : `OK (count available)`;
      } catch (e) {
        results.products.ok = false;
        results.products.details = e.message || 'products check failed';
      }

      // Buckets with timeout
      try {
        const bucketsPromise = supabase.storage.listBuckets();
        const bucketsTimeout = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Buckets check timeout after 15s')), 15000)
        );
        const { data: buckets, error } = await Promise.race([bucketsPromise, bucketsTimeout]);
        if (error) throw error;
        const names = (buckets || []).map(b => b.name);
        const missing = REQUIRED_BUCKETS.filter(b => !names.includes(b));
        results.buckets.ok = missing.length === 0;
        results.buckets.details = missing.length === 0 ? 'All required buckets exist' : `Missing: ${missing.join(', ')}`;
      } catch (e) {
        results.buckets.ok = false;
        results.buckets.details = e.message || 'bucket check failed';
      }

      setChecks(results);
      setLoading(false);
    };

    // Add overall timeout
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 20000);

    runChecks().finally(() => clearTimeout(timeout));

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-3 text-gray-700">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
          Running health checks...
        </div>
      </div>
    );
  }

  const Row = ({ label, ok, details }) => (
    <div className="flex items-start justify-between p-4 border rounded-lg bg-white">
      <div>
        <div className="font-semibold text-gray-900">{label}</div>
        <div className={`text-sm ${ok ? 'text-gray-600' : 'text-red-600'}`}>{details}</div>
      </div>
      <div className={`mt-1 px-2 py-1 text-xs rounded ${ok ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        {ok ? 'OK' : 'FAIL'}
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Supabase Health</h1>
      <p className="text-gray-600">Quick checks for configuration, database, and storage.</p>

      {!checks.env.ok && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Configuration Required</h3>
          <p className="text-sm text-yellow-800 mb-3">
            Supabase environment variables are missing or not configured. This will cause all health checks to fail until configured. Follow these steps:
          </p>
          <ol className="list-decimal list-inside text-sm text-yellow-800 space-y-1 mb-3">
            <li>Create a <code className="bg-yellow-100 px-1 rounded">.env.local</code> file in the project root</li>
            <li>Copy the template: <code className="bg-yellow-100 px-1 rounded">env.local.template</code></li>
            <li>Add your Supabase credentials from your Supabase dashboard</li>
            <li>Restart the development server (important: env vars load on server start)</li>
          </ol>
          <div className="text-xs text-yellow-700 bg-yellow-100 p-2 rounded mt-2">
            <div><strong>Current Status:</strong></div>
            <div>VITE_SUPABASE_URL: <span className="font-mono">{envDetails.url}</span></div>
            <div>VITE_SUPABASE_ANON_KEY: <span className="font-mono">{envDetails.key}</span></div>
          </div>
          <div className="text-xs text-yellow-700 mt-2">
            <strong>Get credentials from:</strong> <a href="https://supabase.com/dashboard/project/_/settings/api" target="_blank" rel="noopener noreferrer" className="underline">Supabase Dashboard → Settings → API</a>
          </div>
          <div className="text-xs text-yellow-700 mt-2 italic">
            <strong>Note:</strong> Database and storage checks below will also fail until environment variables are properly configured.
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        <Row label="Environment" ok={checks.env.ok} details={checks.env.details} />
        <Row label="Table: brands" ok={checks.brands.ok} details={checks.brands.details} />
        <Row label="Table: categories" ok={checks.categories.ok} details={checks.categories.details} />
        <Row label="Table: products" ok={checks.products.ok} details={checks.products.details} />
        <Row label="Storage buckets" ok={checks.buckets.ok} details={checks.buckets.details} />
      </div>
    </div>
  );
};

export default Health;
