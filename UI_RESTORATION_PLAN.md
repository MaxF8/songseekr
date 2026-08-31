# SongSeekr UI Restoration Plan

Status: **planning only — no UI implementation is authorized yet**  
Prepared: 2026-08-30  
Approval required before any item below is implemented.

## 1. Goal

Restore SongSeekr's original identity and page compositions as closely as possible while retaining the backend, security, routing, accessibility, responsive behavior, and useful data presentation added during the recent rebuild.

The four supplied screenshots are the primary visual source of truth. The checked-in original source is secondary evidence. When the current redesign conflicts with those screenshots, the screenshots win.

The intended result should feel like the original SongSeekr made more reliable and usable—not like a newly generated dashboard, SaaS landing page, or design-system demo.

## 2. Non-negotiable product decisions

1. Restore the original dark navy, bright blue, white, and muted gray visual language.
2. Restore the SongSeekr icon and lowercase underlined `songseekr` wordmark in the header.
3. Restore the original desktop navigation structure and a proper hamburger/close-icon mobile menu.
4. Keep a functional search field on the front page.
5. Search must run while the user types, not require a Search-button click.
6. Restore the full About page: `max3` portrait, About Me copy, and Portfolio/LinkedIn/GitHub links.
7. Restore the compact original song-detail composition with the song identity on the left and musical references on the right.
8. Keep the current album-detail track table as the basis for album track presentation; it is the strongest part of the new UI.
9. Do not place album/playlist previous/next arrows at the top of a page. Any real pagination belongs below its list and uses plain text controls.
10. Display an official Spotify logo on every page/surface that displays Spotify-sourced information.
11. Use shadcn components where they improve behavior and accessibility, but restyle them to SongSeekr. shadcn must not dictate the site's appearance.
12. Preserve the rebuilt server-side Spotify session, API proxy, security work, routes, error handling, and tests. This is a visual restoration, not a technical rollback.
13. No broad redesign or new visual concept will be introduced without explicit approval.

## 3. Audit performed

The current app was inspected in source and in a running browser at desktop and 375 px mobile widths. The audit covered:

- Public home, empty search, populated search, About, song detail, album detail, and 404 source.
- Unauthenticated protected-route state for playlists/library pages.
- Desktop and mobile navigation, including the open mobile menu.
- Search interaction before and after clicking Submit.
- Album track-table width and mobile wrapping.
- Current loading, error, empty, pagination, and Spotify-attribution components.
- Original navigation, home, login, search, colors, spacing, button styles, and logo assets from Git history.
- The supplied original screenshots for home/connect, search, song detail, and About.

### Confirmed regressions

| ID | Severity | Area | Confirmed problem | Required correction |
| --- | --- | --- | --- | --- |
| UI-01 | Critical | Brand | The icon and lowercase wordmark were replaced by plain `SongSeekr` text. | Restore the original icon plus underlined lowercase wordmark and make the full mark link home. |
| UI-02 | Critical | Global style | Most content was moved to a pale radial-gradient page with generic panels, large radii, shadows, and tight display typography. | Return the page canvas to solid original navy and use restrained light surfaces only where data or diagrams require them. |
| UI-03 | High | Home | The original Connect/home composition was replaced and the front-page search was removed or reduced to a submit form in different iterations. | Rebuild the screenshot composition and keep a real typeahead input on the front page. |
| UI-04 | Critical | Search | Typing `Little Wing` produced no request or results; results appeared only after clicking Search. | Search automatically after typing with debounce and stale-request cancellation. |
| UI-05 | High | Search | The simple original search screen became a large heading, explainer, panel, empty-state copy, and excessive blank light space. | Return to one centered input on navy; show compact results only after a query exists. |
| UI-06 | Critical | Mobile nav | The current `Menu`/`Close` text dropdown is short, overlays page content, and does not reproduce the original hamburger experience. | Use icon controls and a full-height dark Sheet/drawer with correct focus, scroll, and close behavior. |
| UI-07 | Critical | Song detail | The original compact two-column dark page became a large light hero followed by a long vertical reference page. | Restore the original side-by-side desktop composition and compact responsive stacking. |
| UI-08 | Critical | About | The portrait, personal bio, and all three links are gone; only two short lines remain. | Restore the supplied About screenshot content and `max3` portrait. |
| UI-09 | High | Data pages | Album/library pages inherited the generic pale hero, eyebrow labels, oversized titles, and card styling. | Put the approved table/data structures inside the original navy visual shell. |
| UI-10 | Medium | Navigation | The user reports arrows at the top of album/playlist screens. The audited branch currently has text pagination only at the bottom, but this must be locked against regression. | No top navigation arrows. Contextual back navigation, if truly needed, is a small text link near the page title; pagination remains below data. |
| UI-11 | High | Spacing | Large heading scales and generic `min-height`/panel centering create awkward empty areas. | Use content-driven vertical rhythm matching the screenshots and keep the footer naturally at the bottom without stretching a small message into a giant hero. |
| UI-12 | High | Spotify attribution | The current global official logo is a good start, but Spotify attribution must remain associated with every Spotify-data page and search result surface. | Retain the unmodified official logo and add local attribution where data appears, as specified below. |
| UI-13 | Medium | Copy | Labels such as `SPOTIFY CONNECTION REQUIRED`, decorative eyebrow text, and marketing-style headings make a small utility feel overproduced. | Use the original direct copy and only labels that help complete a task. |
| UI-14 | Medium | UI states | Loading, errors, empty results, auth gates, and 404 currently inherit the oversized generic panel treatment. | Keep these states short, dark, readable, and consistent with the original app. |

