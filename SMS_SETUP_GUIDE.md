# SMS Integration Setup Guide

Complete guide for integrating real SMS services for OTP and notifications.

## 🎯 Overview

The Catalix platform supports multiple SMS providers for sending OTPs and notifications:

1. **Fast2SMS** - Best for India, affordable, easy setup
2. **MSG91** - Best for India, enterprise-grade, template support
3. **Twilio** - Global reach, most reliable, higher cost

## 🚀 Quick Start

### Step 1: Choose Your Provider

**For India (Recommended):**
- **Fast2SMS** - Easiest to set up, ₹0.15/SMS
- **MSG91** - Better for high volume, ₹0.15-0.20/SMS

**For Global:**
- **Twilio** - Most reliable, $0.0075/SMS

### Step 2: Get API Credentials

Choose ONE provider and follow its setup guide below.

---

## 📱 Option 1: Fast2SMS (Recommended for India)

### Features
- ✅ Easy setup (5 minutes)
- ✅ Low cost (₹0.15 per SMS)
- ✅ No documentation approval needed
- ✅ Test credits available
- ✅ Instant activation

### Setup Steps

#### 1. Create Account
1. Go to https://www.fast2sms.com/
2. Click "Sign Up"
3. Enter:
   - Mobile Number
   - Email
   - Password
4. Verify phone with OTP
5. Verify email

#### 2. Get API Key
1. Login to Fast2SMS dashboard
2. Go to **"Dev API"** in left menu
3. Click **"API Keys & Security"**
4. Your API key will be displayed
5. Copy the API key (starts with your hash)

#### 3. Add Credits
1. Go to **"Wallet"** in left menu
2. Click **"Add Money"**
3. Minimum: ₹100 (gives ~660 SMS)
4. Pay via UPI/Card/Net Banking
5. Credits added instantly

#### 4. Configure in Your App

Add to `.env.local`:

```env
# SMS Configuration
VITE_SMS_PROVIDER=fast2sms
VITE_FAST2SMS_API_KEY=your-api-key-from-dashboard
VITE_FAST2SMS_SENDER_ID=CATALIX
VITE_FAST2SMS_ROUTE=otp
```

#### 5. Test

```bash
# Restart server
npm run dev

# Go to http://localhost:5173/register
# Enter phone number
# You should receive real SMS!
```

### Fast2SMS Pricing
- OTP SMS: ₹0.15 per SMS
- Transactional SMS: ₹0.20 per SMS
- Promotional SMS: ₹0.12 per SMS

### Fast2SMS API Details
```javascript
// Endpoint
POST https://www.fast2sms.com/dev/bulkV2

// Headers
authorization: your-api-key
Content-Type: application/json

// Body
{
  "route": "otp",
  "sender_id": "CATALIX",
  "message": "Your OTP is {#var#}",
  "variables_values": "123456",
  "numbers": "9876543210"
}
```

---

## 📱 Option 2: MSG91

### Features
- ✅ Enterprise-grade
- ✅ Template support
- ✅ High delivery rate
- ✅ Detailed analytics
- ✅ DLT registration support

### Setup Steps

#### 1. Create Account
1. Go to https://msg91.com/
2. Click "Sign Up"
3. Enter business details
4. Verify email and phone

#### 2. Get Auth Key
1. Login to MSG91 dashboard
2. Go to **"API"** → **"Auth Key"**
3. Copy your Auth Key

#### 3. Create SMS Template
1. Go to **"Campaigns"** → **"SMS"** → **"Templates"**
2. Click **"Create New Template"**
3. Template example:
   ```
   Your Catalix verification code is ##OTP##. Valid for 5 minutes. Do not share.
   ```
4. Submit for approval (takes 2-4 hours)
5. Copy Template ID once approved

#### 4. Add Credits
1. Go to **"Wallet"**
2. Add credits (minimum ₹100)
3. Credits valid for 1 year

#### 5. Configure in Your App

Add to `.env.local`:

```env
# SMS Configuration
VITE_SMS_PROVIDER=msg91
VITE_MSG91_AUTH_KEY=your-auth-key-here
VITE_MSG91_SENDER_ID=CATALIX
VITE_MSG91_TEMPLATE_ID=your-template-id
VITE_MSG91_ROUTE=4
```

