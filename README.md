# songseekr

songseekr turns Spotify catalog and library data into music-practice references. Search for a
track, inspect its detected key when Spotify makes audio features available, and open matching
pentatonic scale, chord, and guitar-fretboard diagrams.

## Architecture

- React 18 and Vite client in `client/`
- Express API in `server/`
- Spotify Authorization Code flow with access and refresh tokens stored only in HttpOnly cookies
- Same-origin API proxy for catalog search, tracks, albums, playlists, liked songs, and saved albums
- One Express application shared by local Node and the Vercel function in `api/index.js`

The browser never receives the Spotify client secret or stores Spotify tokens in local storage.
Catalog pages are public. Spotify library pages require a connected account.

## Prerequisites

- Node 22.23.1 (see `.nvmrc`)
- npm
- A Spotify developer application

In the Spotify developer dashboard, add this local redirect URI exactly:

```text
http://127.0.0.1:3000/api/auth/callback
```

For production, add the equivalent HTTPS URI, for example
`https://www.songseekr.com/api/auth/callback`. Spotify redirect URIs must exactly match the value
used by the application.

## Local setup

```bash
nvm use
npm install
npm install --prefix client
cp .env.example .env
npm run dev
```

Set `CLIENT_ID` and `CLIENT_SECRET` in the root `.env`. Do not put a client secret in `client/.env`
or any `VITE_` variable; Vite variables are shipped to the browser.

The client runs at `http://127.0.0.1:3000`, proxies `/api` to the Express server at
`http://127.0.0.1:3001`, and infers the callback URL from the incoming request. Set
`SPOTIFY_REDIRECT_URI` only when that inference does not match your registered Spotify URI.

## Commands

```bash
npm run dev      # API and Vite development servers
npm run lint     # client ESLint, including hooks and accessibility rules
npm test         # server and client tests
npm run build    # production client build
npm run check    # lint, tests, and production build
npm start        # serve the API and an existing client/build directory
```

## Deployment

`vercel.json` builds `client/build`, serves browser routes through `index.html`, and sends `/api/*`
to the shared Express function. Configure `CLIENT_ID`, `CLIENT_SECRET`, and optionally
`SPOTIFY_REDIRECT_URI` as encrypted project environment variables. Do not commit `.env` files.

After changing an OAuth redirect URI, update both Vercel and the Spotify developer dashboard.
Deployments should run the same `npm run check` command used by CI before release.

## Spotify API limitations

Spotify may deny Audio Features access to newer development-mode applications or omit features
for individual tracks. songseekr treats `403` and `404` feature responses as unavailable and keeps
the rest of the catalog or library page usable. Playlist items use Spotify's current `items`
endpoint and retain a compatibility fallback for older accounts.

Spotify sessions can expire or be revoked. When refreshing is no longer possible, songseekr clears
its session cookies and asks the user to reconnect.

## Privacy and security

- OAuth state is random, short-lived, HttpOnly, SameSite=Lax, and verified on callback.
- Spotify access and refresh tokens are scoped to `/api` cookies and are never exposed to React.
- API requests are rate-limited and outbound Spotify requests time out.
- Responses include CSP, clickjacking, MIME-sniffing, referrer, and permissions protections.
- Disconnecting clears songseekr's local session cookies. Spotify account access can also be
  revoked from the user's Spotify Apps settings.

songseekr does not maintain its own user database. It processes Spotify catalog and library data
to render the requested page and does not intentionally persist that data server-side.

## License

MIT — see [LICENSE](LICENSE).
