# MSG91 Setup Guide - Complete Tutorial

**Your SMS Provider: MSG91**

Enterprise-grade SMS service for India with 98% delivery rate.

## 🎯 Why MSG91?

- ✅ **High Delivery Rate**: 98% (best in India)
- ✅ **DLT Compliant**: Ready for regulations
- ✅ **Template System**: Professional SMS templates
- ✅ **Analytics**: Detailed delivery reports
- ✅ **Reliable**: Used by major Indian companies
- ✅ **Affordable**: ₹0.15 per SMS
- ✅ **Support**: Email + Phone support

## 🚀 Complete Setup (30 Minutes)

### Step 1: Create MSG91 Account (5 minutes)

1. **Go to MSG91**
   ```
   https://msg91.com/
   ```

2. **Click "Sign Up"** (top right)

3. **Fill Registration Form:**
   - Company Name: `Catalix`
   - Your Name: `Your Full Name`
   - Email: `your-email@example.com`
   - Mobile Number: `Your 10-digit number`
   - Password: Create strong password

4. **Verify Email**
   - Check your inbox
   - Click verification link
   - Wait for confirmation

5. **Verify Phone**
   - You'll receive OTP
   - Enter OTP to verify

6. **Complete Profile**
   - Business Type: E-commerce
   - Website: Your website URL
   - GST Number: (optional for testing)

### Step 2: Get Auth Key (2 minutes)

1. **Login to Dashboard**
   ```
   https://control.msg91.com/
   ```

2. **Navigate to API Section**
   - Click on your profile (top right)
   - Select **"API"** from dropdown
   - Or go to: Settings → API

3. **Copy Auth Key**
   ```
   Your Auth Key will look like:
   123456AaBbCcDdEeFfGgHh7890
   ```
   - Click **"Show"** to reveal
   - Click **"Copy"** icon
   - Save it securely!

### Step 3: Create SMS Template (15 minutes)

MSG91 requires template approval for OTP SMS.

#### 3.1 Navigate to Templates

1. Go to **"Campaigns"** in left menu
2. Click **"SMS"**
3. Click **"Templates"**
4. Click **"Create New Template"** button

#### 3.2 Fill Template Details

**Template Type:** `OTP`

**Template Category:** `Transactional - OTP`

**Sender ID:** `CATALIX`
(6 characters, letters only, all caps)

**Template Name:** `Catalix OTP Verification`

**Template Content:**
```
Your Catalix verification code is ##OTP##. Valid for 5 minutes. Do not share this code with anyone.
```

**Variables:** 
- Variable name: `OTP`
- Sample value: `123456`

**Entity ID:** (Leave blank for now - needed for DLT)

**Template ID:** (Auto-generated after approval)

#### 3.3 Submit for Approval

1. Review all details
2. Click **"Submit for Approval"**
3. Wait for approval (usually 2-4 hours)
4. You'll get email notification

#### 3.4 Get Template ID

Once approved:
1. Go back to Templates
2. Find your template
3. Copy the **Template ID** (like: `template_id_12345`)

### Step 4: Add Credits (5 minutes)

1. **Go to Wallet**
   - Click **"Wallet"** in left menu
   - Current balance will be ₹0

2. **Add Money**
   - Click **"Add Money"** button
   - Minimum: ₹100
   - Recommended: ₹500 (3,300+ SMS)

3. **Choose Payment Method**
   - UPI (instant)
   - Net Banking
   - Credit/Debit Card
   - PayTM

4. **Complete Payment**
   - Enter amount: `500`
   - Click **"Proceed"**
   - Complete payment
   - Credits added instantly!

5. **Verify Balance**
   - Check wallet shows ₹500
   - SMS count: ~3,300 messages

### Step 5: Configure in Catalix (3 minutes)

#### 5.1 Create/Edit .env.local

In your project root, edit `.env.local`:

