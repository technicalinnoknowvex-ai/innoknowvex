# SEO Implementation Architecture

## File Overview & Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                  EDUTECT - SEO ARCHITECTURE                 │
└─────────────────────────────────────────────────────────────┘

1. CENTRALIZED CONFIGURATION
   └─ src/constants/seo.js
      ├─ SITE_CONFIG (brand info, domain, social links)
      ├─ PAGES (all page metadata)
      ├─ SCHEMA_* (JSON-LD templates)
      └─ Helpers (generateMetadataObject, generateOpenGraph, etc.)

2. SEARCH ENGINE FILES
   ├─ src/app/robots.ts
   │  └─ Dynamic robots.txt → Allows all bots except AI
   │
   └─ src/app/sitemap.ts
      └─ Dynamic sitemap.xml → All public routes with priority

3. UTILITY FUNCTIONS
   └─ src/utils/seo.ts
      ├─ generateMetadataObject() → Complete metadata object
      ├─ generateSchemaMarkup() → JSON-LD schema
      ├─ createOrganizationSchema() → Org schema
      ├─ createCourseSchema() → Course schema
      ├─ sanitizeTitle() → Max 60 chars
      └─ sanitizeDescription() → Max 160 chars

4. ROOT LAYOUT
   └─ src/app/layout.jsx
      ├─ Enhanced metadata
      ├─ Open Graph tags
      ├─ Twitter Card tags
      ├─ Canonical URL
      ├─ JSON-LD Organization schema
      ├─ Facebook Pixel
      └─ Google Analytics

5. PAGE METADATA (Static & Dynamic)
   ├─ Static Pages
   │  ├─ src/app/(frontend)/(main)/page.jsx → Home
   │  ├─ src/app/(frontend)/(main)/about-us/page.jsx → About
   │  ├─ src/app/(frontend)/(main)/offline-courses/page.jsx → Courses
   │  ├─ src/app/(frontend)/(main)/tech-starter-pack/page.jsx → Starter
   │  ├─ src/app/(frontend)/(main)/golden-pass/page.jsx → Premium
   │  └─ src/app/(frontend)/(main)/cart/page.jsx → Cart (noindex)
   │
   ├─ Dynamic Pages
   │  ├─ src/app/(frontend)/(main)/programs/[slug]/page.jsx
   │  │  └─ generateMetadata() with program data
   │  │
   │  └─ src/app/(frontend)/(main)/offline-courses/[courseSlug]/page.jsx
   │     └─ generateMetadata() with course data
   │
   └─ Auth Pages (all with noindex)
      ├─ Student: sign-in, sign-up, forgot-password
      ├─ Admin: sign-in, sign-up, reset-password
      └─ Shared: reset-password
```

## Metadata Flow Diagram

```
                    REQUEST TO PAGE
                         │
                         ▼
                 ┌────────────────┐
                 │   Next.js      │
                 │ Checks for     │
                 │ generateMeta() │
                 └────────────────┘
                         │
         ┌───────────────┴───────────────┐
         │                               │
         ▼                               ▼
    ┌─────────────┐            ┌──────────────────┐
    │   Static    │            │    Dynamic       │
    │  Metadata   │            │   Metadata       │
    │  (exported  │            │  (function with  │
    │   constant) │            │   data fetching) │
    └─────────────┘            └──────────────────┘
         │                               │
         ├───────────────┬───────────────┤
         │               │               │
         ▼               ▼               ▼
    ┌──────────────────────────────────────────┐
    │  generateMetadataObject() from seo.ts    │
    │  ─────────────────────────────────────  │
    │  Returns: {                              │
    │    title,                                │
    │    description,                          │
    │    robots,                               │
    │    openGraph: {...},                     │
    │    twitter: {...},                       │
    │    alternates: { canonical: ... }        │
    │  }                                       │
    └──────────────────────────────────────────┘
         │
         ▼
    ┌──────────────────────────────────────────┐
    │      Next.js Metadata Resolution         │
    │  ─────────────────────────────────────  │
    │  Automatically generates HTML meta tags: │
    │  • <title>                               │
    │  • <meta name="description">             │
    │  • <meta name="robots">                  │
    │  • <meta property="og:*">                │
    │  • <meta name="twitter:*">               │
    │  • <link rel="canonical">                │
    │  • (+ all inherited from Root Layout)    │
    └──────────────────────────────────────────┘
         │
         ▼
    ┌──────────────────────────────────────────┐
    │   Sent to Browser with HTML Response    │
    │  ─────────────────────────────────────  │
    │  Search engines crawl and parse tags    │
    └──────────────────────────────────────────┘
```

## Search Engine Discovery Flow

```
┌──────────────────┐
│  Search Engine   │
│     Crawler      │
└────────┬─────────┘
         │
         ├─► 1. Discovers robots.txt
         │   ├─ Can crawl: "/" (allowed)
         │   ├─ Cannot crawl: "/admin", "/api", "/auth"
         │   └─ Blocked: GPTBot, CCBot
         │
         ├─► 2. Finds sitemap.xml
         │   └─ Gets list of all public pages with priority/frequency
         │
         ├─► 3. Crawls each page
         │   └─ Extracts metadata:
         │      ├─ Title
         │      ├─ Description
         │      ├─ Keywords
         │      ├─ Canonical URL
         │      ├─ JSON-LD schema
         │      └─ Open Graph tags
         │
         ├─► 4. Indexes page content
         │   └─ Combines extracted metadata with page content
         │
         └─► 5. Updates search results
             └─ Displays title, description, URL in search results
