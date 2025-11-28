# PWA Installation Checklist

## ✅ Requirements (Must Have)

1. **HTTPS** ✅
   - Site: https://devfest.cloudbandung.id
   - SSL certificate active

2. **Service Worker** ✅
   - File: `/public/sw.js`
   - Registered in `index.html`
   - Event listeners: install, activate, fetch

3. **Web App Manifest** ✅
   - File: `/public/manifest.json`
   - Linked in `index.html`
   - Required fields:
     - ✅ name
     - ✅ short_name
     - ✅ start_url
     - ✅ display: standalone
     - ✅ icons (192x192 and 512x512)

## 🔍 Testing PWA

### Chrome DevTools
1. Open DevTools (F12)
2. Go to **Application** tab
3. Check **Manifest** section
   - Should show no errors
   - Icons should be visible
4. Check **Service Workers** section
   - Should show "activated and running"
5. Run **Lighthouse** audit
   - Should pass PWA checklist

### Install Test
1. Open site in Chrome/Edge
2. Look for install icon in address bar (⊕)
3. Click to install
4. App should open in standalone window

## 🐛 Common Issues

### Icon not showing
- Clear browser cache
- Hard refresh (Ctrl+Shift+R)
- Check manifest.json is accessible: `/manifest.json`
- Check icons exist: `/gdg_logo.jpg`

### Service Worker errors
- Check Console for errors
- Unregister old SW: DevTools → Application → Service Workers → Unregister
- Hard refresh page

### Still not installable
- Verify HTTPS is working
- Check all files are served correctly (no 404s)
- Wait 30 seconds after page load
- Try incognito/private mode

## 📱 Browser Support

- ✅ Chrome/Edge Desktop (Windows/Mac/Linux)
- ✅ Chrome Android
- ✅ Safari iOS (Add to Home Screen)
- ✅ Edge Android
- ❌ Firefox (limited support)
