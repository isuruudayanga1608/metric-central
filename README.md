# Metric Central

Central hub for monthly maintenance metrics and insights — IFS Product & Technology,
Manufacturing & Core, Maintenance & Cloud Services.

This is **Option 1**: the workbook lives in OneDrive/SharePoint and its charts,
dashboards, named ranges or PivotCharts are shown through view-only,
responsive iframe embeds. The website never opens, parses or converts the
workbook. There is no backend and no Microsoft Graph/Entra ID integration in
this phase.

## Tech stack

- React + Vite
- React Router (client-side routing, URL-driven filters)
- Plain JavaScript (no TypeScript)
- CSS Modules
- pnpm — the **only** supported package manager for this project

## Getting started

```bash
pnpm install
pnpm dev
```

Build and preview a production build:

```bash
pnpm build
pnpm preview
```

Lint:

```bash
pnpm lint
```

Do not use `npm` or `yarn` for any of the above — this repo ships a
`pnpm-lock.yaml` and a `packageManager` field in `package.json`, and mixing
package managers will produce an inconsistent lockfile.

`package.json` pins `"packageManager": "pnpm@12.6.0"` — that is the pnpm
version this project was built and tested with (`pnpm --version`). If your
installed pnpm differs, either install `pnpm@12.6.0` (`corepack use
pnpm@12.6.0`) or update the `packageManager` field to match the version you
have installed and mention the change in your PR.

## Project structure

```
metric-central/
  public/
    assets/
      ifs-ai-logo.png        # supplied transparent IFS.ai logo (used as-is)
  src/
    components/              # Header, AnimatedBackground, ActivityCard,
                              # FilterDropdown, FilterBar, ExcelEmbed,
                              # LoadingState, EmptyState, MissingEmbedState,
                              # AccessErrorState, ErrorState
    config/
      activities.js          # single source of truth for every activity
      excelEmbeds.js         # filter -> embed URL mapping (edit this file)
      filters.js             # allowed Year / Month / Environment Type values
    pages/
      LandingPage.jsx
      ActivitiesPage.jsx
      ActivityDashboardPage.jsx
      NotFoundPage.jsx
    services/
      embedResolver.js       # builds mapped-view keys, resolves embed URLs
    styles/
      global.css
      animations.css
    App.jsx
    main.jsx
  staticwebapp.config.json   # SPA fallback routing for Azure Static Web Apps
```

## Routes

| Route | Page |
| --- | --- |
| `/` | Landing page |
| `/activities` | Activity selection |
| `/activities/aks-upgrades` | AKS Upgrades dashboard |
| `/activities/rman-backup-encryption` | RMAN Backup Encryption dashboard |
| `/activities/encryption-at-host-ifs-cloud` | Encryption at Host for IFS Cloud dashboard |
| `/activities/os-patching` | OS Patching dashboard |
| `/activities/encryption-at-host-apps10` | Encryption at Host for Apps10 dashboard |
| anything else | Not-found page |

Every route is directly openable and refresh-safe. `staticwebapp.config.json`
configures the SPA fallback so a deep link like
`/activities/aks-upgrades?year=2026&month=January&environment=Production`
still resolves after a hard refresh on Azure Static Web Apps. An unknown
`:activityId` renders an "activity not available" message — it never falls
back to showing a different, unrelated activity.

## Filters and the URL

Year, Month and Environment Type are stored in the URL query string, e.g.:

```
/activities/aks-upgrades?year=2026&month=January&environment=Production
```

- Filtered URLs are shareable and survive a browser refresh.
- An invalid/unrecognized query value is dropped rather than acted on.
- Switching the Activity filter navigates to the new activity's route while
  preserving any valid Year/Month/Environment Type already selected.
- **Reset Filters** removes `year`, `month` and `environment` from the URL
  but keeps the current activity route.
- Browser Back/Forward correctly restores the filters that were active at
  that point in history, because they live in the URL rather than in
  component-only state.

## Important limitation: the website filters cannot reach inside Excel

A normal HTML `<select>` cannot control content inside a **cross-origin**
Excel Online iframe — the browser's same-origin policy prevents it, and
there is no supported public API for it either. This app does **not**
pretend otherwise: it does not build "fake" filters that look functional but
do nothing.

Instead, Year/Month/Environment Type select **which pre-approved Excel view
to embed** (`filterMode: "mapped-views"`, see below). If you want the
external dropdowns to feel like they are "filtering" the chart, you must
create one Excel view per filter combination you want to support and map it
in `src/config/excelEmbeds.js`.

