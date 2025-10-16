# MSG91 Widget - 5 Minute Setup!

**The EASIEST way to integrate MSG91 OTP!**

## 🎯 Why MSG91 Widget?

✅ **No Template Approval** - Works instantly!
✅ **5 Minute Setup** - Literally!
✅ **Auto OTP Handling** - Widget does everything
✅ **Pre-built UI** - No coding needed
✅ **Free Testing** - Test credits included
✅ **Production Ready** - Just add real credits

## 🚀 Super Quick Setup

### Step 1: Get Widget Credentials (2 minutes)

1. **Go to MSG91 OTP Widget**
   ```
   https://control.msg91.com/app/otp/
   ```

2. **Login** (or create account if new)

3. **Create Widget**
   - Click "Create New Widget"
   - Widget Name: `Catalix OTP`
   - Click "Save"

4. **Copy Credentials**
   You'll see two values:
   ```
   Widget ID: 356a70666249313434373039
   Token Auth: 473845Tizp4DE2esK68f08ae9P1
   ```
   
   **These are already in your code!** (if they match the ones in your widget, you're good to go!)

### Step 2: Configure (1 minute)

Edit `.env.local`:

```env
# MSG91 Widget Configuration
VITE_SMS_PROVIDER=msg91-widget
VITE_MSG91_WIDGET_ID=your-widget-id-here
VITE_MSG91_TOKEN_AUTH=your-token-auth-here

# Other configs...
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_RAZORPAY_KEY_ID=rzp_test_ROysXhPNhStyyy
```

### Step 3: Add Credits (2 minutes)

1. **Go to Wallet**
   ```
   https://control.msg91.com/wallet
   ```

2. **Add Money**
   - Click "Add Money"
   - Amount: ₹500 (gives ~3,300 SMS)
   - Pay via UPI/Card
   - Instant credit!

### Step 4: Test! (30 seconds)

```bash
# Restart server
npm run dev

# Go to: http://localhost:5173/register
# Enter your real phone number
# You'll get REAL SMS instantly! 📱
```

## 🎉 That's It!

No template approval needed!
No waiting!
Works immediately!

---

## 📱 How It Works

### What MSG91 Widget Does Automatically:

1. ✅ Sends OTP SMS
2. ✅ Handles OTP verification
3. ✅ Manages retry logic
4. ✅ Shows error messages
5. ✅ Tracks delivery status
6. ✅ Prevents spam/abuse

### Your Code Just Needs To:

```javascript
// Send OTP
const result = await msg91Widget.sendOTP(phoneNumber);
// Widget handles everything!
```

---

## 💰 Pricing

Same as MSG91 API:
- **₹0.15 per OTP SMS**
- ₹500 = ~3,300 SMS
- ₹1000 = ~6,600 SMS

---

## 🔧 Configuration Options

### Basic (What you need):

```env
VITE_SMS_PROVIDER=msg91-widget
VITE_MSG91_WIDGET_ID=your-widget-id
VITE_MSG91_TOKEN_AUTH=your-token-auth
```

### Advanced (Optional):

You can customize widget appearance in MSG91 dashboard:
- OTP length (4, 5, or 6 digits)
- OTP expiry time (1-10 minutes)
- Retry limit
- SMS template text
- Sender ID

---

## 🚨 Troubleshooting

### Problem: Widget Not Working

**Check 1: Credentials**
```env
# Make sure these are correct
VITE_SMS_PROVIDER=msg91-widget  # ← Must be exactly this
VITE_MSG91_WIDGET_ID=...        # ← From MSG91 dashboard
VITE_MSG91_TOKEN_AUTH=...       # ← From MSG91 dashboard
```

**Check 2: Restart Server**
```bash
# Stop server (Ctrl+C)
npm run dev
```

**Check 3: Console**
```
# Should see:
✅ MSG91 Widget script loaded
📱 Sending OTP via MSG91 Widget to: +919876543210
✅ MSG91 Widget success
```

**Check 4: Credits**
- Login to MSG91
- Check Wallet balance
- Add credits if needed

### Problem: SMS Not Received

**Check 1: Phone Number**
```
✅ Correct: 9876543210
❌ Wrong: 876543210 (missing digit)
```

**Check 2: MSG91 Reports**
1. Go to: https://control.msg91.com/reports/sms
2. Search your phone number
3. Check delivery status

**Check 3: DND**
- Some numbers have DND enabled
- Try different number
- Or register number for transactional SMS

---

## 📊 MSG91 Dashboard Features

### View OTP Analytics:
```
Dashboard → OTP → Analytics
```

See:
- Total OTPs sent
- Success rate
- Failed reasons
- Popular times
- Device breakdown

### View SMS Reports:
```
Dashboard → Reports → SMS
```

See:
- Delivery status
- Timestamp
- Cost per SMS
- Failed reasons

### Manage Widgets:
```
Dashboard → OTP → Widgets
```

Can:
- Edit widget settings
- View widget usage
- Clone widget
- Delete widget

---

## 🔐 Security Features

MSG91 Widget includes:

✅ **Rate Limiting** - Max 3 attempts per phone
✅ **IP Tracking** - Prevents abuse
✅ **OTP Expiry** - Default 5 minutes
✅ **One-time Use** - OTP can't be reused
✅ **Encryption** - All data encrypted
✅ **Fraud Detection** - Auto blocks suspicious activity

---

## 🌟 Comparison: Widget vs API

| Feature | MSG91 Widget | MSG91 API |
|---------|-------------|-----------|
| **Setup Time** | 5 min | 30 min |
| **Template Approval** | ❌ No | ✅ Yes (2-4 hours) |
| **Coding Required** | Minimal | More |
| **OTP Handling** | Automatic | Manual |
| **UI** | Pre-built | Custom |
| **Cost** | ₹0.15/SMS | ₹0.15/SMS |
| **Best For** | Quick start | Full control |

**Recommendation:** Start with Widget, switch to API later if needed!

---

## 🚀 Production Deployment

### Vercel Environment Variables:

```
VITE_SMS_PROVIDER=msg91-widget
VITE_MSG91_WIDGET_ID=your-widget-id
VITE_MSG91_TOKEN_AUTH=your-token-auth
```

Then redeploy!

---

## 📞 Support

**MSG91 Support:**
- Email: hello@msg91.com
- Phone: +91 9650 600 645
- Live Chat: In dashboard
- Hours: 10 AM - 7 PM IST (Mon-Sat)

---

## ✅ Quick Checklist

```
□ Login to MSG91
□ Go to OTP Widgets section
□ Create new widget (or use existing)
□ Copy Widget ID
□ Copy Token Auth
□ Add to .env.local
□ Change VITE_SMS_PROVIDER to msg91-widget
□ Add ₹500 credits to wallet
□ Restart server (npm run dev)
□ Test registration with real phone
□ Receive SMS!
□ Success! 🎉
```

---

## 🎯 Next Steps

1. ✅ Use provided credentials (already in env template)
2. ✅ Add credits to MSG91 wallet
3. ✅ Configure `.env.local`
4. ✅ Test with real phone number
5. ✅ Deploy to production!

---

**Total Time: 5 minutes + ₹500 = Production-ready OTP system!** 🚀

