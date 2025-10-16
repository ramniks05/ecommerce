# Environment Setup Guide

## Quick Setup (3 Options)

### Option 1: Interactive Setup (Easiest)

Run the setup script:

```bash
node setup-env.js
```

Follow the prompts to enter your Supabase credentials.

### Option 2: Copy Template

```bash
# Copy the template
cp env.local.template .env.local

# Edit with your favorite editor
code .env.local   # VS Code
notepad .env.local  # Windows Notepad
nano .env.local   # Linux/Mac
```

### Option 3: Create Manually

Create a file named `.env.local` in the project root with this content:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_RAZORPAY_KEY_ID=rzp_test_ROysXhPNhStyyy
```

## Getting Supabase Credentials

### Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Sign in or create account
3. Click "New Project"
4. Fill in:
   - **Name**: `catalix-ecommerce`
   - **Database Password**: Create strong password (save it!)
   - **Region**: Singapore (closest to India)
5. Click "Create new project"
6. Wait 2-3 minutes ⏱️

### Step 2: Get API Credentials

1. In Supabase dashboard, click **Settings** (⚙️) in left sidebar
2. Click **API** in the Settings menu
3. You'll see:

```
Project URL
https://abcdefghijklmn.supabase.co
```
**Copy this entire URL** ☝️

```
Project API keys
anon public
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...
```
**Copy this long key** ☝️

### Step 3: Run Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Open `database-schema.sql` from your project folder
4. Copy **ALL** the content (Ctrl+A, Ctrl+C)
5. Paste into Supabase SQL Editor
6. Click **Run** (or press Ctrl+Enter)
7. Wait for "Success. No rows returned" message ✅

### Step 4: Configure Google OAuth

You have Google OAuth Client ID:
```
176363690527-5u61mmur3v6jdht688mghdegtu6ouqjl.apps.googleusercontent.com
```

#### Get Client Secret:
1. Go to https://console.cloud.google.com/apis/credentials
2. Find your OAuth Client ID in the list
3. Click on it
4. You'll see **Client secret**: `GOCSPX-xxxxxxxxxxxxx`
5. **Copy the Client Secret**

#### Add to Supabase:
1. In Supabase, go to **Authentication** → **Providers**
2. Find **Google** in the list
3. Toggle **Enable Google Provider** to ON
4. Fill in:
   - **Client ID**: `176363690527-5u61mmur3v6jdht688mghdegtu6ouqjl.apps.googleusercontent.com`
   - **Client Secret**: Paste what you copied
5. **Copy the Callback URL** shown (looks like: `https://xxxxx.supabase.co/auth/v1/callback`)
6. Click **Save**

#### Update Google Console:
1. Go back to https://console.cloud.google.com/apis/credentials
2. Click on your OAuth Client ID
3. Under **Authorized redirect URIs**, add the Callback URL you copied
4. Make sure you also have `http://localhost:5173` for local testing
5. Click **Save**

## Update Your .env.local

Edit `.env.local` with your actual values:

```env
# Replace these with YOUR values from Supabase
VITE_SUPABASE_URL=https://abcdefghijklmn.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-actual-key...

# This is already correct
VITE_RAZORPAY_KEY_ID=rzp_test_ROysXhPNhStyyy
```

## Restart Server

After creating/updating `.env.local`:

```bash
# Stop the server
Press Ctrl+C

# Start again
npm run dev
```

## Verify Setup

### Check Console Messages

When you start the server, you should see:

**✅ If Configured Correctly:**
```
No special message - authentication will work with database
```

**⚠️ If Not Configured:**
```
🔧 Supabase Not Configured
App is running in DEMO MODE
📝 To enable database features:
...
```

### Test Features

1. **Go to** http://localhost:5173/login

2. **Test Email Login:**
   - Email: `demo@example.com`
   - Password: `demo123`
   - Should work in both modes

3. **Test Registration:**
   - Fill the form
   - Verify phone with OTP
   - If configured: Saves to database
   - If not: Saves to localStorage

4. **Test Google Login:**
   - Click "Continue with Google"
   - If configured: Real OAuth flow
   - If not: Shows error (needs Supabase)

### Check Supabase Dashboard

After registration or Google login:

1. Go to Supabase Dashboard
2. **Authentication** → **Users**
3. You should see your user account
4. **Table Editor** → **user_profiles**
5. You should see your profile record

## Troubleshooting

### .env.local not loading

**Problem:** Changes to `.env.local` not taking effect

**Solution:**
```bash
# Stop server with Ctrl+C
# Start fresh
npm run dev
```

### Invalid API key error

**Problem:** Console shows "Invalid API key"

**Solution:**
- Check `.env.local` file exists in project root
- Check file is named exactly `.env.local` (not `.env.local.txt`)
- Check credentials are correct
- No extra spaces or quotes around values
- Restart server

### Supabase connection timeout

**Problem:** Requests to Supabase hanging or timing out

**Solution:**
- Check your internet connection
- Verify Supabase project URL is correct
- Check Supabase project is not paused (free tier pauses after inactivity)

### Google OAuth redirect_uri_mismatch

**Problem:** Google shows "redirect_uri_mismatch" error

**Solution:**
- Callback URL in Google Console must EXACTLY match Supabase callback URL
- No trailing slashes
- Use https (not http) for Supabase URL
- Format: `https://your-project.supabase.co/auth/v1/callback`

### Database tables not found

**Problem:** "relation does not exist" errors

**Solution:**
- Make sure you ran `database-schema.sql` in Supabase
- Go to Supabase → SQL Editor
- Run the entire schema again
- Verify tables exist in Table Editor

## File Location

The `.env.local` file should be in the **project root**:

```
ecommerce/
├── src/
├── public/
├── package.json
├── .env.local          ← HERE!
├── env.local.template
└── ...
```

**NOT** in:
- `src/` folder
- `public/` folder
- Any subfolder

## Security Notes

✅ `.env.local` is in `.gitignore` - safe from git
❌ Never commit `.env.local` to GitHub
❌ Never share your Supabase keys publicly
✅ Use different keys for production and development

## Production Deployment

### Vercel

Don't use `.env.local` for production. Instead:

1. Go to Vercel Dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_RAZORPAY_KEY_ID`
5. Redeploy

### Other Platforms

Check platform-specific docs for environment variables:
- Netlify: Site Settings → Build & deploy → Environment
- Railway: Variables tab
- Render: Environment tab

## Quick Reference

| Variable | Where to Get | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Supabase → Settings → API | `https://xxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase → Settings → API | `eyJhbGc...` |
| `VITE_RAZORPAY_KEY_ID` | Already set | `rzp_test_...` |

## Need Help?

See these guides:
- `YOUR_GOOGLE_OAUTH_STEPS.txt` - Simple numbered steps
- `QUICK_GOOGLE_OAUTH_SETUP.md` - Detailed OAuth guide
- `SETUP_CHECKLIST.md` - Overall project status
- `AUTHENTICATION_GUIDE.md` - Auth system details

## Summary

1. ✅ Create `.env.local` file
2. ✅ Add Supabase credentials
3. ✅ Restart server
4. ✅ Test features
5. ✅ Enjoy your app!

**Estimated time: 15-20 minutes** ⏱️

