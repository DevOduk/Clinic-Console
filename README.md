# Clinic Stock Console: Architecture & Design Reflection

This document outlines the architectural decisions, component design, state management strategy, caching mechanisms, styling system, and accessibility approach implemented for the Clinic Stock Console.

---

## 1. Component Identification and Layout Structure

The interface is structured around a professional dashboard layout optimized for both desktop viewports and tablet/mobile form factors.

- **Layout Division**: The screen is divided into two primary structural regions: a persistent **Left Sidebar** (fixed on desktop, transforming into a responsive drawer/top-bar header on small screens) and a main **Content Workspace** that handles dynamic dashboard views and data tables.
- **Core Components**:
- **Sidebar & Navigation**: Fixed left-side navigation featuring direct links to the Dashboard metrics, Inventory, Categories, and a health-check monitor.
- **Dashboard View**: Clean metrics banner cards summarizing inventory stats, coupled with a dense tabular view restricted to the 15 most recently updated products.
- **Data Tables & Inventory View**: Custom tabular layouts optimized over grid cards to maximize information density. Includes multi-select capabilities with a bulk delete action banner.
- **Product Detail View**: A split-screen layout (inspired by the FleetMaster architecture) featuring product imagery on the left, detailed metadata on the right, and inline stock count updating.
- **UI Utilities**: Reusable breadcrumbs for deep navigation, search input fields, and native select elements for rapid filtering without heavy dropdown overlay bugs on touchscreens.

---

## 2. State Management Strategy (Server vs. URL vs. Local)

State isolation follows a strict separation of concerns depending on the data lifecycle:

- **Server Data**: Fetched directly from API endpoints (`[dummyjson.com/products](https://dummyjson.com/products)` and local route handlers). This data is treated as ephemeral and fetched fresh per request or managed via standard React data-fetching lifecycles.
- **URL State (`searchParams`)**: Used as the single source of truth for **filters, pagination, search queries, and active view tabs**. Storing filter state in the URL ensures that views are bookmarkable, shareable, and resilient to page refreshes without relying on brittle client-side context stores.
- **Local UI State (`useState`)**: Restricted strictly to transient, component-scoped behaviors—such as tracking selected table row IDs for bulk actions, open/closed states for the mobile drawer menu, or inline editing states for stock count updates.

---

## 3. Data Fetching, Caching, and Invalidation

- **Fetching**: Handled via standard Next.js App Router server components where applicable, alongside client-side `fetch` for dynamic filters and simulated error endpoints (`/http/500`).
- **Caching & Revalidation**: Leverages Next.js default fetch caching strategies with explicit cache-control directives on health-check routes (`no-store` headers on `/api/health`) to prevent stale offline pings. Client-side mutations trigger router refreshes (`router.refresh()`) to re-fetch server data components upon updates.
A few redis caching use in some scenarios

---

## 4. Layout, Spacing, Colour, and Typography

- **Styling System**: Built using **Tailwind CSS** alongside **Material UI (MUI)** primitives where appropriate.
- **Typography**: Powered by Google Fonts via Next.js font optimization (`Outfit` for headings, paired with system sans fonts).
- **Spacing & Color**: Relies on Tailwind's design token scale for consistent spacing rhythm. Color palettes utilize neutral slate backgrounds paired with high-contrast functional accents (error reds, success greens, and primary brand tones) to meet visual hierarchy standards.

---

## 5. Accessibility (a11y) Approach

- **Responsive Breakpoints**: Leverages Tailwind’s built-in mobile-first prefixes (`sm:`, `md:`, `lg:`) to ensure readability down to 360px viewport widths without horizontal overflow.
- **Keyboard Navigation**: All interactive elements (buttons, links, native select filters, and table actions) utilize semantic HTML tags (`<button>`, `<a>`, `<input>`) ensuring full operability via keyboard tab indexing and visible focus states (`focus:ring-2`).
- **Touch & Tablet Ergonomics**: Avoiding hidden hover menus and complex modal dialogs for critical actions (such as stock count updates) in favor of inline on-screen controls, improving usability on tablets and touch devices.

---

## Decision Log

### Decision 1: Table-First Layout over Grid Cards for Inventory

- **Alternative Rejected**: Product card grids (similar to standard e-commerce catalogues).
- **Why**: Medical inventory managers need high data density, rapid scanning of stock counts, and quick multi-select operations. Tables allow significantly more items to be viewed simultaneously without excessive scrolling, while fitting cleanly within constrained tablet layouts.