## Filter-to-embed mapping (`src/config/excelEmbeds.js`)

```js
export const excelEmbedConfig = {
  "aks-upgrades": {
    displayName: "AKS Upgrades",
    pageTitle: "AKS UPGRADES",
    filterMode: "mapped-views",
    defaultEmbedUrl: "",
    views: {
      "2025-January-Production": "",
      "2025-January-Non-Production": "",
      // ...
    },
  },
  // ...
};
```

- The lookup key is built by `buildViewKey(year, month, environmentType)` in
  `src/services/embedResolver.js` as `` `${year}-${month}-${environmentType}` ``
  with spaces in the environment type replaced by hyphens, e.g.
  `2026-January-Non-Production`.
- Leave a combination's value as `""` (or the placeholder text
  `PASTE_APPROVED_EXCEL_EMBED_URL_HERE`) until you have a real, approved,
  view-only embed URL for it. The dashboard will show "No Excel dashboard
  view has been configured for the selected filters." instead of guessing.
- All mapping logic lives in `embedResolver.js` — pages call
  `resolveEmbedView(activityId, { year, month, environment })` rather than
  re-implementing the key-building or placeholder-detection logic.
- Supporting 5 activities × 2 years × 12 months × 2 environment types would
  mean up to **240 individual mapped views**. Start with the combinations
  you actually need (e.g. the current and previous month) rather than
  pre-filling every cell.

### Alternative: one dashboard per activity with Excel-native slicers

Instead of many mapped views, you can build **one Excel dashboard per
activity** with Excel-native slicers for Year, Month and Environment Type,
and embed that single dashboard. Set that activity's `filterMode` to
`"excel-native"` and populate `defaultEmbedUrl` with the dashboard's embed
URL.

This is documented as a future/opt-in mode
(`src/services/embedResolver.js` already understands it) because of an
important trade-off: **the external HTML filters will not control an
Excel-native dashboard.** Visitors would filter using the slicers rendered
inside the Excel embed itself, not the website's dropdowns. Do not enable
`"excel-native"` for an activity and also claim the website filters drive it.

## Preparing the workbook

Recommended workbook name: `MetricCentral.xlsx`.

`workbook-source/MetricCentral.xlsx` in this repo is a starting-point example
(not something the site reads — see the limitation above). It has one flat
`Metrics` sheet (`Year, Month, EnvironmentType, Activity, MetricName,
MetricValue, TargetValue, Unit, LastUpdated`), plus two formula helper
columns (`Completed = MetricValue`, `NotCompleted = MAX(TargetValue -
MetricValue, 0)`), and 8 native bar charts — one per Activity ×
Environment Type for the latest month present (2026 / June) — each plotting
Status (Completed / Not Completed) on the category axis and Count on the
value axis. Note the source data has no rows yet for "Encryption at Host for
Apps10" — add them before building a chart for that activity. Use this file
as the template: open it, verify/extend the data, then follow the OneDrive/
SharePoint steps below to publish each chart you want embedded and paste its
URL into `src/config/excelEmbeds.js` under the matching
`{year}-{month}-{environment}` key.

Recommended worksheets (one per activity):

- AKS Upgrades
- RMAN Backup Encryption
- Encryption at Host IFS Cloud
- OS Patching
- Encryption at Host Apps10

Recommended named chart/range conventions, so it's obvious what each embed
points to:

- `AKS_2025_January_Production`
- `AKS_2025_January_NonProduction`
- `AKS_2026_January_Production`
- `RMAN_2026_February_Production`
- `OSPatching_2025_March_NonProduction`
- `Apps10Encryption_2026_April_Production`

## Publishing to OneDrive/SharePoint and getting an embed URL

The authorized workbook owner should:

1. Save/upload `MetricCentral.xlsx` to OneDrive or SharePoint.
2. Open it and confirm it renders correctly in **Excel for the web**.
3. Set the workbook (or the specific item being shared) to **view-only**
   sharing — not an editing link.
4. Select the chart, named range, PivotChart, or worksheet dashboard section
   to embed.
5. Generate the "Embed" view for that selection (Excel for the web ->
   File > Share > Embed, or the equivalent for the named item) to get an
   `<iframe>` embed URL.
6. **Test the URL in a private/incognito browser window** — this is the best
   way to check whether it truly works without a sign-in prompt for an
   anonymous visitor.
7. Paste the tested URL into the matching key in
   `src/config/excelEmbeds.js`.
8. Run `pnpm build`.
9. Redeploy the site.

Never use:

- A normal editing link.
- A URL you haven't verified in a private/incognito window.
- An editable "anyone with the link can edit" sharing URL.
- A local `C:\` file path.
- An access token, Graph token, client secret or password embedded anywhere
  in the URL or in this repo.
- A temporary/session-bound browser URL that isn't a real, durable, shared
  embed link.

## Authentication and access

Metric Central itself has **no sign-in page** in this phase — there is no
Microsoft Entra ID (or any other) authentication wired into the site.
Anyone who has the website's URL can open it.

The embedded Excel content can load without a sign-in **only if** the
OneDrive/SharePoint item has been shared as an approved, anonymous,
view-only ("Anyone with the link can view") embed. If anonymous access to
the workbook is blocked by your organization's policy:

- The app does **not** attempt to bypass that restriction.
- No credentials are ever placed in the frontend code to work around it.
- Instead, the dashboard shows: *"This Excel dashboard could not be
  displayed. The workbook may require permission or sign-in."*
- Organizational approval for anonymous sharing, or a future authenticated
  integration (e.g. Entra ID + Microsoft Graph), may be required to fully
  resolve this for a given workbook.

**Do not** describe Metric Central as restricted to IFS employees unless a
real, tested access-control mechanism is actually in place. Without
authentication, only publish information that is approved for anyone with
the link to see — never confidential, customer, personal, credential,
security, or other restricted/sensitive information, and never a workbook
with hidden sensitive worksheets, formulas or comments.

## How data updates reach the site

Normal metric updates happen entirely in Excel:

1. An authorized editor opens the workbook in OneDrive/SharePoint.
2. They update the metric values.
3. Excel recalculates formulas and charts.
4. They save the workbook.
5. A visitor opens or refreshes Metric Central (or clicks **Refresh Data**).
6. The iframe re-requests the Excel-hosted view.
7. The latest saved chart/dashboard appears — no website code change or
   redeployment is required for a values-only update.

A website change **and redeployment** are required when:

- A new activity, filter option, or mapped view is added.
- An embed URL is added or changed.
- A named Excel item is renamed.
- The workbook is moved.
- A route or the site's UI changes.

Metric Central does not read a "Last Updated" cell/column from the
workbook — it isn't parsing the file at all. If you need a visible "data
last updated" indicator, either show it inside the embedded Excel view
itself, or maintain it as separate, manually-updated text outside the
embed.

## Refresh Data behavior

Every dashboard has a **Refresh Data** button. It:

- Reloads only the embedded iframe (via a changing React key), not the
  whole single-page app.
- Shows a loading indicator while the iframe reloads.
- Updates a local "View refreshed: …" timestamp once the iframe's `load`
  event fires.
- Never modifies the embed URL/query parameters that came from
  `excelEmbeds.js`.

## Application states

| State | When | Message |
| --- | --- | --- |
| Initial | Year/Month/Environment Type not all selected yet | "Select the year, month, and environment type to view metrics." |
| Loading | Iframe is loading | "Loading Excel dashboard…" |
| Missing configuration | Filters complete, but no embed URL mapped | "No Excel dashboard view has been configured for the selected filters." |
| Access/sign-in | Visitor reports a sign-in prompt inside the embed | "This Excel dashboard could not be displayed. The workbook may require permission or sign-in." |
| Unsupported activity | `:activityId` doesn't match a known activity | "The requested activity is not available." |
| General error | Iframe hasn't loaded within a reasonable timeout | "The Excel dashboard could not be loaded." (with **Try Again**) |

Because a cross-origin iframe cannot report *why* it failed to the parent
page, Metric Central does not guess: it waits a reasonable amount of time
before treating a slow load as an error, offers a manual retry, and lets a
visitor self-report a sign-in wall they can see but the page cannot detect.

## Accessibility

- Semantic HTML, real `<a>`/`<Link>` and `<button>` elements throughout — no
  clickable `<div>`s.
- Full keyboard navigation with visible focus rings.
- Native `<select>` elements with associated `<label>`s for all filters.
- Descriptive `title` attributes on every embedded iframe.
- Alternative text on the IFS.ai logo.
- `prefers-reduced-motion` is respected: entrance/hover animations are
  disabled or reduced.
- Loading and error messages use `aria-live` regions.

## What was intentionally left out of this Option 1 build

Per the Option 1 requirements, this project does **not** include:

- SheetJS / `xlsx` browser parsing
- Chart.js / `react-chartjs-2`
- Excel-to-JSON conversion
- Microsoft Graph calls
- Any local (`C:\`) workbook access
- A backend, workbook parsing service, or workbook sync script
- Microsoft Entra ID / any authentication flow
