# Catalix Authentication System Guide

Complete guide for the authentication system with **Email/Password**, **Mobile OTP**, and **Google OAuth** login.

## 🎯 Overview

The Catalix platform now supports **THREE** authentication methods:

1. **📧 Email/Password Login** - Traditional login with credentials
2. **📱 Mobile OTP Login** - Passwordless login using phone number and OTP
3. **🔗 Google OAuth Login** - One-click login with Google account

## 🚀 Current Status

### ✅ Implemented Features

- **Registration with Phone Verification**
  - Email, name, password, phone number collection
  - OTP verification before account creation
  - Saves to Supabase database (if configured)
  - Falls back to localStorage for demo mode

- **Email/Password Login**
  - Uses Supabase Auth (if configured)
  - Falls back to mock users for demo mode
  - Session persistence

- **Mobile OTP Login**
  - Send OTP to phone number
  - 6-digit OTP verification
  - 5-minute expiry timer
  - Resend OTP functionality
  - Currently logs OTP to console (demo mode)

- **Google OAuth Login**
  - Real Supabase Google OAuth integration
  - Automatic profile creation
  - Avatar from Google profile picture
  - Redirects to `/auth/callback` after success

### 🔄 Demo Mode Features

When Supabase is NOT configured:
- ✅ Registration works (stores in localStorage)
- ✅ Email login works with demo credentials
- ✅ Mobile login works (any OTP accepted)
- ✅ Google login shows error (needs Supabase)
- ✅ All UI/UX is fully functional

## 📋 Setup Instructions

### Option 1: Demo Mode (No Setup Required)

The application works immediately without any configuration!

**Test Credentials:**
- **Email**: `demo@example.com` / `demo123`
- **Mobile**: Any 10-digit number + any 6-digit OTP
- **Google**: Requires Supabase setup

### Option 2: Production Mode (Full Database Integration)

#### Step 1: Set up Supabase

1. Create a Supabase project at https://supabase.com
2. Run the `database-schema.sql` script in Supabase SQL Editor
3. Configure Google OAuth (see `GOOGLE_OAUTH_SETUP.md`)

#### Step 2: Add Environment Variables

Create `.env.local`:

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Razorpay (already configured)
VITE_RAZORPAY_KEY_ID=rzp_test_ROysXhPNhStyyy
```

#### Step 3: Restart Server

```bash
npm run dev
```

#### Step 4: Test All Login Methods

1. **Registration**: `/register`
   - Fill form → Verify phone → Account created in database
   
2. **Email Login**: `/login`
   - Use registered email/password → Loads from database
   
3. **Mobile Login**: `/login`
   - Click "Mobile" tab → Enter phone → Enter OTP → Login
   
4. **Google Login**: `/login`
   - Click "Continue with Google" → OAuth flow → Auto-create profile

## 📱 How Each Login Method Works

### 1. Email/Password Login

#### User Flow:
1. Go to `/login`
2. Click "Email" tab
3. Enter email and password
4. Click "Sign In"
5. Redirected to homepage

#### Technical Flow:
```javascript
// Try Supabase first
authService.signIn(email, password)
  ↓
// If fails, fallback to mock
AuthContext.login(email, password)
  ↓
// Check against mock users
users.find(u => u.email === email && u.password === password)
  ↓
// Set user in context + localStorage
setUser(userWithoutPassword)
```

### 2. Mobile OTP Login

#### User Flow:
1. Go to `/login`
2. Click "Mobile" tab
3. Enter 10-digit mobile number
4. Click "Send OTP"
5. Check console for OTP (in demo mode)
6. Enter 6-digit OTP
7. Automatically verifies when 6 digits entered
8. Redirected to homepage

#### Technical Flow:
```javascript
// Send OTP
otpFlow.sendPhoneOTP(phone)
  ↓
// Generate OTP (123456)
generateOTP()
  ↓
// In production: Send via SMS service
// In demo: console.log(otp)
  ↓
// User enters OTP
otpFlow.verifyPhoneOTP(phone, otp)
  ↓
// In demo: Accept any 6-digit code
// In production: Check against database
  ↓
