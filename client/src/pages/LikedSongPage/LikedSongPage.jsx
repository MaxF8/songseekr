import useApiResource from "../../hooks/useApiResource";
import usePage from "../../hooks/usePage";
import SpotifyAttribution from "../../components/SpotifyAttribution/SpotifyAttribution";
import AsyncState from "../../components/ui/AsyncState";
import Pagination from "../../components/ui/Pagination";
import TrackTable from "../../components/ui/TrackTable";

const LIMIT = 24;

export default function LikedSongPage() {
  const { offset, setPage } = usePage(LIMIT);
  const { data, error, loading, retry } = useApiResource(
    `/api/me/tracks?limit=${LIMIT}&offset=${offset}`
  );

  return (
    <main className="page">
      <header className="page-header">
        <h1>Liked songs</h1>
        <p>Select any available track to open its practice references.</p>
      </header>

      <AsyncState
        loading={loading}
        loadingMessage="Loading liked songs…"
        error={error}
        onRetry={retry}
        empty={data?.items.length === 0}
        emptyMessage="No liked Spotify tracks were found."
      />

      {data?.items.length > 0 && (
        <>
          {!data.audioFeaturesAvailable && (
            <p className="notice">
              Key data is unavailable from Spotify right now. Your liked tracks are still listed.
            </p>
          )}
          <TrackTable tracks={data.items} />
          <Pagination
            limit={LIMIT}
            offset={offset}
            total={data.total}
            onPageChange={setPage}
          />
          <SpotifyAttribution className="spotify-attribution--page" />
        </>
      )}
    </main>
  );
}
