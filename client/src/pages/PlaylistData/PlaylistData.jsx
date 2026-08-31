import { useParams } from "react-router-dom";

import SpotifyAttribution from "../../components/SpotifyAttribution/SpotifyAttribution";
import AsyncState from "../../components/ui/AsyncState";
import Pagination from "../../components/ui/Pagination";
import TrackTable from "../../components/ui/TrackTable";
import useApiResource from "../../hooks/useApiResource";
import usePage from "../../hooks/usePage";

const LIMIT = 16;

export default function PlaylistData() {
  const { playlistId } = useParams();
  const { offset, setPage } = usePage(LIMIT);
  const { data, error, loading, retry } = useApiResource(
    `/api/playlists/${encodeURIComponent(playlistId)}/items?limit=${LIMIT}&offset=${offset}`
  );

  return (
    <main className="page">
      <AsyncState
        loading={loading}
        loadingMessage="Loading playlist…"
        error={error}
        onRetry={retry}
      />

      {data && (
        <>
          <header className="detail-header">
            {data.playlist.image ? (
              <img src={data.playlist.image} alt="" width="320" height="320" />
            ) : (
              <div className="detail-placeholder" aria-hidden="true">♪</div>
            )}
            <div>
              <h1>{data.playlist.name}</h1>
              {data.playlist.owner && <p>Created by {data.playlist.owner}</p>}
              {data.playlist.spotifyUrl && (
                <a
                  className="text-link"
                  href={data.playlist.spotifyUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open playlist in Spotify
                </a>
              )}
            </div>
          </header>

          {!data.audioFeaturesAvailable && (
            <p className="notice">Spotify did not provide key data for these tracks.</p>
          )}

          <section aria-labelledby="playlist-tracks">
            <div className="section-heading section-heading--row">
              <h2 id="playlist-tracks">Tracks</h2>
              <span>{data.total} total items</span>
            </div>
            <AsyncState
              empty={data.items.length === 0}
              emptyMessage="No playable tracks were found on this playlist page."
            />
            {data.items.length > 0 && <TrackTable tracks={data.items} />}
            <Pagination
              limit={LIMIT}
              offset={offset}
              total={data.total}
              onPageChange={setPage}
            />
          </section>
          <SpotifyAttribution className="spotify-attribution--page" />
        </>
      )}
    </main>
  );
}
