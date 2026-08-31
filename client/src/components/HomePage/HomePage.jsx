import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import SearchResults from "../Search/SearchResults";
import { Input } from "../ui/input";
import useSearch from "../../hooks/useSearch";
import { useAuth } from "../../hooks/useAuth";

const AUTH_ERRORS = {
  access_denied: "Spotify access was not granted.",
  state_mismatch: "The sign-in request expired. Please try connecting again.",
  token_exchange_failed: "Spotify could not complete the connection. Please try again.",
};

export default function HomePage() {
  const { authenticated, error: sessionError } = useAuth();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const search = useSearch(query);
  const authError = AUTH_ERRORS[searchParams.get("auth_error")];

  return (
    <main className="home-screen">
      <section className={authenticated ? "home-hero home-hero--authenticated" : "home-hero"}>
        <h1>{authenticated ? "Welcome!" : "Connect Now"}</h1>
        {authenticated ? (
          <p>
            Browse your Spotify Playlists, Albums, or Liked Songs to access musical information
            from your account.
          </p>
        ) : (
          <>
            <p>
              Connect to Spotify to browse musical information from your Playlists, Albums, Liked
              Songs, or any Album or Song on Spotify.
            </p>
            <p>Alternatively, you can search any Album or Song below.</p>
          </>
        )}

        {(authError || sessionError) && (
          <p className="inline-alert" role="alert">
            {authError || sessionError}
          </p>
        )}

        <div className="home-actions">
          {authenticated ? (
            <>
              <Link className="button button--primary" to="/playlists">
                Playlists
              </Link>
              <Link className="button button--primary" to="/saved-albums">
                Albums
              </Link>
              <Link className="button button--primary" to="/liked-songs">
                Liked Songs
              </Link>
            </>
          ) : (
            <a className="button button--primary" href="/api/auth/start?returnTo=/">
              Connect
            </a>
          )}
        </div>

        <form className="home-search search-form" role="search" onSubmit={(event) => event.preventDefault()}>
          <label className="sr-only" htmlFor="home-music-search">
            Song, artist, or album
          </label>
          <Input
            id="home-music-search"
            name="q"
            type="search"
            maxLength="100"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Start Typing..."
            autoComplete="off"
          />
        </form>

      </section>

      {query.trim() && (
        <div className="home-results">
          <SearchResults
            data={search.data}
            error={search.error}
            loading={search.loading}
            query={search.query}
            retry={search.retry}
          />
        </div>
      )}
    </main>
  );
}