```env
# ========================================
# MSG91 SMS CONFIGURATION
# ========================================

# Provider
VITE_SMS_PROVIDER=msg91

# MSG91 Credentials
VITE_MSG91_AUTH_KEY=your-auth-key-from-step-2
VITE_MSG91_SENDER_ID=CATALIX
VITE_MSG91_TEMPLATE_ID=your-template-id-from-step-3
VITE_MSG91_ROUTE=4

# Supabase (if configured)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Razorpay (already configured)
VITE_RAZORPAY_KEY_ID=rzp_test_ROysXhPNhStyyy
```

#### 5.2 Replace Placeholders

Update these values:
- `your-auth-key-from-step-2` → Your actual Auth Key
- `your-template-id-from-step-3` → Your actual Template ID

**Example:**
```env
VITE_MSG91_AUTH_KEY=123456AaBbCcDdEeFfGgHh7890
VITE_MSG91_TEMPLATE_ID=template_id_12345
```

#### 5.3 Save File

- Save `.env.local`
- Make sure file is in project root (same level as `package.json`)

### Step 6: Restart & Test (2 minutes)

#### 6.1 Restart Development Server

```bash
# Stop current server
Press Ctrl+C in terminal

# Start fresh
npm run dev
```

#### 6.2 Check Console

You should see:
```
VITE v7.1.10  ready in 2212 ms
➜  Local:   http://127.0.0.1:5173/
```

No SMS warnings = MSG91 is configured! ✅

#### 6.3 Test Registration

1. **Open browser**: http://localhost:5173/register

2. **Fill form:**
   - First Name: `Test`
   - Last Name: `User`
   - Email: `test@example.com`
   - Mobile: `Your real 10-digit number`
   - Password: `Test@1234`

3. **Click "Create Account"**

4. **Check your phone** 📱
   - You should receive real SMS!
   - OTP will arrive in 5-10 seconds

5. **Check console:**
   ```
   📱 Sending OTP to +919876543210...
   📱 Sending OTP SMS via SMS Service...
   ✅ SMS sent successfully via msg91
   ```

6. **Enter OTP**
   - Type the 6-digit OTP from SMS
   - Account created successfully!

## 🎉 Success!

If you received SMS, congratulations! MSG91 is working perfectly.

---

## 📊 MSG91 Dashboard Features

### 1. SMS Analytics

**View Reports:**
- Go to **"Reports"** → **"SMS"**
- See delivery status
- Success/Failed rates
- Timestamps

**Filters:**
- Date range
- Sender ID
- Destination number
- Status

### 2. Delivery Status Codes

| Code | Meaning |
|------|---------|
| `1` | Success - Message delivered |
| `2` | Failed - Invalid number |
| `3` | Failed - DND (Do Not Disturb) |
| `4` | Pending - In queue |
| `5` | Failed - Operator error |

### 3. Balance Alerts

1. Go to **"Settings"** → **"Alerts"**
2. Set low balance alert: `₹100`
3. Add email for notifications
4. Save settings

---

## 🔧 Advanced Configuration

### Template Variables

Your template supports dynamic OTP:

**Template:**
```
Your Catalix verification code is ##OTP##. Valid for 5 minutes.
```

**Code automatically replaces:**
- `##OTP##` → Actual 6-digit OTP

### Multiple Templates

Create more templates for:

**Order Confirmation:**
```
Order ##ORDER_ID## confirmed! Amount: ₹##AMOUNT##. Track at catalix.com/orders
```

**Delivery Update:**
```
Your order ##ORDER_ID## is ##STATUS##. Expected delivery: ##DATE##. Track live!
```

**Welcome Message:**
```
Welcome to Catalix ##NAME##! Enjoy exclusive deals on branded products. Shop now!
```

### Sender ID Guidelines

- **Length**: 6 characters
- **Format**: Only letters (A-Z)
- **Case**: All uppercase
- **Examples**: 
  - ✅ `CATALIX`
  - ✅ `CTLXIN`
  - ❌ `Catalix` (not uppercase)
  - ❌ `CAT123` (has numbers)
  - ❌ `CATALIX7` (more than 6 chars)