// Create/find user
AuthContext.login(phone@mobile.catalix.com)
```

### 3. Google OAuth Login

#### User Flow:
1. Go to `/login`
2. Click "Continue with Google"
3. Redirected to Google login page
4. Sign in with Google account
5. Grant permissions
6. Redirected to `/auth/callback`
7. Profile created automatically
8. Redirected to homepage

#### Technical Flow:
```javascript
// Initiate OAuth
authService.signInWithGoogle()
  ↓
// Supabase redirects to Google
supabase.auth.signInWithOAuth({ provider: 'google' })
  ↓
// Google handles authentication
// Redirects to: https://xxxxx.supabase.co/auth/v1/callback
  ↓
// Supabase creates auth.users record
// Redirects to: http://localhost:5173/auth/callback
  ↓
// AuthCallback component
- Gets session from Supabase
- Fetches/creates user_profiles record
- Updates AuthContext
- Redirects to homepage
```

## 🔐 Registration Flow

### User Flow:
1. Go to `/register`
2. Fill form:
   - First Name
   - Last Name
   - Email
   - Mobile Number (10 digits)
   - Password
   - Confirm Password
3. Click "Create Account"
4. **Phone Verification Screen**
5. Check console for OTP
6. Enter 6-digit OTP
7. Account created!
8. Success screen with options

### Technical Flow:

#### Step 1: Form Submission
```javascript
handleSubmit()
  ↓
// Validate form
validateForm()
  ↓
// Check if phone is valid
phoneValidation.isValidIndianPhone(phone)
  ↓
// Format phone number
phoneValidation.formatIndianPhone(phone) // +917903152429
  ↓
// Send OTP
otpFlow.sendPhoneOTP(phone)
  ↓
// Move to step 2 (OTP verification)
setStep(2)
```

#### Step 2: OTP Verification
```javascript
PhoneVerification component renders
  ↓
// User enters OTP
handleOtpChange(index, value)
  ↓
// Auto-verify when 6 digits entered
handleVerifyOTP(otpCode)
  ↓
// Verify OTP
otpFlow.verifyPhoneOTP(phone, otp)
  ↓
// Call parent callback
onVerified(phone)
```

#### Step 3: Account Creation
```javascript
handlePhoneVerified(phone)
  ↓
// Try to save to Supabase
authService.signUp(email, password, userData)
  ↓
// If successful:
  - User saved to auth.users
  - Profile saved to user_profiles
  - Update AuthContext
  - Show success (step 3)
  
// If fails (no Supabase):
  - Fallback to mock registration
  - Save to localStorage
  - Update AuthContext
  - Show success (step 3)
