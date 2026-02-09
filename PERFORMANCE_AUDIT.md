# Performance Audit – Roatán Luxury Homes

**Tool:** [PageSpeed Insights](https://pagespeed.web.dev)  
**Date:** February 2025

---

## Baseline scores (before changes)

| Metric        | Mobile | Desktop |
|---------------|--------|---------|
| **Performance** | 67     | 84      |
| Accessibility | 93     | 91      |
| Best Practices | 94    | 96      |
| **SEO**       | **100** | **100** |

Performance is the main lever; accessibility and best practices are already strong. SEO is maxed.

---

## What was hurting Performance (especially mobile)

1. **Too many preloaded images**  
   `index.html` preloaded 4 hero images (hero-banner, turtle-ocean, beach, reef). On mobile this competes for bandwidth and delays the real LCP image (usually the home hero).

2. **Single large JS bundle**  
   All routes were imported up front, so the first load included every page plus heavy deps (framer-motion, Radix, Supabase, etc.). That increased parse/compile time and pushed back interactivity.

3. **No vendor splitting**  
   React, Radix, framer-motion, Supabase, and app code were in one or few chunks, so caching was less effective and initial payload was larger than necessary.

4. **Multiple high-priority images on one page**  
   On Blog, loading/error/success states each used `fetchpriority="high"` for a hero image. Only one image per page should be high priority.

---

## Changes made

### 1. Preload only the LCP image
- **File:** `index.html`
- Removed preload for turtle-ocean, beach, reef. Kept only `hero-banner-optimized.jpg` (the home hero / LCP).
- Reduces contention so the browser can load the LCP image faster on mobile.

### 2. Route-based code splitting (React.lazy)
- **File:** `src/App.jsx`
- **Home** is still loaded eagerly so the landing page stays fast.
- All other routes (About, Contact, Services, Properties, Blog, BlogDetail, ServiceDetail, PropertyDetail, NotFound, PrivacyPolicy, Submit Property, Performance test, and all Admin pages) are loaded with `React.lazy()`.
- Wrapped `<Routes>` in `<Suspense fallback={<PageFallback />}>` with a small spinner so the UI doesn’t jump.
- **Effect:** Initial JS bundle is much smaller; other pages load on demand. Improves LCP and TBT/INP on the first visit.

### 3. Vendor chunk splitting (Vite)
- **File:** `vite.config.js`
- Added `build.rollupOptions.output.manualChunks` to split:
  - `vendor-react` (react, react-dom)
  - `vendor-router` (react-router-dom)
  - `vendor-motion` (framer-motion)
  - `vendor-radix` (@radix-ui/*)
  - `vendor-icons` (lucide-react)
  - `vendor-supabase` (@supabase/supabase-js)
  - `vendor` (rest of node_modules)
- **Effect:** Smaller initial chunk; better caching when you update app code but not libs.

### 4. Fewer high-priority images on Blog
- **File:** `src/pages/Blog.jsx`
- Loading and error state heroes no longer use `fetchpriority="high"` and use `loading="lazy"` so they don’t compete with the main content hero.
- Only the visible Blog hero keeps eager load; other states load lazily.

---

## What to do next (after deploy)

1. **Re-run PageSpeed**  
   Test the live URL again (mobile + desktop). You should see a higher Performance score, especially on mobile.

2. **If LCP is still slow**
   - Serve the LCP image as WebP with a JPG fallback (you already use `OptimizedImage` on Home; ensure the hero uses it and that WebP is served).
   - Consider a smaller “mobile hero” (e.g. different src for `max-width: 768px`) so mobile doesn’t download the full desktop asset.

3. **If TBT/INP is still high**
   - Lazy-load `framer-motion` only on pages that use it (e.g. dynamic import in those route components) so the home page doesn’t pay the cost.
   - Reduce or replace heavy animations on the critical path.

4. **Accessibility (93/91)**
   - Open the PageSpeed “Accessibility” section and fix any listed issues (contrast, tap targets, ARIA, etc.).

5. **Best Practices (94/96)**
   - Address any console warnings or security/HTTPS suggestions PageSpeed reports.

---

## Quick reference: Core Web Vitals

- **LCP (Largest Contentful Paint):** Main content (usually hero image) should appear within ~2.5 s. Preloading only the hero and splitting JS help.
- **INP (Interaction to Next Paint):** Responsiveness. Smaller JS and lazy loading keep the main thread freer.
- **CLS (Cumulative Layout Shift):** Reserve space for images (width/height or aspect-ratio) and avoid inserting content above the fold late. You already use stable layout; keep image dimensions set where possible.

---

## Files touched

- `index.html` – preload only hero-banner
- `src/App.jsx` – lazy routes + Suspense
- `vite.config.js` – manualChunks
- `src/pages/Blog.jsx` – loading/error hero no longer high-priority

After deploying, run PageSpeed again and iterate on any remaining suggestions (images, fonts, third-party scripts) as needed.