---

## 💰 Pricing & Credits

### Current Rates

| SMS Type | Price | Delivery |
|----------|-------|----------|
| **OTP** | ₹0.15 | 98% |
| **Transactional** | ₹0.20 | 98% |
| **Promotional** | ₹0.12 | 95% |

### Credit Calculation

| Amount | SMS Count (OTP) |
|--------|----------------|
| ₹100 | ~660 SMS |
| ₹500 | ~3,300 SMS |
| ₹1,000 | ~6,600 SMS |
| ₹5,000 | ~33,000 SMS |

### Usage Estimation

**For Catalix E-commerce:**

**Month 1-3 (100 users):**
- Registration OTP: 100
- Login OTP: 50
- Order confirmations: 30
- Total: ~180 SMS/month
- Cost: ₹27/month

**Month 4-6 (500 users):**
- Registration OTP: 500
- Login OTP: 250
- Orders: 150
- Total: ~900 SMS/month
- Cost: ₹135/month

**Month 7-12 (2000 users):**
- Registration OTP: 2000
- Login OTP: 1000
- Orders: 600
- Total: ~3,600 SMS/month
- Cost: ₹540/month

**Very affordable for business growth!**

---

## 🚨 Troubleshooting

### Problem 1: Template Not Approved

**Symptoms:**
- SMS not sending
- Error: "Template not approved"

**Solution:**
1. Check template status in dashboard
2. Usually takes 2-4 hours
3. For urgent: Contact MSG91 support
4. Temporarily use Fast2SMS (no approval needed)

**Quick Fix:**
```env
# Temporary switch to Fast2SMS
VITE_SMS_PROVIDER=fast2sms
VITE_FAST2SMS_API_KEY=your-fast2sms-key
```

### Problem 2: "Invalid Auth Key"

**Symptoms:**
- SMS not sending
- Console error: "Invalid auth key"

**Solution:**
1. Go to MSG91 dashboard
2. Settings → API → Auth Key
3. Regenerate new key
4. Update `.env.local`
5. Restart server

### Problem 3: "Insufficient Balance"

**Symptoms:**
- SMS not sending
- Error: "Insufficient credits"

**Solution:**
1. Check wallet: https://control.msg91.com/wallet
2. Add credits (minimum ₹100)
3. Wait 2 minutes for update
4. Try sending again

### Problem 4: OTP Not Received

**Check 1: Phone Number**
```
✅ Correct: 9876543210 (10 digits)
❌ Wrong: 876543210 (9 digits)
```

**Check 2: Console Logs**
```bash
# Should see:
✅ SMS sent successfully via msg91
```

**Check 3: MSG91 Reports**
1. Go to Reports → SMS
2. Search your number
3. Check delivery status
4. If failed, check reason

**Check 4: DND Status**
- Some numbers have DND (Do Not Disturb)
- Try different number
- Or register number for OTP (contact operator)

### Problem 5: Slow Delivery

**Normal Delivery Time:**
- India: 5-10 seconds
- Peak hours: 30-60 seconds

**If longer:**
1. Check MSG91 system status
2. Check reports for delays
3. Contact support if persistent

---

## 🔐 Security Best Practices

### 1. Protect Auth Key

```bash
# ❌ Never do this:
git add .env.local
git commit -m "Added credentials"

# ✅ Always verify:
cat .gitignore | grep .env.local
# Should show: .env.local
```

### 2. Rotate Keys

- Change Auth Key every 6 months
- Immediately if suspected compromise
- Update in all environments

### 3. Monitor Usage

- Check reports daily
- Set up alerts for unusual activity
- Limit API access to your IP (in MSG91 settings)

### 4. Rate Limiting

Your app already implements:
- Max 3 OTP requests per phone per hour
- 5-minute OTP expiry
- OTP can only be used once

---

## 📱 Production Deployment

### Vercel Configuration

1. **Go to Vercel Dashboard**
   ```
   https://vercel.com/dashboard
   ```

2. **Select Your Project**

