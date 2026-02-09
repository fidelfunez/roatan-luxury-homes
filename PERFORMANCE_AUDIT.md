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

### 1. ~~Preload only the LCP image~~ Preload removed
- **File:** `index.html`
- Hero image preload was removed. The home hero is **desktop-only** (`hidden lg:block`); on mobile the hero is a gradient with no image. Preloading the hero caused a “preloaded but not used” warning on mobile and wasted bandwidth. On desktop the hero still loads with `loading="eager"` and `fetchpriority="high"` from the component.

### 2. Route-based code splitting (React.lazy)
- **File:** `src/App.jsx`
- **Home** is still loaded eagerly so the landing page stays fast.
- All other routes (About, Contact, Services, Properties, Blog, BlogDetail, ServiceDetail, PropertyDetail, NotFound, PrivacyPolicy, Submit Property, Performance test, and all Admin pages) are loaded with `React.lazy()`.
- Wrapped `<Routes>` in `<Suspense fallback={<PageFallback />}>` with a small spinner so the UI doesn’t jump.
- **Effect:** Initial JS bundle is much smaller; other pages load on demand. Improves LCP and TBT/INP on the first visit.

### 3. ~~Vendor chunk splitting (Vite)~~ Reverted
- **File:** `vite.config.js`
- Custom `manualChunks` was reverted because it caused **"Cannot access 'o' before initialization"** (chunk load order / circular dependency). Rollup’s default chunking is used instead. Route-based code splitting (lazy routes) is still in place and gives the main benefit.

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

- `index.html` – hero preload removed (hero is desktop-only; preload caused “not used” warning on mobile)
- `src/App.jsx` – lazy routes + Suspense (kept)
- `vite.config.js` – custom manualChunks reverted (caused blank page / “Cannot access before initialization”)
- `src/pages/Blog.jsx` – loading/error hero no longer high-priority (kept)

After deploying, run PageSpeed again and iterate on any remaining suggestions (images, fonts, third-party scripts) as needed.

---

## Mobile 84 → 100: further optimizations (Feb 2025)

Applied to address PageSpeed’s “Opportunities” for mobile:

1. **Render-blocking CSS (~300ms est.)**  
   - **Change:** Vite plugin `nonBlockingCss` in `vite.config.js` turns the main stylesheet link into `media="print" onload="this.media='all'"` so it no longer blocks first paint. Critical CSS remains inline in `index.html`.

2. **Preconnect**  
   - **Change:** In `index.html`, added `<link rel="preconnect" href="https://zseevllqomushqhlqpon.supabase.co" crossorigin>` so the first Supabase request starts sooner (shorter critical path).

3. **Boat image (~247 KiB est.)**  
   - **Change:** Replaced raw `<img>` for `boat-ocean-optimized.jpg` with `OptimizedImage` using `webpSrc` and `sizes` in `Home.jsx` and `Contact.jsx`. Modern format (WebP) and `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 904px"` reduce payload and improve image delivery.

---

## Mobile audit failing completely (no scores)

**Symptom:** Desktop 100, but mobile run showed red exclamation marks and no scores for any category.

**Cause:** The app hid the whole page (`#root` had `opacity: 0`) until JS ran and a 100ms timeout finished. On Lighthouse’s throttled mobile (slow 4G + slow CPU), the main JS bundle could load very late, so the page stayed blank long enough for the run to time out or be treated as a failure.

**Fix:** Removed the initial `#root.loading` (opacity 0) and the 100ms delay in `main.jsx`. Content is visible as soon as React renders, so the mobile audit can finish even when JS is slow.
