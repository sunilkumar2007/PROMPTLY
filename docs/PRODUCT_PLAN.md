# Promptly — Full Product Build

A monochrome, search-first discovery platform for prompts, code, UI inspiration and dev resources. Built as one consistent design system across 17 pages.

## Design foundation (locked)

- Palette: white `#FFFFFF`, surface `#F7F7F7`, text `#000000`, secondary text `#666666`, border `#E5E5E5`, divider `#EEEEEE`, hover `#F5F5F5`, selected black on white text. No other hues anywhere.
- Type: Inter (loaded via `<link>` in the root route). Bold headings, regular body, medium buttons/labels.
- Radii: 12px controls, 20px cards, pill search. 8px spacing grid, generous whitespace.
- Outline icons only (Lucide, 2px stroke, consistent sizing). No gradients, no glass, no heavy shadows — one very soft card shadow.
- Motion: short, quiet transitions (opacity/translate, 150–200ms). No bouncy or decorative animation.

## Logo

Recreate the Promptly mark from the brand sheet as an inline SVG component (chat bubble + circuit lines + two dots) with stacked, horizontal and icon-only variants, so it stays crisp and monochrome at every size. The uploaded sheet is reference only.

## Shell & navigation

- Top navigation: logo, compact inline search, Explore/Collections/AI Tools/Pricing links, notifications, avatar menu.
- Left sidebar (Dashboard, Explore, Prompts, Code, AI Tools, Collections, Saved, Settings, Upgrade to Pro) for app pages; marketing pages use nav + footer only.
- Responsive: sidebar collapses to a sheet on mobile.

## Pages

| Page | Content |
| --- | --- |
| Home | Hero "Discover. Build. Share.", large pill search, popular categories grid, trending prompts, featured collections, creators, footer |
| Explore | Filter rail + tabs (All / Prompts / Code / UI / AI Tools), card grid, sort, pagination |
| Search | Query header, result tabs with counts, facet filters, results list, empty state |
| Prompt Details | Prompt body with copy action, model/tags, author card, stats, comments, related |
| Code Details | Code block with language tabs + copy, README-style description, files, author, comments |
| Collections | Collection grid, plus a collection detail view with its items |
| Categories | Category index grid with counts, drilldown into filtered results |
| Creator Profile | Header (avatar, bio, stats, follow), tabs: Prompts / Code / Collections / About |
| Bookmarks | Saved items with type tabs and empty state |
| Notifications | Grouped list, read/unread, mark-all-read |
| Upload Prompt | Multi-step form: details, prompt body, tags/category, visibility, preview |
| Upload Code | Form with language select, snippet editor, file upload dropzone, tags |
| Dashboard | Stat tiles, monochrome activity chart, recent uploads table, quick actions |
| Settings | Sectioned: Profile, Account, Appearance, Notifications, Danger zone |
| Premium | Plan comparison, feature matrix, FAQ — black/white only |
| Authentication | Sign in / sign up split screen with logo panel |
| 404 | Minimal centered not-found |

## Reusable components

Buttons (primary/secondary/outline/ghost/text), Input, Select, Search bar, Dropdown, Checkbox/Radio, Switch, Tabs, Card, Badge, Tag, PromptCard, CodeCard, ShowcaseCard, CommentCard, CreatorCard, Toast (sonner), Modal, Sidebar, TopNav, Footer, Pagination, Filters panel, EmptyState, LoadingState, Skeleton.

Each is built once and reused on every page so screens stay identical in rhythm and density.

## Data

All content is realistic mock data in typed modules (`src/data/*`) — prompts, code snippets, collections, creators, notifications, categories. No backend in this phase; forms validate and show toasts. Auth pages are UI-only. Real accounts, uploads and persistence with Lovable Cloud can be added afterwards.

## Technical notes

- Tokens replace the existing values in `src/styles.css` (`@theme inline` + `:root`, oklch); shadcn components inherit them, no per-component hardcoded colors.
- Routes under `src/routes/` with TanStack file routing: `index`, `explore`, `search`, `prompt/$id`, `code/$id`, `collections`, `collections/$id`, `categories`, `categories/$slug`, `creator/$handle`, `bookmarks`, `notifications`, `upload/prompt`, `upload/code`, `dashboard`, `settings`, `premium`, `auth`.
- Home replaces the placeholder index route. Each route gets its own `head()` with unique title/description/OG tags.
- Detail routes throw `notFound()` for unknown ids and define `errorComponent` + `notFoundComponent`.
- Dark mode is out of scope: the brand is strictly light monochrome.

## Build order

1. Tokens, Inter, logo component, shell (nav/sidebar/footer)
2. Core primitives + card family + states (empty/loading/skeleton)
3. Home, Explore, Search, Categories
4. Detail pages, Collections, Creator profile
5. Bookmarks, Notifications, Uploads, Dashboard, Settings
6. Premium, Auth, 404, consistency pass
