# Quick Google OAuth Setup - Catalix

You have your Google OAuth Client ID! Here's how to complete the setup.

## Your Credentials

**Google OAuth Client ID:**
```
176363690527-5u61mmur3v6jdht688mghdegtu6ouqjl.apps.googleusercontent.com
```

## Step-by-Step Setup

### Step 1: Get Google Client Secret

1. Go to https://console.cloud.google.com/apis/credentials
2. Find your OAuth 2.0 Client ID: `176363690527-5u61mmur3v6jdht688mghdegtu6ouqjl`
3. Click on it to view details
4. Copy the **Client Secret** (it will look like: `GOCSPX-xxxxxxxxxxxxx`)

### Step 2: Set up Supabase Project

#### 2.1 Create Supabase Project
1. Go to https://supabase.com
2. Click "New Project"
3. Fill in:
   - **Name**: catalix-ecommerce
   - **Database Password**: (create a strong password, save it!)
   - **Region**: Choose closest to India (e.g., Singapore)
4. Click "Create new project"
5. Wait 2-3 minutes for setup to complete

#### 2.2 Get Supabase Credentials
1. In Supabase dashboard, go to **Settings** (⚙️) → **API**
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: Starts with `eyJ...`

#### 2.3 Run Database Schema
1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Open the file `database-schema.sql` from your project
4. Copy ALL the content
5. Paste into Supabase SQL Editor
6. Click **Run** (or press Ctrl+Enter)
7. Wait for "Success" message

#### 2.4 Configure Google OAuth in Supabase
1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Scroll down to **Google**
3. Toggle **Enable Google Provider** to ON
4. Fill in:
   - **Client ID**: `176363690527-5u61mmur3v6jdht688mghdegtu6ouqjl.apps.googleusercontent.com`
   - **Client Secret**: (paste the secret you copied in Step 1)
5. Copy the **Callback URL** shown (it will be like: `https://xxxxx.supabase.co/auth/v1/callback`)
6. Click **Save**

### Step 3: Update Google Console

1. Go back to https://console.cloud.google.com/apis/credentials
2. Click on your OAuth Client ID
3. Under **Authorized redirect URIs**, add:
   ```
   https://xxxxx.supabase.co/auth/v1/callback
   ```
   (Replace `xxxxx` with your actual Supabase project ID)
4. Under **Authorized JavaScript origins**, make sure you have:
   ```
   http://localhost:5173
   https://your-vercel-app.vercel.app
   ```
5. Click **Save**

### Step 4: Configure Your Application

#### 4.1 Create `.env.local` file
In the root of your project (same level as `package.json`), create a file named `.env.local`:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Razorpay (Already configured)
VITE_RAZORPAY_KEY_ID=rzp_test_ROysXhPNhStyyy
```

**Replace**:
- `your-project-id` with your actual Supabase project ID
- `your-anon-key-here` with the anon key you copied from Supabase

#### 4.2 Restart Development Server
```bash
# Stop the current server (Ctrl+C)
npm run dev
```

### Step 5: Test Google Login

1. Open http://localhost:5173/login
2. Click **"Continue with Google"**
3. You'll be redirected to Google login
4. Sign in with your Google account
5. Grant permissions
6. You'll be redirected back to the app
7. Your profile will be created automatically!

### Step 6: Verify Everything Works

#### Check User in Supabase:
1. Go to Supabase Dashboard → **Authentication** → **Users**
2. You should see your user with:
   - Email from Google
   - Provider: Google
   - Last sign in time

#### Check Profile in Database:
1. Go to Supabase Dashboard → **Table Editor** → **user_profiles**
2. You should see a profile record with:
   - Your email
   - Name from Google
   - Avatar URL from Google
   - Timestamps

#### Check in App:
1. After login, click on your profile icon in header
2. Go to Profile page
3. You should see your Google profile data

## Testing Other Login Methods

### Email/Password Login
Now that Supabase is configured, you can:
1. Go to `/register`
2. Register with email, password, and phone
3. Verify phone with OTP
4. User will be saved to Supabase database
5. Login with email/password will authenticate from database

### Mobile OTP Login
1. Go to `/login`
2. Click "Mobile" tab
3. Enter phone number
4. For now, OTP will show in console
5. Enter OTP to login

## Troubleshooting

### Error: "Invalid API key"
- Check that `.env.local` file exists
- Check that VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are correct
- Restart development server

### Error: "redirect_uri_mismatch"
- Make sure the callback URL in Google Console exactly matches Supabase callback URL
- No trailing slashes
- Use https for Supabase URL

### Google login redirects but no user created
- Check Supabase logs: Dashboard → Logs → Auth
- Verify database-schema.sql was executed successfully
- Check that user_profiles table exists

### Registration works but doesn't save to database
- Check Supabase URL and anon key in `.env.local`
- Check browser console for errors
- Verify tables exist in Supabase

## Console Output Examples

### Successful Google Login:
```
Starting Google OAuth login...
Google OAuth initiated successfully
(Redirects to Google)
(After redirect back)
Auth state changed: SIGNED_IN {user object}
Completing authentication...
Successfully signed in!
```

### Successful Registration:
```
Phone verified, creating account in database...
User saved to database: {id: "uuid", email: "..."}
Account created and saved to database!
```

### Email Login:
```
Attempting email login with Supabase...
Supabase login successful: {user object}
Login successful!
```

## What Happens Next

Once configured:
- ✅ Google login creates real user accounts in database
- ✅ Registration saves users to database
- ✅ Email login authenticates from database
- ✅ Sessions persist across browser restarts
- ✅ User profiles include Google avatar
- ✅ All data is secure with Supabase RLS policies

## Deploy to Production (Vercel)

### 1. Add Environment Variables in Vercel
1. Go to Vercel project dashboard
2. Settings → Environment Variables
3. Add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_RAZORPAY_KEY_ID`

### 2. Update Google Console
1. Add your Vercel URL to Authorized JavaScript origins:
   ```
   https://your-app.vercel.app
   ```

### 3. Deploy
```bash
git add .
git commit -m "Add Google OAuth and database integration"
git push
```

Vercel will automatically deploy!

## Summary

You now have:
- ✅ Google OAuth Client ID: `176363690527-...`
- ⏳ Need to: Get Client Secret
- ⏳ Need to: Set up Supabase project
- ⏳ Need to: Create `.env.local` file
- ⏳ Need to: Test Google login

Follow the steps above and your Google OAuth will be fully functional! 🎉

