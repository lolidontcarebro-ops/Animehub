# Deployment Guide

This guide will help you deploy the Anime News Hub app to various platforms.

## Quick Deployment Options

### Option 1: Vercel (Recommended - Free & Fast)

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
cd anime-news-hub
vercel
```

4. **Follow the prompts** - Vercel will detect your Vite project automatically

5. **Get your URL** - Example: `https://anime-news-hub.vercel.app`

---

### Option 2: Netlify (Free)

#### Method A: Drag & Drop
1. Build your project:
```bash
npm run build
```

2. Go to [Netlify Drop](https://app.netlify.com/drop)

3. Drag and drop the `dist/` folder

4. Get your instant URL!

#### Method B: Netlify CLI
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

---

### Option 3: GitHub Pages (Free)

1. **Create a GitHub repository**

2. **Push your code**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/anime-news-hub.git
git push -u origin main
```

3. **Install gh-pages**
```bash
npm i -D gh-pages
```

4. **Add to package.json**
```json
{
  "scripts": {
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://YOUR_USERNAME.github.io/anime-news-hub"
}
```

5. **Build and deploy**
```bash
npm run build
npm run deploy
```

---

### Option 4: Firebase Hosting (Free)

1. **Install Firebase CLI**
```bash
npm i -g firebase-tools
```

2. **Login**
```bash
firebase login
```

3. **Initialize**
```bash
firebase init hosting
```
- Select "Create a new project"
- Choose `dist` as your public directory
- Configure as single-page app: **Yes**

4. **Deploy**
```bash
npm run build
firebase deploy
```

---

### Option 5: Cloudflare Pages (Free)

1. **Push code to GitHub**

2. **Go to [Cloudflare Pages](https://pages.cloudflare.com)**

3. **Create a new project**
- Connect your GitHub repository
- Build command: `npm run build`
- Build output directory: `dist`

4. **Deploy** - Automatic on every push!

---

## Mobile App Conversion

### Convert to Android/iOS App

#### Option A: Capacitor (Recommended)

1. **Install Capacitor**
```bash
npm i @capacitor/core @capacitor/cli
npm i @capacitor/android @capacitor/ios
```

2. **Initialize Capacitor**
```bash
npx cap init AnimeNewsHub com.yourname.animenews --web-dir dist
```

3. **Build and sync**
```bash
npm run build
npx cap sync
```

4. **Open in Android Studio / Xcode**
```bash
npx cap open android
npx cap open ios
```

5. **Build and publish** to Google Play / App Store

#### Option B: PWA (Progressive Web App)

The app already includes PWA support! Users can:
- **Android**: Tap "Add to Home Screen" in Chrome
- **iOS**: Tap Share → "Add to Home Screen"

---

## Custom Domain Setup

### Vercel
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed

### Netlify
1. Go to Site Settings → Domain Management
2. Add custom domain
3. Configure DNS

### Firebase
```bash
firebase hosting:channel:deploy production
```

---

## Environment Variables

Create a `.env` file for production:

```env
# API Configuration
VITE_ANILIST_API_URL=https://graphql.anilist.co
VITE_MANGADEX_API_URL=https://api.mangadex.org

# Cache Settings
VITE_CACHE_DURATION=5

# Analytics (optional)
VITE_GA_TRACKING_ID=your-google-analytics-id
```

---

## Post-Deployment Checklist

- [ ] Test all features work correctly
- [ ] Verify API calls are successful
- [ ] Check mobile responsiveness
- [ ] Test favorites functionality
- [ ] Verify search works
- [ ] Check image loading
- [ ] Test share functionality
- [ ] Add custom domain (optional)
- [ ] Set up analytics (optional)
- [ ] Configure SSL certificate

---

## Troubleshooting

### Build Errors
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### API Not Working
- Check CORS settings
- Verify API endpoints are accessible
- Check browser console for errors

### Images Not Loading
- Verify image URLs are valid
- Check for hotlink protection
- Add fallback images

---

## Need Help?

- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [Firebase Docs](https://firebase.google.com/docs/hosting)
- [Capacitor Docs](https://capacitorjs.com/docs)
