import { useSearchParams } from "react-router-dom";

import SearchResults from "./SearchResults";
import { Input } from "../ui/input";
import useSearch from "../../hooks/useSearch";

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = (searchParams.get("q") || "").trim();
  const search = useSearch(urlQuery);

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
    <main className="search-screen">
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
    </main>
  );
}