## 4. Visual contract

This section is the guardrail against another visual replacement.

### Color

Use the original palette as named tokens:

- Canvas/navigation: `#101522`
- Primary action blue: `#0467FB`
- Secondary/focus blue: `#4B59F7`
- Main text: `#FFFFFF`
- Muted text: approximately `#A9B3C1`, adjusted only to pass WCAG contrast
- Light surfaces: white or near-white, only for search results, data tables, and the supplied musical-reference images
- Subtle dark borders: a restrained blue-gray derived from the original palette

Remove the current radial gradient, translucent/blurred header treatment, decorative glows, and broad light-gray page canvas.

### Typography

- Restore the original Source Sans Pro-style type treatment, using a reliable local/system fallback if the font is unavailable.
- Use normal tracking. Remove the current heavy negative letter spacing.
- Desktop page titles should usually be 32–48 px, not 70–90 px.
- Body text should remain approximately 18–24 px on large screens and 16–18 px on mobile, depending on context.
- Keep headings direct: `Connect Now`, `About Me`, `Chords in Key`, `Pentatonic Shapes`, `Pentatonic Fretboard`, and route/data names.

### Shape and elevation

- Original action buttons: simple blue rectangles, approximately 5 px radius.
- Inputs: small radius, clear blue focus ring, no exaggerated shadow.
- Data containers: modest border/radius only where a boundary is needed.
- Do not wrap every section in a card.
- Do not use nested panels, glassmorphism, gradients, oversized pills, or decorative shadows.

### Spacing

- Header remains about 90 px high, as in the original source/screenshots.
- Desktop page gutters should feel like the screenshots rather than a narrow centered SaaS column.
- Empty space is allowed when it supports the original composition, but it must not come from giant headings, arbitrary `min-height`, or a footer forced far away from the content.
- Mobile gutters should generally be 16–20 px.

### Copy standard

- Prefer short functional text over promotional copy.
- Do not add invented taglines, feature claims, “eyebrow” labels, or explanations that the task does not need.
- Keep the original personality and personal About copy intact.

## 5. Shared shell and navigation

### Desktop header

Recreate the supplied header:

- Left: original square SongSeekr icon plus underlined lowercase `songseekr` wordmark.
- Right, logged out: `Connect`, `Search`, `About` as simple original-blue buttons.
- Right, logged in: `Home`, `Playlists`, `Albums`, `Liked Songs`, `Search`, `About`, and `Log Out`, with the least-used items allowed to become plain links if all-blue buttons become crowded.
- Solid navy background; no blur or frosted border.
- Current-route indication uses an underline or subtle border, not a pill.
- Logo and wordmark are one home link with an accessible name.

The exact legacy icon asset will be restored from the repository rather than regenerated.

### Mobile header/menu

Use a shadcn `Sheet` for behavior, styled to reproduce the original menu:

- Keep the icon/wordmark visible in the header.
- Replace the `Menu` and `Close` text boxes with a hamburger icon and X icon.
- Open a full-height navy drawer rather than a 192 px dropdown.
- Use large, simple stacked links and one blue connection/logout action.
- Close on link activation, X, Escape, or outside click.
- Trap focus while open, restore focus to the trigger on close, lock background scroll, and expose correct `aria-expanded`/dialog labels.
- No content underneath may be covered by a partially open menu.

## 6. Route-by-route restoration

### `/` — public home/connect

Use the supplied original Connect screenshot as the composition:

- Original header and dark canvas.
- Centered `Connect Now` heading.
- Original explanation about connecting Spotify.
- Primary `Connect` button.
- Keep search directly on the front page. A compact `Start Typing...` input appears under the alternative-search sentence; it must not be replaced by only a link or button.
- Results may open directly under that input or navigate to `/search?q=...` while preserving the query, but visible matches must update as the user types.
- Avoid the current giant `Connect with Spotify` hero and avoid forcing the footer far below a short block of content.

### `/` — authenticated home

Use the original `Welcome!` structure from the old source:

- Direct sentence about browsing Playlists, Albums, or Liked Songs.
- Simple blue actions for `Playlists`, `Albums`, and `Liked Songs`.
- Keep the same front-page typeahead search available.
- No dashboard cards, metrics, feature tiles, or new marketing copy.

### `/search`

Use the supplied original search screenshot as the empty state:

- Solid navy page.
- One centered white input with `Start Typing...` placeholder.
- No page title, eyebrow, instructions panel, or empty-state card before typing.
- Begin searching after one non-whitespace character, matching the supplied one-letter Spotify example.
- Debounce requests by about 250 ms.
- Cancel superseded requests so slower old results cannot replace a newer query.
- Keep `?q=` synchronized with the current query via history replacement while typing; direct links must load that query.
- Clear results when the input becomes empty.
- Provide keyboard navigation and visible focus without adding visible arrow controls to the page.
- Enter may activate the highlighted result, but must not be required to start the search.

When results exist:

- Group `Songs` and `Albums` in a simple bounded result region under the input.
- Use compact rows with artwork, name, and secondary artist/type text.
- Use the current useful data-fetching and routing logic; do not restore fragile client-side Spotify credentials.
- Include official Spotify attribution at the bottom of the results surface, matching the supplied Spotify example.
- Avoid a grid of oversized rounded cards unless testing shows it is materially easier to scan than rows.

### `/songs/:trackId`

Recreate the supplied original song-detail screenshot:

- Full navy page with the original header.
- Desktop: a balanced two-column layout.
- Left: square album art, underlined song title link, linked artist name, `Key`, and `Mode`.
- Right: `Chords in Key`, `Pentatonic Shapes`, and `Pentatonic Fretboard` in the compact original order.
- Keep the correct enharmonic key display and the rebuilt data/error handling.
- Keep chart images crisp, contained, uncropped, and readable.
- Do not use the current light hero, oversized title, eyebrow labels, or three long full-width sections.
- Center the official Spotify logo near the bottom of the song data, as in the screenshot.

Responsive behavior:

- Stack song identity before musical references below the desktop breakpoint.
- Keep album art bounded rather than full-viewport width.
- Allow chord/reference graphics to scale to container width without horizontal page overflow.
- Preserve readable labels and avoid excessive vertical gaps between diagrams.

### `/albums/:albumId`

This is the explicit hybrid page:

- Restore the original navy shell and compact album identity treatment.
- Preserve the current album-detail track table's information architecture: `Track`, `Artist`, `Key`, `Length`.
- Preserve linked track names, enharmonic key labels, duration formatting, and mobile removal of the Length column.
- Restyle the table to look intentional on navy: a restrained light table surface with modest borders and no generic dashboard hero above it.
- Keep album artwork, album name, artist, release date, and `Open album in Spotify` link.
- Do not keep the current 70+ px compressed title or `ALBUM` eyebrow.
- If an album exceeds one API page, place `Previous`, `Page n of n`, and `Next` below the table. Do not use top arrows or floating chevrons.
- Include official Spotify attribution adjacent to/below the Spotify-sourced album content.

### `/playlists`, `/saved-albums`, `/liked-songs`

- Return to the original dark library-browsing feel.
- Keep current server-backed pagination, loading/error handling, and responsive data components.
- Use compact album/playlist artwork rows or a restrained grid; do not use large floating cards.
- Preserve the current table for track-heavy screens.
- Keep controls below content; no top previous/next arrows.
- Use the original nav labels (`Playlists`, `Albums`, `Liked Songs`) even though the internal saved-album route is `/saved-albums`.
- Include official Spotify attribution on every populated library page.

### `/playlists/:playlistId`

- Use the same hybrid treatment as album detail: compact dark playlist header plus the approved track table.
- Retain playlist art, owner/description where available, track count, and Spotify link without creating an oversized marketing hero.
- Keep bottom-only pagination and local Spotify attribution.

### `/about`

Restore the supplied About screenshot rather than rewriting it:

- Solid navy page.
- Use the local `max3.jpeg` boardwalk portrait shown in the screenshot.
- Centered `About Me` heading.
- Restore the two original paragraphs:
  - Introduction: Max Friedman and the BS in Computer Science.
  - Purpose: SongSeekr was made to support guitar playing with favorite tracks and be useful to others.
