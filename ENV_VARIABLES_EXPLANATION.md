# Environment Variables Code Explanation

This document explains how environment variables are used in the codebase and why they're structured this way.

## 🔍 How Environment Variables Work

### Frontend Variables (VITE_ prefix)

**Location:** Used in client-side code (`src/utils/razorpay.js`, etc.)

**How they work:**
- Vite replaces `import.meta.env.VITE_*` variables at **build time**
- They become part of the JavaScript bundle
- **Visible to users** in the browser (can inspect source code)

**Example in code:**
```javascript
// src/utils/razorpay.js
const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
```

**Required Variables:**
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous/public key
- `VITE_RAZORPAY_KEY_ID` - Razorpay public key (safe to expose)

**For Vercel:**
1. Set in Vercel dashboard → Settings → Environment Variables
2. **Must redeploy** after adding/changing (build-time replacement)
3. Must include `VITE_` prefix

---

### Backend/Serverless Variables (NO prefix)

**Location:** Used in serverless functions (`api/razorpay/create-order.js`)

**How they work:**
- Available as `process.env.*` at **runtime**
- Never exposed to client
- Can contain **secrets** (like API keys)

**Example in code:**
```javascript
// api/razorpay/create-order.js
const keyId = process.env.RAZORPAY_KEY_ID; // No VITE_ prefix!
const keySecret = process.env.RAZORPAY_KEY_SECRET; // Secret!
```

**Required Variables:**
- `RAZORPAY_KEY_ID` - Razorpay public key (same as frontend)
- `RAZORPAY_KEY_SECRET` - Razorpay secret key (**NEVER expose this**)

**For Vercel:**
1. Set in Vercel dashboard → Settings → Environment Variables
2. **NO `VITE_` prefix** (server-side only)
3. Available immediately to serverless functions (no redeploy needed for runtime-only changes)

---

## 🔑 Razorpay Variable Structure

### Why Two Separate Variables?

Razorpay requires:
1. **Key ID** (public) - Used in frontend to initialize payment widget
2. **Key Secret** (private) - Used in backend to create orders securely

### Frontend (`VITE_RAZORPAY_KEY_ID`)
```javascript
// Used in src/utils/razorpay.js
const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
// This initializes the Razorpay checkout widget
const paymentObject = new window.Razorpay({
  key: keyId, // Public key visible to users
  // ...
});
```

**Value:** `rzp_test_ROysXhPNhStyyy` (or your key)

### Backend (`RAZORPAY_KEY_ID` + `RAZORPAY_KEY_SECRET`)
```javascript
// Used in api/razorpay/create-order.js
const keyId = process.env.RAZORPAY_KEY_ID; // Same as frontend
const keySecret = process.env.RAZORPAY_KEY_SECRET; // SECRET!

// Used to authenticate with Razorpay API
const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');
```

**Why separate?**
- Frontend can't have secrets (users can see code)
- Backend needs secret to create orders securely
- Same Key ID used in both places (public key)

---

## ⚠️ Common Mistakes

### ❌ Wrong: Putting Secret in Frontend
```javascript
// DON'T DO THIS!
const secret = import.meta.env.VITE_RAZORPAY_KEY_SECRET; // ❌ NEVER!
```
**Why:** Users can see this in browser DevTools!

### ❌ Wrong: Using VITE_ prefix in Backend
```javascript
// api/razorpay/create-order.js
const keyId = process.env.VITE_RAZORPAY_KEY_ID; // ❌ Wrong!
```
**Why:** Serverless functions don't get `VITE_` variables from Vercel

### ✅ Correct: Separate Frontend and Backend
```javascript
// Frontend: src/utils/razorpay.js
const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID; // ✅ Public key

// Backend: api/razorpay/create-order.js
const keyId = process.env.RAZORPAY_KEY_ID; // ✅ Public key (no VITE_)
const keySecret = process.env.RAZORPAY_KEY_SECRET; // ✅ Secret (no VITE_)
```

---

## 📋 Complete Variable List

### For Local Development (.env.local)
```bash
# Frontend (VITE_ prefix)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_RAZORPAY_KEY_ID=rzp_test_ROysXhPNhStyyy

# Backend (no prefix) - Not needed locally if using mock mode
# RAZORPAY_KEY_ID=rzp_test_ROysXhPNhStyyy
# RAZORPAY_KEY_SECRET=your_secret
```

### For Vercel Production

**Frontend Variables (VITE_ prefix):**
1. `VITE_SUPABASE_URL`
2. `VITE_SUPABASE_ANON_KEY`
3. `VITE_RAZORPAY_KEY_ID`

**Backend Variables (no prefix):**
1. `RAZORPAY_KEY_ID` (same value as `VITE_RAZORPAY_KEY_ID`)
2. `RAZORPAY_KEY_SECRET` (your Razorpay secret key)

---

## 🔍 How to Verify

### Check Frontend Variable
1. Open live site in browser
2. Open DevTools → Console
3. Type: `import.meta.env.VITE_RAZORPAY_KEY_ID`
4. Should show your key (or `undefined` wiped out in prod builds)

### Check Backend Variable
1. Try to make a payment
2. Check Vercel Function Logs
3. Look for error messages about missing credentials
4. Check Network tab → Serverless function response

---

## 🐛 Debugging

### Issue: "Razorpay credential missing" on live site

**Step 1:** Check if variable is set
- Go to Vercel → Settings → Environment Variables
- Look for `VITE_RAZORPAY_KEY_ID`

**Step 2:** Check if redeployed
- Environment variables are embedded at **build time**
- Must redeploy after adding/changing `VITE_*` variables

**Step 3:** Check browser console
- Should see detailed error messages added in latest code

**Step 4:** Verify variable name
- Must be exactly: `VITE_RAZORPAY_KEY_ID` (case-sensitive)
- Must have `VITE_` prefix for frontend

---

## 📚 References

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Razorpay Documentation](https://razorpay.com/docs/)