### Decision 2: Inline Stock Count Modification over Modal Dialogs

- **Alternative Rejected**: Opening a popup modal dialog every time a user wants to update a product's stock count.
- **Why**: Modals introduce unnecessary friction and layout shifts on smaller tablet screens. Keeping stock adjustments inline streamlines workflow speed during rapid warehouse audits and reduces touch-target misclicks.

### Decision 3: URL-Driven Parameters (`searchParams`) for Filters instead of React Context

- **Alternative Rejected**: Storing search filters, pagination offsets, and category selections in a global React Context provider.
- **Why**: Storing state in the URL makes deep links shareable, preserves filter states across browser refreshes and back-button navigation, and eliminates complex synchronization bugs between client-side state stores and server fetches.

# Project structure

```
clinic-console
├─ .husky
│  ├─ pre-commit
│  └─ _
│     ├─ applypatch-msg
│     ├─ commit-msg
│     ├─ h
│     ├─ husky.sh
│     ├─ post-applypatch
│     ├─ post-checkout
│     ├─ post-commit
│     ├─ post-merge
│     ├─ post-rewrite
│     ├─ pre-applypatch
│     ├─ pre-auto-gc
│     ├─ pre-commit
│     ├─ pre-merge-commit
│     ├─ pre-push
│     ├─ pre-rebase
│     └─ prepare-commit-msg
├─ AGENTS.md
├─ AI_REFLECTION.md
├─ app
│  ├─ (full-pages)
│  │  └─ signin
│  │     └─ page.tsx
│  ├─ (pages)
│  │  ├─ categories
│  │  │  ├─ page.tsx
│  │  │  └─ [Category]
│  │  │     └─ page.tsx
│  │  ├─ items
│  │  │  ├─ page.tsx
│  │  │  └─ [productID]
│  │  │     ├─ loading.tsx
│  │  │     └─ page.tsx
│  │  ├─ layout.tsx
│  │  ├─ loading.tsx
│  │  └─ page.tsx
│  ├─ api
│  │  ├─ auth
│  │  │  ├─ login
│  │  │  │  └─ route.ts
│  │  │  ├─ logout
│  │  │  │  └─ route.ts
│  │  │  ├─ me
│  │  │  │  └─ route.ts
│  │  │  └─ refresh
│  │  │     └─ route.ts
│  │  ├─ ping
│  │  │  └─ route.ts
│  │  └─ products
│  │     ├─ categories
│  │     │  └─ route.ts
│  │     ├─ category
│  │     │  └─ [slug]
│  │     │     └─ route.ts
│  │     ├─ route.ts
│  │     ├─ search
│  │     │  └─ route.ts
│  │     └─ [id]
│  │        └─ route.ts
│  ├─ components
│  │  ├─ DataErrorState.tsx
│  │  ├─ loading
│  │  │  └─ LoadingProfile.tsx
│  │  ├─ OfflineBanner.tsx
│  │  ├─ Pages
│  │  │  ├─ CategoriesPage.tsx
│  │  │  ├─ CategoryPageView.tsx
│  │  │  ├─ ItemsPage.tsx
│  │  │  ├─ ProductPage.tsx
│  │  │  └─ SigninPage.tsx
│  │  ├─ Pagination.tsx
│  │  ├─ SimpleBreadCrumb.tsx
│  │  └─ ui
│  │     ├─ Greeting.tsx
│  │     ├─ ProductTableRow.tsx
│  │     └─ RetryButton.tsx
│  ├─ context
│  │  └─ userContext.tsx
│  ├─ data
│  │  ├─ formating.ts
│  │  └─ products.ts
│  ├─ error.tsx
│  ├─ favicon.ico
│  ├─ globals.css
│  ├─ hooks
│  │  └─ useNetworkStatus.ts
│  ├─ http
│  │  └─ 500
│  │     ├─ ErrorPage.tsx
│  │     └─ page.tsx
│  ├─ layout
│  │  ├─ Header.tsx
│  │  └─ SideBar.tsx
│  ├─ layout.tsx
│  └─ utils
│     └─ DeleteProducts.ts
├─ CLAUDE.md
├─ commitlint.config.js
├─ docs
│  └─ .project_structure_ignore
├─ eslint.config.mjs
├─ next.config.ts
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ public
│  ├─ file.svg
│  ├─ globe.svg
│  ├─ images
│  │  └─ pizza.avif
│  ├─ next.svg
│  ├─ vercel.svg
│  └─ window.svg
├─ README.md
├─ REQUIRED.md
└─ tsconfig.json

```