```

## 🗄️ Database Schema

### `auth.users` (Supabase Managed)
- `id` - UUID primary key
- `email` - User email
- `encrypted_password` - Hashed password
- `created_at` - Registration timestamp
- OAuth tokens and metadata

### `public.user_profiles` (Custom Table)
```sql
- id (UUID, primary key)
- user_id (UUID, references auth.users)
- email (VARCHAR)
- first_name (VARCHAR)
- last_name (VARCHAR)
- phone (VARCHAR)
- phone_verified (BOOLEAN)
- avatar_url (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## 🎨 UI Components

### `LoginOptions.jsx`
- Tabbed interface (Email / Mobile)
- Email login form
- Mobile OTP input
- Google OAuth button
- Error/success messages
- Loading states

### `PhoneVerification.jsx`
- 6-digit OTP input boxes
- Auto-focus next input
- Auto-verify when complete
- Timer countdown (5 minutes)
- Resend OTP button
- Change phone number option

### `AuthCallback.jsx`
- Loading spinner
- Handles OAuth redirect
- Creates user profile
- Updates auth context
- Redirects to homepage

## 📊 Console Output Examples

### Registration with OTP:
```
Phone validation debug: {original: "7903152429", cleaned: "7903152429", length: 10}
Phone validation result: true
Starting OTP send process for: 7903152429
Formatted phone: +917903152429
Creating OTP...
OTP created: 384625
Sending SMS...
SMS result: {success: true, messageId: "mock-1739624512345"}
OTP sent successfully

Verifying OTP: {phone: "+917903152429", otpToVerify: "384625"}
OTP verification result: {success: true, message: "Phone number verified successfully"}
OTP verified, calling onVerified...

Phone verified, creating account in database...
Database not configured, using mock registration...
Account created successfully (mock): {id: "demo-user-1739624512345", email: "test@example.com", ...}
```

### Email Login:
```
Attempting email login with Supabase...
Supabase login failed, trying mock login... Error: Invalid API key
Login successful with mock user
```

### Google OAuth:
```
Starting Google OAuth login...
Google OAuth initiated successfully
(Redirects to Google)
(After redirect back)
Auth state changed: SIGNED_IN {session object}
User saved to database: {id: "...", email: "user@gmail.com", ...}
```

## 🧪 Testing Guide

### Test Registration
1. Go to `/register`
2. Use these values:
   - First Name: `John`
   - Last Name: `Doe`
   - Email: `john.doe@example.com`
   - Mobile: `7903152429`
   - Password: `Test@1234`
3. Check console for OTP
4. Enter OTP (or any 6 digits in demo mode)
5. Verify success message

### Test Email Login
1. Go to `/login`
2. Use demo credentials: `demo@example.com` / `demo123`
3. Or use email from registration
4. Verify redirect to homepage

### Test Mobile Login
1. Go to `/login`
2. Click "Mobile" tab
3. Enter: `9876543210`
4. Click "Send OTP"
5. Check console for OTP
6. Enter any 6 digits
7. Verify redirect to homepage

### Test Google Login
1. **Requires Supabase setup** (see `GOOGLE_OAUTH_SETUP.md`)
2. Go to `/login`
3. Click "Continue with Google"
4. Sign in with Google
5. Verify profile created in Supabase
6. Verify redirect to homepage

## 🔧 Configuration Files

### Environment Variables
- `.env.local` - Local development
- Vercel Environment Variables - Production

### Auth Service
- `src/services/authService.js` - Supabase Auth wrapper
- `src/services/otpService.js` - OTP generation and verification
- `src/services/supabaseService.js` - Database operations

### Context
- `src/context/AuthContext.jsx` - Auth state management
- Provides: `user`, `login`, `register`, `logout`, `updateProfile`, `setUser`

### Pages
- `src/pages/Register.jsx` - Registration with phone verification
- `src/pages/Login.jsx` - Login with multiple options
- `src/pages/AuthCallback.jsx` - OAuth redirect handler

### Components
- `src/components/LoginOptions.jsx` - Multi-method login UI
- `src/components/PhoneVerification.jsx` - OTP input UI

## 🚀 Deployment

### Vercel
1. Push code to GitHub
2. Connect Vercel to repository
3. Add environment variables in Vercel dashboard
4. Deploy
5. Update Google Console with production URL
6. Test all auth methods

### Environment Variables for Vercel
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_RAZORPAY_KEY_ID=rzp_test_ROysXhPNhStyyy
```

## 📚 Related Documentation

- `GOOGLE_OAUTH_SETUP.md` - Step-by-step Google OAuth configuration
- `COMPLETE_BACKEND_SETUP.md` - Full Supabase setup guide
- `database-schema.sql` - Database schema for all tables
- `README.md` - Project overview and quick start

## 💡 Tips

1. **Always check console** for OTP in demo mode
2. **Any 6-digit OTP works** in demo mode
3. **Email login** works without Supabase (mock users)
4. **Google login** requires Supabase setup
5. **Phone formatting** handles various formats (10, 11, 12 digits)
6. **Session persistence** via localStorage + Supabase
7. **Logout** clears both localStorage and Supabase session

## ✅ Checklist

### For Demo (Immediate Use)
- ✅ No setup required
- ✅ Test email login with demo@example.com
- ✅ Test mobile login with any number
- ✅ Test registration flow
- ✅ Check console for OTP codes

### For Production (Database Integration)
- ⬜ Create Supabase project
- ⬜ Run database-schema.sql
- ⬜ Configure Google OAuth
- ⬜ Add .env.local file
- ⬜ Test all login methods
- ⬜ Deploy to Vercel
- ⬜ Update Google Console with production URL
- ⬜ Test production deployment

## 🆘 Support

For issues:
1. Check console for errors
2. Verify environment variables
3. Check Supabase logs
4. Review authentication guide
5. Test in incognito mode (clear sessions)

