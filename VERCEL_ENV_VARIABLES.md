# Vercel Environment Variables Setup Guide

This document explains all required environment variables for deploying this application to Vercel.

## 🔑 Required Environment Variables

### Frontend Variables (must start with `VITE_`)

These variables are embedded into the client-side JavaScript bundle at **build time**. They are visible to users in the browser, so only include **public keys**, never secrets.

#### Supabase Configuration
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-anon-key
```

#### Razorpay Configuration (Public Key Only)
```
VITE_RAZORPAY_KEY_ID=rzp_test_ROysXhPNhStyyy
```
**Note:** This is your Razorpay **Key ID** (public key). The **Key Secret** must NEVER be in frontend variables.

#### Optional: Base URL (for API calls)
```
VITE_PUBLIC_BASE_URL=https://your-vercel-domain.vercel.app
```
Set this if you want to explicitly control the API base URL for serverless functions.

---

### Backend/Serverless Variables (NO `VITE_` prefix)

These variables are only available in serverless functions (API routes). They are **never exposed** to the client.

#### Razorpay Server Configuration
```
RAZORPAY_KEY_ID=rzp_test_ROysXhPNhStyyy
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
```
**Important:** The Key Secret is **only** used in the serverless function (`api/razorpay/create-order.js`) to create Razorpay orders securely.

---

## 📝 How to Set Environment Variables in Vercel

### Step 1: Go to Vercel Dashboard
1. Open your project: https://vercel.com/dashboard
2. Click on your project name
3. Go to **Settings** → **Environment Variables**

### Step 2: Add Variables
For each variable:
1. Click **Add New**
2. Enter the **Name** (exactly as shown above, case-sensitive)
3. Enter the **Value**
4. Select **Environment(s)**:
   - ✅ **Production** (for live site)
   - ✅ **Preview** (for pull request previews)
   - ✅ **Development** (optional, for local Vercel CLI)
5. Click **Save**

### Step 3: Redeploy
**CRITICAL:** After adding or updating environment variables:
1. Go to **Deployments** tab
2. Click the **⋯** menu on the latest deployment
3. Click **Redeploy**
4. **OR** push a new commit to trigger automatic deployment

**Why?** Vite embeds `VITE_*` variables at build time. A new build is required for changes to take effect.

---

## ✅ Verification Checklist

After setting up and redeploying, verify:

- [ ] `VITE_SUPABASE_URL` is set
- [ ] `VITE_SUPABASE_ANON_KEY` is set
- [ ] `VITE_RAZORPAY_KEY_ID` is set (your test/live key)
- [ ] `RAZORPAY_KEY_ID` is set (same as VITE_RAZORPAY_KEY_ID)
- [ ] `RAZORPAY_KEY_SECRET` is set (your Razorpay secret key)
- [ ] All variables are set for **Production** environment
- [ ] Deployment has been **Redeployed** after setting variables

---

## 🐛 Troubleshooting

### Issue: "Razorpay credential missing" error on live site

**Possible Causes:**
1. ❌ Variable not set in Vercel
   - **Fix:** Add `VITE_RAZORPAY_KEY_ID` in Vercel dashboard
2. ❌ Variable name typo
   - **Fix:** Check spelling exactly matches `VITE_RAZORPAY_KEY_ID`
3. ❌ Not redeployed after setting variable
   - **Fix:** Redeploy the application (see Step 3 above)
4. ❌ Variable set in wrong environment
   - **Fix:** Ensure it's set for **Production** (and Preview if needed)
5. ❌ Browser cache showing old build
   - **Fix:** Hard refresh (Ctrl+Shift+R) or clear cache

### Issue: Payment works locally but fails on live

**Possible Causes:**
1. ❌ Serverless function variables not set
   - **Fix:** Add `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` (without `VITE_`)
2. ❌ Wrong Razorpay keys
   - **Fix:** Verify you're using test keys for test mode, live keys for production
3. ❌ Vercel function not deployed
   - **Fix:** Check that `api/razorpay/create-order.js` exists and is deployed

---

## 📋 Quick Copy-Paste List

Copy these exact variable names to Vercel:

### Frontend (VITE_ prefix)
```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_RAZORPAY_KEY_ID
VITE_PUBLIC_BASE_URL (optional)
```

### Backend (no prefix)
```
RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
```

---

## 🔐 Security Notes

- ✅ `VITE_RAZORPAY_KEY_ID` is safe to expose (it's public)
- ❌ `RAZORPAY_KEY_SECRET` must NEVER be in a `VITE_` variable
- ✅ Always use environment variables, never hardcode keys
- ✅ Use test keys for development, live keys for production

---

## 📚 Additional Resources

- [Vercel Environment Variables Docs](https://vercel.com/docs/projects/environment-variables)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Razorpay Dashboard](https://dashboard.razorpay.com/app/keys)

