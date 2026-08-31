import useApiResource from "../../hooks/useApiResource";
import usePage from "../../hooks/usePage";
import SpotifyAttribution from "../../components/SpotifyAttribution/SpotifyAttribution";
import AsyncState from "../../components/ui/AsyncState";
import MediaGrid from "../../components/ui/MediaGrid";
import Pagination from "../../components/ui/Pagination";

const LIMIT = 24;

export default function AlbumPage() {
  const { offset, setPage } = usePage(LIMIT);
  const { data, error, loading, retry } = useApiResource(
    `/api/me/albums?limit=${LIMIT}&offset=${offset}`
  );

  return (
    <main className="page">
      <header className="page-header">
        <h1>Albums</h1>
        <p>Open an album to inspect its tracks without losing your library page.</p>
      </header>

      <AsyncState
        loading={loading}
        loadingMessage="Loading saved albums…"
        error={error}
        onRetry={retry}
        empty={data?.items.length === 0}
        emptyMessage="No saved Spotify albums were found."
      />

      {data?.items.length > 0 && (
        <>
          <MediaGrid items={data.items} kind="album" />
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