#### 6. Test

```bash
npm run dev
# Test registration with real phone number
```

### MSG91 Pricing
- OTP SMS: ₹0.15 per SMS
- Transactional SMS: ₹0.20 per SMS
- International SMS: ₹2-4 per SMS

---

## 📱 Option 3: Twilio (Global)

### Features
- ✅ Global reach (200+ countries)
- ✅ Highest reliability
- ✅ Best documentation
- ✅ Real-time tracking
- ✅ No template approval needed

### Setup Steps

#### 1. Create Account
1. Go to https://www.twilio.com/
2. Click "Sign Up"
3. Verify email and phone
4. Complete account setup

#### 2. Get Credentials
1. Login to Twilio Console
2. From Dashboard, copy:
   - **Account SID**
   - **Auth Token**
3. Go to **Phone Numbers** → **Manage** → **Buy a number**
4. Buy a phone number (free trial gives you one)
5. Copy the phone number

#### 3. Configure in Your App

Add to `.env.local`:

```env
# SMS Configuration
VITE_SMS_PROVIDER=twilio
VITE_TWILIO_ACCOUNT_SID=your-account-sid
VITE_TWILIO_AUTH_TOKEN=your-auth-token
VITE_TWILIO_PHONE_NUMBER=+1234567890
```

#### 4. Test

```bash
npm run dev
# Test with any phone number (including Indian numbers)
```

### Twilio Pricing
- SMS to India: $0.0075 per SMS (₹0.62)
- SMS to US: $0.0075 per SMS
- SMS to other countries: $0.01-0.10 per SMS
- Phone number rental: $1/month

### Twilio Trial
- $15 free credit
- Can send to verified numbers only
- Add "Sent from your Twilio trial account" prefix

---

## ⚙️ Configuration

### Environment Variables

Add to `.env.local`:

```env
# ========================================
# SMS SERVICE CONFIGURATION
# ========================================

# Choose provider: fast2sms, msg91, or twilio
VITE_SMS_PROVIDER=fast2sms

# ---- Fast2SMS (India) ----
VITE_FAST2SMS_API_KEY=your-api-key
VITE_FAST2SMS_SENDER_ID=CATALIX
VITE_FAST2SMS_ROUTE=otp

# ---- MSG91 (India) ----
# VITE_MSG91_AUTH_KEY=your-auth-key
# VITE_MSG91_SENDER_ID=CATALIX
# VITE_MSG91_TEMPLATE_ID=your-template-id
# VITE_MSG91_ROUTE=4

# ---- Twilio (Global) ----
# VITE_TWILIO_ACCOUNT_SID=your-account-sid
# VITE_TWILIO_AUTH_TOKEN=your-auth-token
# VITE_TWILIO_PHONE_NUMBER=+1234567890
```

### Restart Server

After adding credentials:
```bash
# Stop server (Ctrl+C)
npm run dev
```

---

## 🧪 Testing

### Test OTP Sending

1. Go to http://localhost:5173/register
2. Fill registration form
3. Enter your real phone number
4. Click "Create Account"
5. Check your phone for OTP SMS
6. Enter OTP to complete registration

### Console Messages

**SMS Configured:**
```
📱 Sending OTP to +919876543210...
✅ SMS sent successfully via fast2sms
```

**SMS Not Configured:**
```
⚠️ SMS not configured. Using console fallback.
📱 OTP for +919876543210: 123456
```

---

## 📊 Comparison

| Feature | Fast2SMS | MSG91 | Twilio |
|---------|----------|-------|--------|
| **Best For** | India Startups | India Enterprise | Global |
| **Setup Time** | 5 min | 30 min | 15 min |
| **Price (India)** | ₹0.15/SMS | ₹0.15/SMS | ₹0.62/SMS |
| **Template Approval** | No | Yes | No |
| **Delivery Rate** | 95% | 98% | 99% |
| **Support** | Email | Email + Phone | Email + Phone |
| **Min. Balance** | ₹100 | ₹100 | $15 |

---

## 🔥 Recommended Setup

