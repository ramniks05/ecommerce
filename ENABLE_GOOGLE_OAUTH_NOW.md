# Enable Google OAuth - Step by Step

## 🎯 Your Information

**Your Google OAuth Client ID:**
```
176363690527-5u61mmur3v6jdht688mghdegtu6ouqjl.apps.googleusercontent.com
```

**Your Supabase Callback URL:**
```
https://mqvxithtgyewckeabbsq.supabase.co/auth/v1/callback
```

**Your Supabase Project:**
```
https://supabase.com/dashboard/project/mqvxithtgyewckeabbsq
```

---

## 📋 PART 1: Google Cloud Console (5 minutes)

### Step 1: Open Google Console

1. Click this link:
   ```
   https://console.cloud.google.com/apis/credentials
   ```

2. You'll see a list of credentials

3. Find this one:
   ```
   Web client 1
   or
   OAuth 2.0 Client ID
   Client ID: 176363690527-5u61mmur3v6jdht688mghdegtu6ouqjl
   ```

4. **Click on it** (click the name or the pencil icon)

### Step 2: Add Redirect URI

You'll now see a form with your OAuth client details.

1. **Scroll down to "Authorized redirect URIs"**

2. **Click "+ ADD URI" button**

3. **Type EXACTLY** (copy-paste to be safe):
   ```
   https://mqvxithtgyewckeabbsq.supabase.co/auth/v1/callback
   ```

4. **Press Enter** or click away

5. **Verify you also have** (should already be there):
   ```
   http://localhost:5173
   ```

6. **Scroll to bottom and click "SAVE"**

### Step 3: Copy Client Secret

Still on the same page:

1. **Look for "Client secret"** (near top of form)

2. **You'll see**:
   ```
   Client secret
   GOCSPX-xxxxxxxxxxxxxxxxxxxxx
   [Copy icon]
   ```

3. **Click the copy icon** to copy the secret

4. **Save it somewhere** (notepad, sticky note)
   - Format: `GOCSPX-` followed by random characters

5. **Keep this tab open** - you'll need it for Supabase

---

## 📋 PART 2: Supabase Dashboard (3 minutes)

### Step 4: Open Supabase Auth Providers

1. Click this link:
   ```
   https://supabase.com/dashboard/project/mqvxithtgyewckeabbsq/auth/providers
   ```

2. You'll see a list of auth providers (Email, Phone, Google, etc.)

### Step 5: Enable Google Provider

1. **Find "Google" in the list**

2. **You'll see a toggle switch** on the right side

3. **Click the toggle** to turn it ON (it will turn blue/green)

4. **A form will appear** with these fields:
   - Enabled: ✓ (checked)
   - Client ID (for OAuth)
   - Client Secret (for OAuth)
   - Authorized Client IDs
   - Skip nonce check

### Step 6: Add Google Credentials

1. **In the "Client ID" field**, paste:
   ```
   176363690527-5u61mmur3v6jdht688mghdegtu6ouqjl.apps.googleusercontent.com
   ```

2. **In the "Client Secret" field**, paste:
   ```
   GOCSPX-xxxxxxxxxxxxxxxxxxxxx
   ```
   (The secret you copied from Google Console in Step 3)

3. **Leave other fields empty** (not needed)

4. **Verify the Callback URL shown is**:
   ```
   https://mqvxithtgyewckeabbsq.supabase.co/auth/v1/callback
   ```

5. **Click "Save"** button at the bottom

---

## 📋 PART 3: Test (1 minute)

### Step 7: Test Google Login

1. **Go to your app**:
   ```
   http://localhost:5173/login
   ```

2. **Click "Continue with Google"** button

3. **You'll be redirected to Google sign-in page**

4. **Sign in with your Google account**

5. **Click "Allow" to grant permissions**

6. **You'll be redirected back to your app**

7. **You're now logged in!** ✅

### Step 8: Verify in Supabase

1. **Go to Supabase Users**:
   ```
   https://supabase.com/dashboard/project/mqvxithtgyewckeabbsq/auth/users
   ```

2. **You should see your user**:
   - Email from Google
   - Provider: Google
   - Last sign in: Just now

3. **Go to Table Editor → user_profiles**:
   ```
   https://supabase.com/dashboard/project/mqvxithtgyewckeabbsq/editor
   ```

4. **You should see your profile**:
   - Name from Google
   - Email from Google
   - Avatar URL from Google

---

## ✅ Summary Checklist

### Google Cloud Console
- [ ] Open: https://console.cloud.google.com/apis/credentials
- [ ] Click on OAuth Client: 176363690527-...
- [ ] Add redirect URI: https://mqvxithtgyewckeabbsq.supabase.co/auth/v1/callback
- [ ] Copy Client Secret: GOCSPX-...
- [ ] Save

### Supabase Dashboard
- [ ] Open: https://supabase.com/dashboard/project/mqvxithtgyewckeabbsq/auth/providers
- [ ] Find Google and toggle ON
- [ ] Paste Client ID: 176363690527-...
- [ ] Paste Client Secret: GOCSPX-...
- [ ] Save

### Test
- [ ] Go to /login
- [ ] Click "Continue with Google"
- [ ] Sign in
- [ ] Success! ✅

---

## 🚨 Troubleshooting

### Error: "redirect_uri_mismatch"

**Problem**: The redirect URI in Google Console doesn't match Supabase

**Fix**: Make sure you added EXACTLY:
```
https://mqvxithtgyewckeabbsq.supabase.co/auth/v1/callback
```
- No trailing slash
- Exact URL
- https (not http)

### Error: "Invalid client"

**Problem**: Client Secret is wrong or not added

**Fix**: 
- Copy Client Secret from Google Console
- Paste in Supabase Google provider settings
- Save in Supabase

### Error: "Provider not enabled"

**Problem**: Google provider not enabled in Supabase

**Fix**:
- Go to Supabase Auth Providers
- Toggle Google to ON
- Save

---

## 🎯 After Setup

Once configured, Google login will:

✅ Create user in Supabase auth.users
✅ Create profile in user_profiles table
✅ Include Google avatar
✅ Include name from Google
✅ Keep user logged in
✅ Work on localhost and production

---

**Total Time: 8 minutes**

Follow the steps above and Google login will work! 🚀

