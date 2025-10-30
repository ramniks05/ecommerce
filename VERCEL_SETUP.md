# Vercel Environment Variables Setup Guide
# Your Live Site: https://ecommerce-three-zeta-65.vercel.app

## Step 1: Get Your Supabase Credentials

Open your `.env.local` file (in project root) and copy these values:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 2: Add to Vercel

1. Go to: https://vercel.com/dashboard
2. Click on your project: `ecommerce-three-zeta-65`
3. Go to: **Settings** → **Environment Variables**
4. Click **Add New**

### Add Variable 1:
- **Key**: `VITE_SUPABASE_URL`
- **Value**: (paste from .env.local)
- **Environment**: ✅ Production ✅ Preview ✅ Development
- Click **Save**

### Add Variable 2:
- **Key**: `VITE_SUPABASE_ANON_KEY`
- **Value**: (paste from .env.local)
- **Environment**: ✅ Production ✅ Preview ✅ Development
- Click **Save**

## Step 3: Redeploy

1. Go to **Deployments** tab
2. Click **⋯** (three dots) on latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

## Step 4: Update Supabase Auth

1. Go to Supabase Dashboard → **Authentication** → **URL Configuration**
2. Set **Site URL**: `https://ecommerce-three-zeta-65.vercel.app`
3. Add **Redirect URLs**:
   - `https://ecommerce-three-zeta-65.vercel.app`
   - `https://ecommerce-three-zeta-65.vercel.app/admin/login`
   - `https://ecommerce-three-zeta-65.vercel.app/**`
4. Click **Save**

## Step 5: Verify

1. Visit: https://ecommerce-three-zeta-65.vercel.app/admin/health
   - Should show ✅ Env: OK
   - Should show ✅ Tables: OK
   - Should show ✅ Buckets: OK

2. Visit: https://ecommerce-three-zeta-65.vercel.app
   - Brands, categories, products should load

3. Test admin login: https://ecommerce-three-zeta-65.vercel.app/admin/login
   - After login, data should appear in admin pages

## Troubleshooting

**If data still not showing:**
- Check browser console (F12) for errors
- Verify environment variables are set correctly in Vercel
- Make sure you redeployed after adding variables
- Check Supabase Auth URL Configuration includes your live URL

