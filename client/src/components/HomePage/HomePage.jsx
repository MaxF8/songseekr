import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import useArtworkTheme from "../../hooks/useArtworkTheme";

const AUTH_ERRORS = {
  access_denied: "Spotify access was not granted.",
  state_mismatch: "The sign-in request expired. Please try connecting again.",
  token_exchange_failed: "Spotify could not complete the connection. Please try again.",
};

export default function HomePage() {
  const { authenticated, error: sessionError } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const authErrorCode = searchParams.get("auth_error");
  const authError = authenticated ? undefined : AUTH_ERRORS[authErrorCode];

  useEffect(() => {
    if (!authenticated || !authErrorCode) return;

    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.delete("auth_error");
    setSearchParams(nextSearchParams, { replace: true });
  }, [authenticated, authErrorCode, searchParams, setSearchParams]);

  useArtworkTheme(undefined, "home-route");

  return (
    <main className="song-page home-screen home-index-page">
      <header className="song-hero library-index-hero home-index-hero">
        <div className="song-hero__inner library-index-hero__inner home-index-hero__inner">
          <div className="song-hero__copy">
            <h1 className="song-hero__title">{authenticated ? "Welcome!" : "Connect Now"}</h1>
          </div>
        </div>
      </header>

      <section className="song-page__body home-index__body">
        <div className="home-index__content">
          <div className="home-index__intro">
            {authenticated ? (
              <p>
                Browse your Playlists, Albums, or Liked Songs to access musical information from
                your account.
              </p>
            ) : (
              <p>
                Connect to browse musical information from your Playlists, Albums, or Liked Songs.
              </p>
            )}

            {(authError || sessionError) && (
              <p className="inline-alert" role="alert">
                {authError || sessionError}
              </p>
            )}

            <div className="home-actions">
              {authenticated ? (
                <>
                  <Link className="button button--primary home-action-button" to="/playlists">
                    Playlists
                  </Link>
                  <Link className="button button--primary home-action-button" to="/saved-albums">
                    Albums
                  </Link>
                  <Link className="button button--primary home-action-button" to="/liked-songs">
                    Liked Songs
                  </Link>
                </>
              ) : (
                <a
                  className="button button--primary home-action-button"
                  href="/api/auth/start?returnTo=/"
                >
                  Connect
                </a>
              )}
            </div>

            <div className="home-search-action">
              <Link className="button home-search-button" to="/search">
                Search
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
