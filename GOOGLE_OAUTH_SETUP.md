# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for the Catalix e-commerce platform using Supabase.

## Prerequisites

- A Supabase project (create one at https://supabase.com)
- A Google Cloud Console account (https://console.cloud.google.com)

## Step 1: Configure Google OAuth in Google Cloud Console

### 1.1 Create a New Project (if needed)
1. Go to https://console.cloud.google.com
2. Click on the project dropdown at the top
3. Click "New Project"
4. Enter project name: "Catalix Ecommerce"
5. Click "Create"

### 1.2 Enable Google+ API
1. Go to "APIs & Services" > "Library"
2. Search for "Google+ API"
3. Click on it and click "Enable"

### 1.3 Create OAuth 2.0 Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - User Type: External
   - App name: Catalix
   - User support email: your email
   - Developer contact: your email
   - Save and continue through the scopes and test users

4. Configure OAuth Client ID:
   - Application type: Web application
   - Name: Catalix Web Client
   - Authorized JavaScript origins:
     - `http://localhost:5173` (for local development)
     - `https://your-vercel-app.vercel.app` (for production)
   - Authorized redirect URIs:
     - `https://your-supabase-project.supabase.co/auth/v1/callback`
   - Click "Create"

5. Copy your **Client ID** and **Client Secret**

## Step 2: Configure Supabase

### 2.1 Add Google OAuth Provider
1. Go to your Supabase project dashboard
2. Navigate to "Authentication" > "Providers"
3. Find "Google" in the list
4. Toggle "Enable Google Provider" to ON
5. Paste your **Client ID** and **Client Secret** from Google Console
6. Save the changes

### 2.2 Get Supabase Credentials
1. In Supabase, go to "Settings" > "API"
2. Copy your:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **Anon/Public Key** (starts with `eyJ...`)

## Step 3: Configure Your Application

### 3.1 Create Environment Variables File
Create a `.env.local` file in the root of your project:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Razorpay Configuration (already set)
VITE_RAZORPAY_KEY_ID=rzp_test_ROysXhPNhStyyy
```

Replace:
- `your-project-id` with your actual Supabase project ID
- `your-anon-key-here` with your actual Supabase anon key

### 3.2 Restart Development Server
```bash
npm run dev
```

## Step 4: Test Google OAuth

### 4.1 Local Testing
1. Go to http://localhost:5173/login
2. Click "Continue with Google"
3. You'll be redirected to Google's login page
4. Sign in with your Google account
5. Grant permissions
6. You'll be redirected back to your app at `/auth/callback`
7. Your account will be created in Supabase automatically

### 4.2 Verify in Supabase
1. Go to Supabase Dashboard > "Authentication" > "Users"
2. You should see your user created with:
   - Email from Google
   - Name from Google
   - Avatar from Google profile picture

3. Go to "Table Editor" > "user_profiles"
4. You should see a profile record created automatically

## Step 5: Deploy to Vercel

### 5.1 Update Authorized Origins
1. Go back to Google Cloud Console > Credentials
2. Edit your OAuth Client ID
3. Add your Vercel domain to:
   - **Authorized JavaScript origins**: `https://your-app.vercel.app`
4. Save

### 5.2 Add Environment Variables to Vercel
1. Go to your Vercel project dashboard
2. Navigate to "Settings" > "Environment Variables"
3. Add:
   - `VITE_SUPABASE_URL` = your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
4. Redeploy your application

## Troubleshooting

### Error: "redirect_uri_mismatch"
- Make sure your redirect URI in Google Console exactly matches:
  `https://your-supabase-project.supabase.co/auth/v1/callback`
- No trailing slashes
- Use the correct protocol (https)

### Error: "Access blocked: This app's request is invalid"
- Complete the OAuth consent screen configuration
- Add your email to test users if using "External" user type
- Make sure Google+ API is enabled

### Error: "Invalid API key"
- Check that your Supabase URL and anon key are correct in `.env.local`
- Restart the development server after adding environment variables

### User created but profile not found
- Check database-schema.sql was executed properly
- Verify the `user_profiles` table exists
- Check Supabase logs for errors

## How It Works

### Registration Flow
1. User clicks "Continue with Google"
2. `authService.signInWithGoogle()` is called
3. Supabase redirects to Google OAuth consent screen
4. User grants permissions
5. Google redirects to Supabase callback URL
6. Supabase creates auth user and redirects to `/auth/callback`
7. `AuthCallback` component:
   - Fetches user session
   - Creates/updates user profile in `user_profiles` table
   - Updates AuthContext
   - Redirects to homepage

### Login Flow  
1. User clicks "Continue with Google"
2. Same OAuth flow as registration
3. Supabase checks if user exists
4. If exists: signs in
5. If new: creates account
6. Profile is fetched/created
7. User is logged in

### Logout Flow
1. User clicks logout
2. `authService.signOut()` is called
3. Supabase session is cleared
4. AuthContext is updated
5. User is redirected to homepage

## Database Schema

The Google OAuth flow uses these tables:

### `auth.users` (Supabase managed)
- Stores authentication data
- Email, encrypted password, OAuth tokens
- Managed automatically by Supabase

### `public.user_profiles` (Your custom table)
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  phone_verified BOOLEAN DEFAULT false,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Demo vs Production

### Current Implementation (Demo Mode)
- If Supabase is not configured, falls back to mock authentication
- Users are stored in localStorage only
- No persistence across devices

### Production Mode (With Supabase)
- Real Google OAuth authentication
- Users stored in database
- Session persistence across devices
- Automatic profile creation
- Avatar from Google profile picture

## Next Steps

1. ✅ Set up Supabase project
2. ✅ Configure Google OAuth
3. ✅ Add environment variables
4. ✅ Test local Google login
5. ⬜ Deploy to Vercel
6. ⬜ Update Google Console with production URL
7. ⬜ Test production Google login
8. ⬜ Set up email templates in Supabase
9. ⬜ Configure SMS provider for mobile OTP (optional)

## Support

For issues or questions:
- Supabase Docs: https://supabase.com/docs/guides/auth/social-login/auth-google
- Google OAuth Docs: https://developers.google.com/identity/protocols/oauth2

