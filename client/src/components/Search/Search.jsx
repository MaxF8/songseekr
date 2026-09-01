import { useSearchParams } from "react-router-dom";

import SearchResults from "./SearchResults";
import { Input } from "../ui/input";
import useSearch from "../../hooks/useSearch";
import useArtworkTheme from "../../hooks/useArtworkTheme";

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = (searchParams.get("q") || "").trim();
  const search = useSearch(urlQuery);

  useArtworkTheme(undefined, "search-route");

  const updateQuery = (value) => {
    const trimmed = value.trim();
    setSearchParams(trimmed ? { q: trimmed } : {}, { replace: true });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = urlQuery.trim();
    setSearchParams(trimmed ? { q: trimmed } : {}, { replace: true });
  };

  return (
    <main className="song-page search-page">
      <header className="song-hero library-index-hero search-page__hero">
        <div className="song-hero__inner library-index-hero__inner">
          <div className="song-hero__copy">
            <h1 className="song-hero__title">Search</h1>
          </div>
        </div>
      </header>

      <div className="song-page__body library-index__body search-page__body">
        <form className="search-form search-form--centered" role="search" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="music-search">
            Song, artist, or album
          </label>
          <Input
            id="music-search"
            name="q"
            type="search"
            maxLength="100"
            value={urlQuery}
            onChange={(event) => updateQuery(event.target.value)}
            placeholder="Start Typing..."
            autoComplete="off"
          />
        </form>

        <SearchResults
          data={search.data}
          error={search.error}
          loading={search.loading}
          query={search.query}
          retry={search.retry}
        />
      </div>
    </main>
  );
}
