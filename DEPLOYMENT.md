# Deployment Guide - Caribbean Lux Realty

## 🚀 Netlify Deployment

### Prerequisites
- GitHub repository with your project
- Netlify account (free tier available)

### Step 1: Prepare Your Repository

1. **Ensure all files are committed**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Verify build works locally**
   ```bash
   npm run build
   ```

### Step 2: Deploy to Netlify

#### Option A: Deploy via Netlify UI

1. **Go to [Netlify](https://netlify.com)**
2. **Click "New site from Git"**
3. **Connect your GitHub account**
4. **Select your repository**
5. **Configure build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
6. **Click "Deploy site"**

#### Option B: Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod
   ```

### Step 3: Configure Environment Variables

In your Netlify dashboard:

1. **Go to Site settings → Environment variables**
2. **Add the following variables:**

```env
VITE_APP_TITLE=Caribbean Lux Realty
VITE_APP_DESCRIPTION=Luxury Real Estate in the Caribbean
VITE_ADMIN_EMAIL=admin@caribbeanlux.com
VITE_ADMIN_PASSWORD=your-secure-password
VITE_CONTACT_PHONE=+1-555-0123
VITE_CONTACT_EMAIL=info@caribbeanlux.com
VITE_WHATSAPP_NUMBER=+1-555-0123
```

### Step 4: Custom Domain (Optional)

1. **Go to Site settings → Domain management**
2. **Add custom domain**
3. **Configure DNS settings**
4. **Enable HTTPS**

## 🔧 Production Optimizations

### Build Optimization
- ✅ Code splitting enabled
- ✅ Image optimization
- ✅ CSS minification
- ✅ JavaScript bundling
- ✅ SEO meta tags

### Performance Features
- ✅ Lazy loading
- ✅ Caching headers
- ✅ Gzip compression
- ✅ CDN distribution

## 🛡️ Security Configuration

### Headers (Already configured in netlify.toml)
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin

### HTTPS
- Automatically enabled by Netlify
- SSL certificate provided

## 📊 Monitoring

### Netlify Analytics
- Page views
- Visitor analytics
- Performance metrics
- Error tracking

### Custom Analytics
Consider adding:
- Google Analytics
- Google Search Console
- Facebook Pixel

## 🔄 Continuous Deployment

### Automatic Deploys
- Every push to `main` branch triggers deploy
- Preview deployments for pull requests
- Branch-specific URLs

### Rollback
- Easy rollback to previous versions
- Instant deployment of previous builds

## 🐛 Troubleshooting

### Common Issues

1. **Build Fails**
   - Check Node.js version (18+)
   - Verify all dependencies installed
   - Check for syntax errors

2. **404 Errors**
   - Ensure `netlify.toml` redirects are configured
   - Check file paths in build output

3. **Environment Variables**
   - Verify variables are set in Netlify dashboard
   - Check variable names (must start with VITE_)

### Debug Commands

```bash
# Test build locally
npm run build

# Check build output
ls -la dist/

# Test production build
npm run preview
```

## 📈 Post-Deployment Checklist

- [ ] Site loads correctly
- [ ] All pages accessible
- [ ] Images load properly
- [ ] Admin panel works
- [ ] Contact forms functional
- [ ] Mobile responsive
- [ ] Performance optimized
- [ ] SEO meta tags present
- [ ] Analytics tracking
- [ ] SSL certificate active

## 🔄 Updates and Maintenance

### Regular Updates
1. **Update dependencies**
   ```bash
   npm update
   ```

2. **Test locally**
   ```bash
   npm run dev
   npm run build
   ```

3. **Deploy changes**
   ```bash
   git add .
   git commit -m "Update dependencies"
   git push origin main
   ```

### Database Considerations
For future SQLite integration:
- Consider using Netlify Functions
- Or external database service
- Plan for data persistence

---

**Your site is now live!** 🎉

Visit your Netlify URL to see your Caribbean Lux Realty website in action. 