- Restore `Links` with Portfolio, LinkedIn, and GitHub.
- Keep the modest original layout and text width; do not turn it into a biography card, timeline, resume grid, or project-marketing page.

The current portrait files are deliberately ignored as “unused legacy assets.” During approved implementation, `max3.jpeg` must be moved to a tracked asset location (or explicitly unignored), optimized, and given useful alt text. The final Portfolio and LinkedIn URLs are not present in the audited repository and must be confirmed before those links are shipped. The GitHub remote indicates `https://github.com/MaxF8`, but that URL should still be confirmed with the other links.

### Auth-required, loading, error, empty, and 404 states

- Keep server-side authentication and current retry/reconnect behavior.
- Replace giant centered light panels with compact dark-page messages.
- Use direct headings such as `Connect to view your library` and one blue action.
- Use shadcn `Alert` and `Skeleton` only for accessible behavior and consistent spacing; visually restyle them to SongSeekr.
- Keep errors actionable and do not expose raw server details.
- Keep the 404 useful, but remove the oversized joke-card presentation.

## 7. Search-as-you-type specification

This behavior is an acceptance requirement, not an optional enhancement.

1. One shared `SearchTypeahead` behavior powers both the home input and `/search`.
2. A trimmed query of one or more characters schedules a request after roughly 250 ms.
3. A new keystroke cancels the previous scheduled/requested search.
4. Only the response matching the latest query may update the screen.
5. Loading feedback is subtle and does not replace the input.
6. Existing results may remain visible while a new request is pending, with a small loading indicator, to prevent layout flashing.
7. Empty results say `No songs or albums found.` in the result region only.
8. Escape clears an open suggestion/result popover; the clear action empties results and the URL query.
9. Up/down keyboard behavior, active-descendant state, Enter activation, and screen-reader result count are supported.
10. Home and `/search` share result-row styling and API semantics so they cannot drift again.

## 8. Spotify attribution and content rules

The current official `Full_Logo_White_RGB.svg` asset should be retained unmodified.

- Every page that renders Spotify songs, albums, playlists, artwork, or user-library data displays the official Spotify logo in that page's data area or immediately below it.
- Search results include the logo in the result surface, as shown in the supplied example.
- Song detail centers the logo below the musical information, as shown in the original screenshot.
- Album, playlist, liked-song, and library pages place it below the populated list/table.
- The global footer may remain as a site-wide fallback, but it does not replace local attribution when data is displayed inside a bounded results surface.
- Keep the official logo's proportions, colors, and clear space. Do not recolor, crop, stretch, mask, or combine it with the SongSeekr logo.
- Keep relevant `Open in Spotify` links for albums/tracks/playlists.
- Do not place controls or text over Spotify artwork. Preserve the source artwork aspect ratio and avoid unnecessary cropping.
- Keep the independent-tool/non-affiliation statement concise in the global footer.

## 9. shadcn adoption plan

No shadcn/Tailwind packages or generated files will be added until this plan is approved.

After approval, initialize shadcn for the existing Vite React client and add only the components actually used:

| shadcn primitive | SongSeekr use | Visual constraint |
| --- | --- | --- |
| `Button` | Connect, nav actions, retry, logout, pagination | Original blue rectangle, small radius; no pill treatment. |
| `Input` | Home and search typeahead | White input, original compact dimensions, blue focus ring. |
| `Sheet` | Mobile navigation | Full-height navy menu reproducing the original hamburger behavior. |
| `Table` | Album, playlist, and liked-song track lists | Preserve the current approved columns/density and responsive behavior. |
| `Separator` | Subtle nav, results, and table boundaries | Low-contrast functional lines only. |
| `Alert` | Auth/error/empty messages | Compact and dark; never a giant card. |
| `Skeleton` | Artwork and row loading | Quiet placeholders that do not reflow the page. |
| `Pagination` or `Button` pair | Paged library data | Text `Previous`/`Next` below content, no top arrows. |

Components intentionally not planned: generic `Card` wrappers for every section, carousel, hero, badge-heavy UI, dashboard navigation, breadcrumb bars, and decorative dialogs.

shadcn is source code in this repository, so its classes and tokens will be edited to the exact SongSeekr contract above rather than retaining the default theme.

## 10. Responsive and accessibility requirements

