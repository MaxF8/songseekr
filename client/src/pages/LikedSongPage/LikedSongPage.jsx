import useApiResource from "../../hooks/useApiResource";
import usePage from "../../hooks/usePage";
import SpotifyAttribution from "../../components/SpotifyAttribution/SpotifyAttribution";
import AsyncState from "../../components/ui/AsyncState";
import Pagination from "../../components/ui/Pagination";
import TrackTable from "../../components/ui/TrackTable";
import useArtworkTheme from "../../hooks/useArtworkTheme";

const LIMIT = 24;

export default function LikedSongPage() {
  const { offset, setPage } = usePage(LIMIT);
  const { data, error, loading, retry } = useApiResource(
    `/api/me/tracks?limit=${LIMIT}&offset=${offset}`
  );

  useArtworkTheme(undefined, "liked-songs-route");

  return (
    <main className="song-page library-index-page liked-songs-page">
      <header className="song-hero library-index-hero">
        <div className="song-hero__inner library-index-hero__inner">
          <div className="song-hero__copy">
            <h1 className="song-hero__title">Liked songs</h1>
          </div>
        </div>
      </header>

      <div className="song-page__body library-index__body">
        <AsyncState
          loading={loading}
          loadingMessage="Loading liked songs…"
          error={error}
          onRetry={retry}
          empty={data?.items.length === 0}
          emptyMessage="No liked Spotify tracks were found."
        />

        {data && (
          <>
            {data.items.length > 0 && !data.audioFeaturesAvailable && (
              <p className="notice">
                Key data is unavailable from Spotify right now. Your liked tracks are still listed.
              </p>
            )}
            <TrackTable
              tracks={data.items}
              filterLabel="Filter liked songs"
              toolbarEnd={
                <Pagination
                  className="pagination--top"
                  limit={LIMIT}
                  offset={offset}
                  total={data.total}
                  onPageChange={setPage}
                />
              }
            />
            <Pagination
              className="pagination--bottom"
              limit={LIMIT}
              offset={offset}
              total={data.total}
              onPageChange={setPage}
            />
            <SpotifyAttribution className="spotify-attribution--page" />
          </>
        )}
      </div>
    </main>
  );
}