### For MVP/Testing
- **Fast2SMS**
- Quickest setup
- Test with ₹100 credit
- No template approval needed

### For Production (India)
- **MSG91**
- Higher delivery rate
- Better analytics
- DLT compliance ready

### For Global/Enterprise
- **Twilio**
- Best reliability
- Scales infinitely
- Best documentation

---

## 🚨 Troubleshooting

### SMS Not Sending

**Check 1: Environment Variables**
```bash
# Verify .env.local exists
ls -la .env.local

# Check it has correct format (no quotes around values)
```

**Check 2: API Credits**
- Login to provider dashboard
- Check wallet balance
- Add credits if needed

**Check 3: Phone Number Format**
```
✅ Correct: 9876543210 (10 digits)
✅ Correct: 09876543210 (11 digits)
✅ Correct: 919876543210 (12 digits)
✅ Correct: +919876543210 (with +)
❌ Wrong: 876543210 (9 digits)
```

**Check 4: Console Logs**
```bash
# Check browser console for errors
# Check terminal for SMS service logs
```

### Fast2SMS Errors

**"Invalid API Key"**
- Check API key is correct
- No extra spaces
- Copy directly from dashboard

**"Insufficient Balance"**
- Add credits in wallet
- Minimum ₹100

**"Invalid Numbers"**
- Check phone number is 10 digits
- Remove country code if present

### MSG91 Errors

**"Template not approved"**
- Wait for template approval (2-4 hours)
- Check template status in dashboard

**"Invalid Auth Key"**
- Regenerate auth key
- Update in .env.local

### Twilio Errors

**"Trial account"**
- Verify destination number in Twilio console
- Or upgrade to paid account

**"Invalid number format"**
- Ensure number has country code
- Format: +919876543210

---

## 🔐 Security

### Best Practices

1. **Never commit `.env.local`**
   ```bash
   # Already in .gitignore
   .env.local
   ```

2. **Use different keys for dev/prod**
   ```env
   # Development
   VITE_FAST2SMS_API_KEY=dev-key-here

   # Production (in Vercel)
   VITE_FAST2SMS_API_KEY=prod-key-here
   ```

3. **Rotate keys periodically**
   - Change API keys every 3-6 months
   - Immediately if compromised

4. **Monitor usage**
   - Check SMS logs daily
   - Set up alerts for unusual activity

---

## 📈 Production Deployment

### Vercel Setup

1. Go to Vercel Dashboard
2. Select your project
3. Settings → Environment Variables
4. Add:
   ```
   VITE_SMS_PROVIDER=fast2sms
   VITE_FAST2SMS_API_KEY=your-production-api-key
   ```
5. Redeploy

### Production Checklist

- [ ] SMS provider configured
- [ ] Credits added (at least ₹500)
- [ ] Template approved (if MSG91)
- [ ] DLT registration done (for India)
- [ ] Usage alerts set up
- [ ] Backup provider configured
- [ ] Logs monitored

---

## 💰 Cost Estimation

### Monthly Costs (India)

**Startup (100 users/month)**
- 100 OTPs × ₹0.15 = ₹15/month
- Negligible cost!

**Growing (1000 users/month)**
- 1000 OTPs × ₹0.15 = ₹150/month
- Still very affordable

**Scale (10,000 users/month)**
- 10,000 OTPs × ₹0.15 = ₹1,500/month
- Consider MSG91 for better rates

---

## 🆘 Support

### Fast2SMS
- Email: support@fast2sms.com
- Phone: +91 87508 87508
- Docs: https://docs.fast2sms.com/

### MSG91
- Email: hello@msg91.com
- Phone: +91 9650 600 645
- Docs: https://docs.msg91.com/

### Twilio
- Email: help@twilio.com
- Phone: +1 (415) 795-1634
- Docs: https://www.twilio.com/docs/

---

## ✅ Next Steps

1. Choose your SMS provider
2. Create account and get API key
3. Add to `.env.local`
4. Test registration flow
5. Add credits for production
6. Deploy to Vercel
7. Monitor usage

**Estimated setup time: 15-30 minutes** ⏱️

Your OTP system will be production-ready! 🎉

