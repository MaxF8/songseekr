import { useParams } from "react-router-dom";

import SpotifyAttribution from "../../components/SpotifyAttribution/SpotifyAttribution";
import AsyncState from "../../components/ui/AsyncState";
import Pagination from "../../components/ui/Pagination";
import TrackTable from "../../components/ui/TrackTable";
import useApiResource from "../../hooks/useApiResource";
import usePage from "../../hooks/usePage";
import { artistNames } from "../../utils/music";

const LIMIT = 16;

export default function AlbumData() {
  const { albumId } = useParams();
  const { offset, setPage } = usePage(LIMIT);
  const { data, error, loading, retry } = useApiResource(
    `/api/albums/${encodeURIComponent(albumId)}?limit=${LIMIT}&offset=${offset}`
  );

  return (
    <main className="page">
      <AsyncState loading={loading} loadingMessage="Loading album…" error={error} onRetry={retry} />

      {data && (
        <>
          <header className="detail-header">
            {data.album.image ? (
              <img src={data.album.image} alt="" width="320" height="320" />
            ) : (
              <div className="detail-placeholder" aria-hidden="true">♪</div>
            )}
            <div>
              <h1>{data.album.name}</h1>
              <p>{artistNames(data.album.artists)}</p>
              {data.album.releaseDate && <p>Released {data.album.releaseDate}</p>}
              {data.album.spotifyUrl && (
                <a
                  className="text-link"
                  href={data.album.spotifyUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open album in Spotify
                </a>
              )}
            </div>
          </header>

          {!data.audioFeaturesAvailable && (
            <p className="notice">Spotify did not provide key data for these tracks.</p>
          )}

          <section aria-labelledby="album-tracks">
            <div className="section-heading section-heading--row">
              <h2 id="album-tracks">Tracks</h2>
              <span>{data.total} total</span>
            </div>
            <AsyncState
              empty={data.items.length === 0}
              emptyMessage="No available tracks were found on this album page."
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
