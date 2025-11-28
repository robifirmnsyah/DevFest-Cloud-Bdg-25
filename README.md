## Project info

**URL**: https://lovable.dev/projects/78185bd0-a221-4ee8-8471-a8111cb26ee6

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/78185bd0-a221-4ee8-8471-a8111cb26ee6) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/78185bd0-a221-4ee8-8471-a8111cb26ee6) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

# Cloud DevFest Bandung 2025

## PWA (Progressive Web App) Setup

This app supports PWA installation in production.

### Requirements for PWA to Work:

1. **HTTPS Required**
   - PWA only works on HTTPS (or localhost for development)
   - Deploy to production with SSL certificate

2. **Service Worker**
   - Already configured in `/public/sw.js`
   - Automatically registered in `index.html`

3. **Manifest File**
   - Located at `/public/manifest.json`
   - Contains app metadata and icons

### Testing PWA in Production:

1. Deploy to production (HTTPS)
2. Open in Chrome/Edge browser
3. Look for install icon in address bar
4. Click to install app

### Browser Support:

- ✅ Chrome/Edge Desktop & Mobile
- ✅ Safari iOS (Add to Home Screen)
- ✅ Firefox Desktop
- ❌ Not available on localhost (development)

### How to Install:

**Desktop (Chrome/Edge):**
- Click install icon (⊕) in address bar
- Or Menu → Install "DevFest 2025"

**Mobile (Chrome Android):**
- Menu (⋮) → "Add to Home screen"

**Mobile (Safari iOS):**
- Share button → "Add to Home Screen"

### Note:
PWA install prompt is disabled in development mode (localhost).
It will automatically work when deployed to production with HTTPS.

---

## Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm run preview
```

Make sure to deploy with HTTPS for PWA to work!
