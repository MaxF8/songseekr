import { Link } from "react-router-dom";

import useArtworkTheme from "../../hooks/useArtworkTheme";

export default function NotFound() {
  useArtworkTheme(undefined, "not-found-route");

  return (
    <main className="song-page not-found-page">
      <header className="song-hero library-index-hero home-index-hero">
        <div className="song-hero__inner library-index-hero__inner home-index-hero__inner">
          <div className="song-hero__copy">
            <h1 className="song-hero__title">404</h1>
          </div>
        </div>
      </header>

      <section className="song-page__body home-index__body not-found__body">
        <div className="home-index__content">
          <h2>This page is off the set list</h2>
          <p>
            songseekr could not find the page you requested. Its address may be incorrect,
            outdated, or the page may have moved.
          </p>
          <div className="home-actions">
            <Link className="button button--primary home-action-button" to="/search">
              Search music
            </Link>
            <Link className="button button--primary home-action-button" to="/">
              Go home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
