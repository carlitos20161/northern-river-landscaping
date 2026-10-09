# Northern River Landscaping & Design

Static website for Northern River Landscaping & Design (Bergen County, NJ).

## Images

Use only images you own or have proper rights to. If any photo or graphic is from a third party (stock, contractor, etc.), credit or disclose as needed. Transparency avoids legal issues and builds trust with customers.

## Minified CSS & JS

Pages load `styles.min.css` and `script.min.js`. After you edit `styles.css` or `script.js`, regenerate min files before deploy:

```bash
cd "/Users/carlos/Norther River"
npm install
npm run build:min
```

(`npm run build:min` uses the **`cleancss`** CLI from `clean-css-cli`; it fails if you skip `npm install`.)

## Deploy

```bash
npm run deploy
```

Same as `npx firebase-tools deploy --only hosting`. The global `firebase` CLI is optional; `npx` is enough.

Live site: https://garden-5a57e.web.app

## Canonical domain (www vs non‑www)

Search engines treat `www.example.com` and `example.com` as separate URLs unless one **301 redirects** to the other. This project uses **`https://northernriverlandscaping.com`** (no www) in `rel="canonical"` links.

**Firebase Hosting:** In [Firebase Console](https://console.firebase.google.com) → your project → **Hosting** → **Add custom domain**, add **both** the apex domain and `www`. Firebase can forward one to the other when both are connected to the same site. If your registrar or **Cloudflare** sits in front of Firebase, add a redirect rule there instead (e.g. `www` → apex with **301**). After setup, confirm with an HTTP redirect checker that only one version returns **200** and the other returns **301** to the canonical host.
