# BLINDSPOT — The Daily Car Guessing Game

Guess the mystery car in 8 tries. 1000+ real cars, no hints, pure automotive knowledge.

---

## DEPLOY TO VERCEL (step by step)

### Step 1: Install tools (one-time setup)

Open your Terminal app (Mac) or Command Prompt (Windows) and run:

```
# Install Node.js if you don't have it:
# Mac: Go to https://nodejs.org and download the LTS version, run the installer
# Or if you have Homebrew: brew install node

# Verify it worked:
node --version
npm --version
```

### Step 2: Install dependencies

In Terminal, navigate to this folder and install:

```
cd blindspot-app
npm install
```

### Step 3: Test locally (optional but recommended)

```
npm run dev
```

This opens the game at http://localhost:5173 — check that everything works.
Press Ctrl+C to stop the local server when done.

### Step 4: Create a GitHub repository

1. Go to https://github.com/new
2. Name it `blindspot` (or whatever you want)
3. Set it to **Private** (you can make it public later)
4. Do NOT check any boxes (no README, no .gitignore)
5. Click **Create repository**

### Step 5: Push your code to GitHub

Back in Terminal (make sure you're in the blindspot-app folder):

```
git init
git add .
git commit -m "Initial commit — BLINDSPOT v2"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/blindspot.git
git push -u origin main
```

Replace YOUR_USERNAME with your actual GitHub username.

### Step 6: Deploy to Vercel

1. Go to https://vercel.com and sign up with your GitHub account
2. Click **"Add New..."** → **"Project"**
3. It will show your GitHub repos — select **blindspot**
4. Vercel auto-detects it's a Vite project. Leave all settings as default.
5. Click **Deploy**
6. Wait ~60 seconds. Done. Your game is live.

Vercel gives you a URL like `blindspot-xyz.vercel.app`. You can use this immediately.

### Step 7: Connect your custom domain (optional)

1. Buy a domain (e.g. `playblindspot.com` from Namecheap, Google Domains, or Cloudflare)
2. In Vercel, go to your project → Settings → Domains
3. Add your domain
4. Vercel tells you what DNS records to set — follow those instructions at your domain registrar
5. SSL is automatic. Usually live within 5-30 minutes.

---

## UPDATING THE GAME

After making changes to the code:

```
git add .
git commit -m "description of change"
git push
```

Vercel auto-deploys on every push. Your site updates in ~30 seconds.

---

## ADDING ADS (when ready)

1. Sign up for Google AdSense at https://adsense.google.com
2. Add their script tag to `index.html` in the `<head>`
3. Add ad unit `<div>` elements in `src/Blindspot.jsx` where you want ads:
   - Below the game grid (always visible)
   - Between free play rounds (interstitial)
   - On the menu screen

---

## PROJECT STRUCTURE

```
blindspot-app/
├── index.html          ← Main HTML with SEO + OG tags
├── package.json        ← Dependencies
├── vite.config.js      ← Build config
├── public/
│   ├── manifest.json   ← PWA manifest (installable)
│   ├── sw.js           ← Service worker (offline support)
│   ├── favicon.svg     ← Browser tab icon
│   ├── icon-192.png    ← PWA icon (small)
│   ├── icon-512.png    ← PWA icon (large)
│   └── og-image.png    ← Social sharing preview image
└── src/
    ├── main.jsx        ← React entry point
    └── Blindspot.jsx   ← The entire game
```

---

## THINGS TO CUSTOMIZE BEFORE LAUNCH

1. **Domain**: Update the `og:url` in `index.html` to your actual domain
2. **OG Image**: Replace `public/og-image.png` with a designed version
3. **Icons**: Replace `icon-192.png` and `icon-512.png` with designed app icons
4. **Share URL**: In `Blindspot.jsx`, search for `blindspot.game` and replace with your domain