3. **Settings → Environment Variables**

4. **Add Variables:**
   ```
   VITE_SMS_PROVIDER = msg91
   VITE_MSG91_AUTH_KEY = your-auth-key
   VITE_MSG91_SENDER_ID = CATALIX
   VITE_MSG91_TEMPLATE_ID = your-template-id
   VITE_MSG91_ROUTE = 4
   ```

5. **Redeploy**
   - Go to Deployments tab
   - Click "Redeploy" on latest
   - Or push new commit

6. **Test Production**
   - Visit your live URL
   - Test registration
   - Verify SMS delivery

### Production Checklist

- [ ] MSG91 template approved
- [ ] Adequate credits (₹500+)
- [ ] Auth key configured in Vercel
- [ ] Sender ID verified
- [ ] Tested on production URL
- [ ] Monitoring set up
- [ ] Support contacts saved

---

## 📞 MSG91 Support

### Contact Methods

**Email Support:**
- Email: hello@msg91.com
- Response time: 2-4 hours
- Best for: Template issues, account problems

**Phone Support:**
- Phone: +91 9650 600 645
- Hours: 10 AM - 7 PM IST (Mon-Sat)
- Best for: Urgent issues, payment problems

**Live Chat:**
- Available in dashboard (bottom right)
- Response time: 5-10 minutes
- Hours: 10 AM - 7 PM IST

**Documentation:**
- Docs: https://docs.msg91.com/
- API Reference: https://docs.msg91.com/p/tf9GTextN/e/Oopnw4lP/MSG91-API
- FAQs: https://msg91.com/help

### Common Support Queries

**Query 1: Template Approval**
```
Subject: Template Approval Request - Urgent
Body:
Hi MSG91 Team,

I have submitted an OTP template for approval:
Template ID: [your-template-id]
Template Name: Catalix OTP Verification
Sender ID: CATALIX

Could you please expedite the approval? I need to go live by [date].

Thanks,
[Your Name]
[Your Account Email]
```

**Query 2: DLT Registration**
```
Subject: DLT Registration Assistance
Body:
Hi,

I need assistance with DLT registration for:
Sender ID: CATALIX
Entity Type: E-commerce
Templates: OTP, Transactional

Please guide me through the process.

Thanks,
[Your Name]
```

---

## 🎯 Next Steps

### Immediate (Today)

- [x] Create MSG91 account
- [x] Get Auth Key
- [ ] Create OTP template
- [ ] Wait for approval (2-4 hours)
- [ ] Add ₹500 credits
- [ ] Configure `.env.local`
- [ ] Test registration

### Short Term (This Week)

- [ ] Create additional templates (orders, delivery)
- [ ] Set up balance alerts
- [ ] Monitor delivery reports
- [ ] Test with multiple numbers
- [ ] Deploy to Vercel

### Long Term (This Month)

- [ ] Complete DLT registration
- [ ] Set up webhooks for delivery status
- [ ] Implement SMS analytics
- [ ] A/B test different templates
- [ ] Scale to production volume

---

## ✅ Checklist

Use this checklist to track your setup:

```
□ MSG91 account created
□ Email verified
□ Phone verified
□ Auth Key copied
□ OTP template created
□ Template submitted for approval
□ Template approved (wait 2-4 hours)
□ Template ID copied
□ ₹500 credits added
□ Balance confirmed
□ .env.local file created
□ Auth Key added to .env.local
□ Template ID added to .env.local
□ Server restarted
□ Registration tested
□ SMS received on phone
□ OTP entered successfully
□ Account created
```

## 🎊 You're All Set!

Your Catalix platform now has:
- ✅ Professional SMS service (MSG91)
- ✅ High delivery rate (98%)
- ✅ Real OTP delivery
- ✅ Order notifications ready
- ✅ Production-ready setup

**Cost:** ~₹0.15 per customer registration
**Reliability:** Enterprise-grade
**Scale:** Unlimited

---

**Need help? Check the troubleshooting section or contact MSG91 support!**

