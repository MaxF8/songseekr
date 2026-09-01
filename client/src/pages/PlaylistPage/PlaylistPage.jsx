import useApiResource from "../../hooks/useApiResource";
import usePage from "../../hooks/usePage";
import SpotifyAttribution from "../../components/SpotifyAttribution/SpotifyAttribution";
import AsyncState from "../../components/ui/AsyncState";
import MediaGrid from "../../components/ui/MediaGrid";
import Pagination from "../../components/ui/Pagination";
import useArtworkTheme from "../../hooks/useArtworkTheme";

const LIMIT = 24;

export default function PlaylistPage() {
  const { offset, setPage } = usePage(LIMIT);
  const { data, error, loading, retry } = useApiResource(
    `/api/me/playlists?limit=${LIMIT}&offset=${offset}`
  );

  useArtworkTheme(undefined, "playlist-index-route");

  return (
    <main className="song-page playlist-index-page">
      <header className="song-hero playlist-index-hero">
        <div className="song-hero__inner playlist-index-hero__inner">
          <div className="song-hero__copy">
            <h1 className="song-hero__title">Playlists</h1>
          </div>
        </div>
      </header>

      <div className="song-page__body playlist-index__body">
        <AsyncState
          loading={loading}
          loadingMessage="Loading playlists…"
          error={error}
          onRetry={retry}
          empty={data?.items.length === 0}
          emptyMessage="No Spotify playlists were found."
        />

        {data ? (
          <>
            <Pagination
              className="pagination--top"
              limit={LIMIT}
              offset={offset}
              total={data.total}
              onPageChange={setPage}
            />
            {data.items.length > 0 ? <MediaGrid items={data.items} kind="playlist" /> : null}
            <Pagination
              className="pagination--bottom"
              limit={LIMIT}
              offset={offset}
              total={data.total}
              onPageChange={setPage}
            />
            <SpotifyAttribution className="spotify-attribution--page" />
          </>
        ) : null}
      </div>
    </main>
  );
}
