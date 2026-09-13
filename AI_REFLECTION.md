# AI Reflection & Technical Summary: Clinic Stock Console

## Architectural Decisions & State Management

The core architecture prioritizes a URL-driven state management model. Rather than relying entirely on local component state for filters, search queries, and sorting, the application uses URL search parameters (`searchParams`) as the single source of truth. Whenever a user interacts with filters (`?category=`, `?quantity=`), search keywords (`?q=`), or sorting orders (`?order_by=`), the URL updates silently without causing a jarring full-page reload. This ensures the application maintains full state memory, supports deep linking, and handles session persistence seamlessly via the sign-in return URL (`/signin?to_url=...`).

For API route handling, I deliberately bypassed a generic catch-all proxy router suggested by AI. Instead, I wrote explicit, dedicated route handlers (such as `/api/auth/me`, `/api/auth/refresh`, and `/api/auth/login`). While a central proxy handles requests dynamically, maintaining independent routes makes local troubleshooting, status code management, and error tracking significantly cleaner.

When dealing with product sorting via the DummyJSON API, I encountered limitations where certain endpoints do not fully support robust sorting parameters natively. Although an AI assistant recommended falling back to client-side sorting for simplicity, I rejected this approach to avoid data consistency issues across paginated states. Handling data selection cleanly at the source ensures the client receives predictable, structured payloads.

## AI Usage & Tooling Workflow

Development was performed inside VS Code backed by built-in extensions for code formatting and real-time type checking, supplemented by GitHub Copilot (via terminal CLI and inline `Ctrl+I` prompts) for quick resolution of TypeScript type or interface mismatches.

AI usage was strictly selective rather than boilerplate-dependent:

- **UI & Design:** The layout draws inspiration from a personal project (_Fleetmaster_), adapted with custom quick-navigation tags for stock adjustments and clean Tailwind CSS integration. AI suggestions that favored inline styles or heavy pre-styled component packages were discarded to preserve a clean, maintainable Tailwind-native styling architecture.
- **Bad AI Outputs:** AI initially proposed complex, highly abstracted context wrappers for state management and an overly aggressive central catch-all routing mechanism. These were discarded because they obscured execution paths and made debugging harder.
- **Good AI Guidance:** Copilot was helpful for writing quick regex helpers and resolving subtle React hook dependency arrays and type safety errors during rapid component refactoring.

## Code to Defend: Session Refresh & Revalidation

The most critical and complex piece of code in the application is the background session revalidation and token refresh logic housed within the `UserProvider`.

Balancing an automated 1-minute polling interval (`setInterval`) with asynchronous token checks (`/api/auth/me` and `/api/auth/refresh`) introduces edge cases around race conditions, concurrent requests, and stale closures (specifically regarding active `pathname` and `searchParams` during forced redirects).

While the implemented `refreshingRef` guard successfully prevents duplicate, simultaneous refresh loops, managing token expiration lifecycles across mock backend limitations requires constant monitoring. This implementation reflects a pragmatic balance between automated security and a smooth user experience, though it remains an area of active evolution as production requirements scale.