- Verify at 375, 768, 1024, 1440, and approximately 2048 px widths.
- No horizontal page overflow.
- Preserve at least 44×44 px touch targets for icon buttons and primary actions.
- Visible keyboard focus on every interactive element.
- Correct heading order and landmark structure.
- Menus, result lists, alerts, tables, and pagination have useful accessible names.
- Album art uses informative alt text when it conveys identity; purely duplicated images may use empty alt text.
- Respect `prefers-reduced-motion`; the menu may slide, but no decorative motion is added.
- Ensure original muted-gray text meets WCAG AA against navy.
- Tables retain semantic headers and remain understandable when the Length column is hidden on mobile.

## 11. Implementation sequence after approval

### Phase 1 — Freeze reference and tokens

- Save the supplied screenshots as the visual baseline outside production assets.
- Restore the exact SongSeekr logo asset.
- Introduce original color/type/spacing tokens and remove the current gradient/display-theme rules.
- Initialize the minimum shadcn setup and theme its primitives.

Checkpoint: desktop and mobile header plus a token sample are shown for visual approval before route work continues.

### Phase 2 — Shared shell, home, and search

- Rebuild desktop/mobile navigation.
- Restore public and authenticated home compositions.
- Implement the shared search-as-you-type behavior.
- Restore the minimal `/search` screen and compact result presentation.

Checkpoint: home, open mobile menu, empty search, and populated search screenshots are compared with the supplied references.

### Phase 3 — Album and library data pages

- Port the approved current `TrackTable` to shadcn Table without changing its useful columns.
- Restore dark album/playlist/library shells.
- Keep responsive tables and bottom pagination.
- Remove any top arrow navigation that appears during branch reconciliation.

### Phase 4 — Song detail, About, and attribution

- Restore the original two-column song detail and responsive stack.
- Restore `max3` About portrait, copy, and confirmed links.
- Apply route-local Spotify attribution consistently.

### Phase 5 — States and verification

- Restyle auth gates, loading, errors, empty results, and 404.
- Run unit/integration tests, lint, and production build.
- Browser-test every route at desktop and mobile widths.
- Verify keyboard-only search/menu flows and Spotify attribution.
- Compare final screenshots against the four supplied originals and this document.

## 12. Expected implementation footprint

The likely files/components to change after approval are:

- `client/src/styles/app.css` and shadcn theme/token files.
- `client/src/components/NavBar/NavBar.jsx`.
- `client/src/components/HomePage/HomePage.jsx`.
- `client/src/components/Search/Search.jsx` plus one shared typeahead component/hook.
- `client/src/components/ui/TrackTable.jsx`, `Pagination.jsx`, and `AsyncState.jsx`.
- Album, playlist, liked-song, song-detail, About, and NotFound page components.
- Footer/Spotify attribution component(s).
- Restored SongSeekr logo and tracked/optimized About portrait assets.
- Focused interaction and responsive tests.

Server OAuth/session/API files are explicitly out of scope unless a UI test reveals a real integration defect.

## 13. Acceptance checklist

Implementation is complete only when all statements below are true:

- [ ] The four supplied screenshots are recognizable as the direct visual ancestors of the finished routes.
- [ ] Navy/blue/white original colors dominate every page; no global pale gradient remains.
- [ ] Original icon plus lowercase underlined `songseekr` wordmark is visible on desktop and mobile.
- [ ] Desktop nav matches the original structure.
- [ ] Mobile uses a hamburger/X and full-height dark menu without obscuring content incorrectly.
- [ ] Front-page search is visible and returns results while typing.
- [ ] `/search` begins searching after one character without a required submit click.
- [ ] Search is race-safe, keyboard accessible, URL-synchronized, and usable on mobile.
- [ ] Song detail uses the compact original two-column desktop layout.
- [ ] About contains the `max3` portrait, original copy, and three confirmed links.
- [ ] The current album-detail track table's useful columns and responsive behavior are preserved.
- [ ] No album/playlist navigation arrows appear at the top of a page.
- [ ] Real pagination, when needed, is below its data.
- [ ] Every Spotify-data page/surface carries an unmodified official Spotify logo and relevant Spotify link.
- [ ] No decorative cards, gradients, glass blur, giant eyebrow text, fake metrics, or invented marketing copy were introduced.
- [ ] Existing backend/security/tests remain intact and all tests/build checks pass.
- [ ] Desktop and mobile browser screenshots have been reviewed before handoff.

## 14. Approval items

Approval of this document authorizes implementation of the restoration above, including the minimal shadcn setup. It does not authorize a different redesign.

Before the About links are finalized, the exact Portfolio, LinkedIn, and GitHub URLs must be confirmed. Everything else can proceed from the supplied screenshots and existing application behavior once this plan is approved.