```

## Content Distribution - Social Media

```
When someone shares: https://www.innoknowvex.in/programs/web-dev

┌─────────────────────────────────────────────────────────────┐
│  Social Media Platform Fetches Open Graph Metadata          │
└─────────────────────────────────────────────────────────────┘

                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
    ┌────────┐       ┌─────────┐     ┌──────────┐
    │Facebook│       │LinkedIn │     │WhatsApp  │
    └────────┘       └─────────┘     └──────────┘
        │                │                │
        └────────────────┼────────────────┘
                         │
        ┌────────────────────────────────────┐
        │  Displays Preview Card with:       │
        ├────────────────────────────────────┤
        │ 📸 og:image (1200x630)             │
        │ 📝 og:title                        │
        │ 📄 og:description                  │
        │ 🌐 og:url                          │
        │ 🏢 og:site_name (Edutect)          │
        └────────────────────────────────────┘
```

## SEO Checklist Matrix

```
┌────────────────────┬──────┬────────┬──────────┐
│ Feature            │ Done │ Status │ Priority │
├────────────────────┼──────┼────────┼──────────┤
│ robots.txt         │ ✅   │ Ready  │ CRITICAL │
│ sitemap.xml        │ ✅   │ Ready  │ CRITICAL │
│ Metadata API       │ ✅   │ Ready  │ CRITICAL │
│ Open Graph         │ ✅   │ Ready  │ HIGH     │
│ Twitter Card       │ ✅   │ Ready  │ HIGH     │
│ Canonical URLs     │ ✅   │ Ready  │ HIGH     │
│ JSON-LD Schema     │ ✅   │ Ready  │ HIGH     │
│ OG Image (1200x630)│ ⏳   │ NEEDED │ CRITICAL │
│ Google Analytics   │ ⏳   │ CONFIG │ HIGH     │
│ Google Console     │ ⏳   │ TODO   │ HIGH     │
│ Bing Console       │ ⏳   │ TODO   │ MEDIUM   │
│ Image Alt Text     │ ⏳   │ TODO   │ MEDIUM   │
│ Heading Hierarchy  │ ⏳   │ AUDIT  │ MEDIUM   │
│ Breadcrumb Schema  │ ⏳   │ TODO   │ MEDIUM   │
└────────────────────┴──────┴────────┴──────────┘
```

## File Dependencies

```
seo.js ←────────────────────────────────┐
 ├─ SITE_CONFIG                        │
 ├─ PAGES metadata                     │
 ├─ SCHEMA helpers                     │
 └─ generateMetadataObject()           │
    │                                   │
    └───┬─────────────────────────────────┼──────────┐
        │                                 │          │
        ▼                                 ▼          ▼
  layout.jsx ◄──── robots.ts  ◄──── sitemap.ts
        │
        ├─ Uses generateMetadataObject()
        ├─ Uses createOrganizationSchema()
        └─ References DEFAULT_OG_IMAGE
                │
                └───────────────┬───────────────┐
                                │               │
                                ▼               ▼
                          Every page imports layout
                          Every page uses generateMetadataObject()
                                │
                ┌───────────────┼───────────────┬───────────────┐
                │               │               │               │
                ▼               ▼               ▼               ▼
            home page       programs page   about page    auth pages
            about page      courses page    cart page     dashboard
```

## Next.js Server-Side Flow

```
User visits: https://www.innoknowvex.in/programs/web-dev

1. Next.js receives request ──────────────────────┐
                             │                    │
                    ┌────────▼────────┐           │
                    │ Check for page  │           │
                    │ with [slug]     │           │
                    └────────┬────────┘           │
                             │                    │
                    ┌────────▼──────────────┐     │
                    │ Found: [slug]/page.jsx│     │
                    └────────┬──────────────┘     │
                             │                    │
                    ┌────────▼────────────────┐   │
                    │ Execute generateMeta() │    │
                    └────────┬────────────────┘   │
                             │                    │
                    ┌────────▼──────────┐         │
                    │ Fetch program     │         │
                    │ data from DB      │         │
                    └────────┬──────────┘         │
                             │                    │
                    ┌────────▼────────────┐       │
                    │ Call generateMeta   │       │
                    │ ObjectWithData()    │       │
                    └────────┬────────────┘       │
                             │                    │
                    ┌────────▼─────────────────┐  │
                    │ Next.js generates:       │  │
                    │ • <title>...             │  │
                    │ • <meta name="...">      │  │
                    │ • <meta property="og:">  │  │
                    │ • + inherited from root  │  │
                    └────────┬─────────────────┘  │
                             │                    │
                             └────────┬───────────┘
                                      │
                              ┌───────▼───────┐
                              │ Render page   │
                              │ with metadata │
                              │ in HTML head  │
                              └───────────────┘
```

## Performance Impact

```
SEO Implementation Performance Checklist:

✅ No JavaScript required (server-side rendering)
✅ Zero runtime overhead (static generation)
✅ Fast metadata delivery (built at build time)
✅ Automatic sitemap generation
✅ Automatic robots.txt generation
✅ No external dependencies added
✅ Works with static and dynamic routes
✅ Compatible with ISR (Incremental Static Regeneration)
✅ Compatible with Edge Functions
✅ Mobile-friendly (all URLs canonical)
```

---

**Version**: 1.0
**Last Updated**: 2026-06-16
**Standard**: Next.js 15 App Router with Metadata API
