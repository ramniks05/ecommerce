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

  useEffect(() => {
    const runChecks = async () => {
      const results = { ...checks };

      // Env/config
      results.env.ok = !!isSupabaseConfigured;
      results.env.details = isSupabaseConfigured ? 'Supabase configured' : 'Missing/invalid env vars';

      // Tables (head count selects)
      try {
        const brands = await supabase.from('brands').select('*', { count: 'exact', head: true });
        results.brands.ok = !brands.error;
        results.brands.details = brands.error ? brands.error.message : `OK (count available)`;
      } catch (e) {
        results.brands.ok = false;
        results.brands.details = e.message || 'brands check failed';
      }

      try {
        const categories = await supabase.from('categories').select('*', { count: 'exact', head: true });
        results.categories.ok = !categories.error;
        results.categories.details = categories.error ? categories.error.message : `OK (count available)`;
      } catch (e) {
        results.categories.ok = false;
        results.categories.details = e.message || 'categories check failed';
      }

      try {
        const products = await supabase.from('products').select('*', { count: 'exact', head: true });
        results.products.ok = !products.error;
        results.products.details = products.error ? products.error.message : `OK (count available)`;
      } catch (e) {
        results.products.ok = false;
        results.products.details = e.message || 'products check failed';
      }

      // Buckets
      try {
        const { data: buckets, error } = await supabase.storage.listBuckets();
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

    runChecks();
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


