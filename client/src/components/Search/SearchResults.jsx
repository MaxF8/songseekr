import AsyncState from "../ui/AsyncState";
import MediaGrid from "../ui/MediaGrid";
import TrackTable from "../ui/TrackTable";
import SpotifyAttribution from "../SpotifyAttribution/SpotifyAttribution";

export default function SearchResults({ data, error, loading, query, retry }) {
  if (!query) return null;

  const noResults = data && data.tracks.length === 0 && data.albums.length === 0;

  return (
    <section className="search-results" aria-label={`Search results for ${query}`}>
      <AsyncState
        loading={loading}
        loadingMessage={`Searching for “${query}”…`}
        error={error}
        onRetry={retry}
        empty={noResults}
        emptyMessage="No songs or albums found."
      />

      {data && !noResults && (
        <>
          {!data.audioFeaturesAvailable && (
            <p className="notice" role="status">
              Key data is unavailable for this search, but the tracks still open normally.
            </p>
          )}

          {data.tracks.length > 0 && (
            <section className="search-result-group" aria-labelledby="track-results">
              <div className="section-heading section-heading--row">
                <h2 id="track-results">Songs</h2>
                <span>{data.tracks.length} results</span>
              </div>
              <TrackTable tracks={data.tracks} />
            </section>
          )}

          {data.albums.length > 0 && (
            <section className="search-result-group" aria-labelledby="album-results">
              <div className="section-heading section-heading--row">
                <h2 id="album-results">Albums</h2>
                <span>{data.albums.length} results</span>
              </div>
              <MediaGrid items={data.albums} kind="album" />
            </section>
          )}

          <SpotifyAttribution className="spotify-attribution--surface" />
        </>
      )}
    </section>
  );
}
