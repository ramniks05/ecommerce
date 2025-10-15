# Deployment Guide

## 🚀 Build & Deploy

### Step 1: Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### Step 2: Test Production Build Locally

```bash
npm run preview
```

This runs a local server to preview the production build.

### Step 3: Deploy

Choose one of these hosting options:

## Hosting Options

### Option 1: Vercel (Recommended)

**Why Vercel?**
- Zero configuration for Vite projects
- Automatic HTTPS
- Global CDN
- Free tier available
- Perfect for React apps

**Deploy Steps:**
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow prompts
4. Done! Your site is live

**Or use Vercel Dashboard:**
1. Go to https://vercel.com
2. Connect your Git repository
3. Vercel auto-detects Vite
4. Click Deploy
5. Done!

### Option 2: Netlify

**Deploy Steps:**
1. Go to https://netlify.com
2. Drag & drop your `dist` folder
3. Or connect Git repository
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Deploy!

### Option 3: GitHub Pages

**Setup:**
1. Install: `npm install -D gh-pages`

2. Update `vite.config.js`:
```js
export default defineConfig({
  plugins: [react()],
  base: '/your-repo-name/',
})
```

3. Update `package.json`:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

4. Deploy: `npm run deploy`

### Option 4: AWS S3 + CloudFront

**For Enterprise Deployments**

1. Create S3 bucket
2. Enable static website hosting
3. Upload `dist/` contents
4. Create CloudFront distribution
5. Point domain to CloudFront

### Option 5: Docker

**Dockerfile:**
```dockerfile
FROM nginx:alpine
COPY dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Build & Run:**
```bash
docker build -t ecommerce-frontend .
docker run -p 80:80 ecommerce-frontend
```

## Environment Variables

For production, you may need to set environment variables:

1. Create `.env.production`:
```env
VITE_API_URL=https://api.yoursite.com
```

2. Build with env vars:
```bash
npm run build
```

## Performance Optimization

Before deploying, consider:

### 1. Image Optimization
- Use WebP format
- Compress images
- Use CDN for images (currently using Unsplash CDN)

### 2. Code Splitting
- Already implemented via React Router
- Lazy load heavy components if needed

### 3. Caching
- Configure cache headers on hosting
- Leverage browser caching

### 4. Analytics
- Add Google Analytics
- Add error tracking (Sentry)

## Domain Setup

### Custom Domain on Vercel
1. Go to project settings
2. Add domain
3. Update DNS records
4. Vercel handles SSL automatically

### Custom Domain on Netlify
1. Go to domain settings
2. Add custom domain
3. Update DNS records
4. Netlify provides free SSL

## SSL Certificate

All recommended hosting providers offer free SSL:
- Vercel: Automatic
- Netlify: Automatic
- GitHub Pages: Automatic for github.io domains
- AWS: Use AWS Certificate Manager

## Pre-Deployment Checklist

- [ ] Run `npm run build` successfully
- [ ] Test with `npm run preview`
- [ ] Update site metadata in `index.html`
- [ ] Update README with live URL
- [ ] Test all routes work
- [ ] Test on mobile devices
- [ ] Test cart persistence
- [ ] Test forms submission
- [ ] Check console for errors
- [ ] Verify images load
- [ ] Test responsive design
- [ ] Check page load speed

## Post-Deployment

1. **Test Everything**
   - All pages load
   - Navigation works
   - Cart functions
   - Forms submit
   - Mobile responsive

2. **Monitor Performance**
   - Use Lighthouse
   - Check Core Web Vitals
   - Monitor load times

3. **Set Up Analytics**
   - Google Analytics
   - User behavior tracking
   - Error monitoring

4. **SEO Setup**
   - Submit sitemap to Google
   - Set up Google Search Console
   - Add meta tags
   - Create robots.txt

## Continuous Deployment

### With Git Integration

Most hosting providers support automatic deployment:

1. Connect Git repository
2. Choose branch (usually `main`)
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Every push triggers automatic deployment

## Rollback

If something goes wrong:

**Vercel:**
- Go to deployments
- Select previous deployment
- Click "Promote to Production"

**Netlify:**
- Go to deploys
- Select previous deploy
- Click "Publish deploy"

**GitHub Pages:**
- Revert Git commit
- Run `npm run deploy`

## Monitoring

Set up monitoring for:
- Uptime (UptimeRobot)
- Performance (Lighthouse CI)
- Errors (Sentry)
- Analytics (Google Analytics)

## Cost Estimates

**Free Tier Options:**
- Vercel: Free (generous limits)
- Netlify: Free (100GB bandwidth)
- GitHub Pages: Free
- AWS: ~$1-5/month (after free tier)

**Recommended for Production:**
- Vercel Pro: $20/month
- Netlify Pro: $19/month
- AWS with CloudFront: $5-20/month

## Support

After deployment, your client can:
1. Update content via backend (once integrated)
2. Monitor analytics
3. Track user behavior
4. View sales data (future feature)

## Scaling

When traffic grows:
1. Upgrade hosting plan
2. Implement CDN
3. Optimize images
4. Enable caching
5. Consider SSR (Next.js migration)

## Backup Strategy

1. Keep Git repository as source of truth
2. Regular database backups (once backend added)
3. Document all environment variables
4. Export analytics data regularly

---

## Quick Deploy Commands

**Vercel:**
```bash
npm i -g vercel
vercel
```

**Netlify:**
```bash
npm i -g netlify-cli
netlify deploy --prod
```

**GitHub Pages:**
```bash
npm run deploy
```

---

## 🎉 Ready to Deploy!

Your ecommerce frontend is production-ready and can be deployed in minutes to any of these platforms.

**Recommended: Start with Vercel for the easiest deployment experience.**

