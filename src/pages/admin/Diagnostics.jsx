import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { productService } from '../../services/supabaseService';
import { jsonStorage, safeStorage } from '../../utils/safeStorage';

const Diagnostics = () => {
  const [tests, setTests] = useState({
    supabaseConfig: { status: 'pending', message: '' },
    directQuery: { status: 'pending', message: '', data: null },
    productService: { status: 'pending', message: '', data: null },
    localStorage: { status: 'pending', message: '', data: null },
    adminUser: { status: 'pending', message: '', data: null }
  });

  useEffect(() => {
    const runDiagnostics = async () => {
      const results = { ...tests };

      // Test 1: Supabase Configuration
      try {
        const url = import.meta.env.VITE_SUPABASE_URL;
        const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
        if (url && key && url !== 'https://your-project.supabase.co') {
          results.supabaseConfig = {
            status: 'success',
            message: `Configured (URL: ${url.substring(0, 30)}...)`
          };
        } else {
          results.supabaseConfig = {
            status: 'error',
            message: 'Not configured or using default values'
          };
        }
      } catch (e) {
        results.supabaseConfig = { status: 'error', message: e.message };
      }

      // Test 2: Direct Supabase Query
      try {
        const { data, error, count } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });
        
        if (error) throw error;
        results.directQuery = {
          status: 'success',
          message: `Direct query works (count: ${count})`,
          data: count
        };
      } catch (e) {
        results.directQuery = {
          status: 'error',
          message: `${e.message || e} (code: ${e.code || 'N/A'})`,
          data: null
        };
      }

      // Test 3: Product Service
      try {
        const result = await productService.getActiveProducts();
        if (result.error) throw result.error;
        const count = Array.isArray(result.data) ? result.data.length : 0;
        results.productService = {
          status: 'success',
          message: `Product service works (${count} products)`,
          data: count
        };
      } catch (e) {
        results.productService = {
          status: 'error',
          message: `${e.message || e}`,
          data: null
        };
      }

      // Test 4: LocalStorage
      try {
        const testKey = '__diagnostics_test__';
        safeStorage.setItem(testKey, 'test');
        const value = safeStorage.getItem(testKey);
        safeStorage.removeItem(testKey);
        
        if (value === 'test') {
          results.localStorage = {
            status: 'success',
            message: 'localStorage is working',
            data: { available: true }
          };
        } else {
          results.localStorage = {
            status: 'warning',
            message: 'localStorage test failed',
            data: { available: false }
          };
        }
      } catch (e) {
        results.localStorage = {
          status: 'error',
          message: `localStorage error: ${e.message}`,
          data: { available: false }
        };
      }

      // Test 5: Admin User
      try {
        const adminUser = jsonStorage.get('adminUser', null);
        const isAdmin = safeStorage.getItem('isAdmin');
        results.adminUser = {
          status: adminUser || isAdmin === 'true' ? 'success' : 'warning',
          message: adminUser 
            ? `Admin user found: ${adminUser.email || adminUser.name || 'unknown'}`
            : isAdmin === 'true'
            ? 'isAdmin flag is set'
            : 'No admin user found',
          data: adminUser
        };
      } catch (e) {
        results.adminUser = {
          status: 'error',
          message: `Error checking admin: ${e.message}`,
          data: null
        };
      }

      setTests(results);
    };

    runDiagnostics();
  }, []);

  const TestRow = ({ label, test }) => (
    <div className="p-4 border rounded-lg bg-white">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="font-semibold text-gray-900 mb-1">{label}</div>
          <div className={`text-sm ${test.status === 'success' ? 'text-green-600' : test.status === 'warning' ? 'text-yellow-600' : 'text-red-600'}`}>
            {test.message}
          </div>
          {test.data && (
            <div className="text-xs text-gray-500 mt-1 font-mono">
              Data: {typeof test.data === 'object' ? JSON.stringify(test.data, null, 2) : test.data}
            </div>
          )}
        </div>
        <div className={`ml-4 px-3 py-1 text-xs rounded font-semibold ${
          test.status === 'success' ? 'bg-green-100 text-green-800' :
          test.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {test.status === 'pending' ? 'PENDING' : test.status.toUpperCase()}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">System Diagnostics</h1>
      <p className="text-gray-600">Comprehensive checks for products and admin login issues</p>

      <div className="grid grid-cols-1 gap-4">
        <TestRow label="1. Supabase Configuration" test={tests.supabaseConfig} />
        <TestRow label="2. Direct Supabase Query" test={tests.directQuery} />
        <TestRow label="3. Product Service" test={tests.productService} />
        <TestRow label="4. LocalStorage Access" test={tests.localStorage} />
        <TestRow label="5. Admin User Status" test={tests.adminUser} />
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Quick Fixes</h3>
        <div className="space-y-2 text-sm text-blue-800">
          <button
            onClick={() => {
              console.log('🧹 Clearing all cache...');
              jsonStorage.clear();
              safeStorage.clear();
              window.location.reload();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Clear All Cache & Reload
          </button>
          <button
            onClick={() => {
              console.log('🧹 Clearing only localStorage cache...');
              const keys = Object.keys(localStorage);
              keys.forEach(key => {
                if (!key.includes('supabase') && key !== 'user') {
                  localStorage.removeItem(key);
                }
              });
              window.location.reload();
            }}
            className="ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Clear localStorage (keep auth)
          </button>
        </div>
      </div>
    </div>
  );
};

export default Diagnostics;

