import { useParams } from "react-router-dom";

import SpotifyAttribution from "../../components/SpotifyAttribution/SpotifyAttribution";
import AsyncState from "../../components/ui/AsyncState";
import Pagination from "../../components/ui/Pagination";
import TrackTable from "../../components/ui/TrackTable";
import useApiResource from "../../hooks/useApiResource";
import useArtworkTheme from "../../hooks/useArtworkTheme";
import usePage from "../../hooks/usePage";
import { artistNames } from "../../utils/music";

const LIMIT = 16;

export default function AlbumData() {
  const { albumId } = useParams();
  const { offset, setPage } = usePage(LIMIT);
  const { data, error, loading, retry } = useApiResource(
    `/api/albums/${encodeURIComponent(albumId)}?limit=${LIMIT}&offset=${offset}`
  );
  const album = data?.album;
  const titleLength = album?.name.length || 0;
  const titleClassName = [
    "song-hero__title",
    titleLength > 34 ? "song-hero__title--long" : "",
    titleLength > 58 ? "song-hero__title--very-long" : "",
  ]
    .filter(Boolean)
    .join(" ");

  useArtworkTheme(album?.image, "album-detail-route");

  return (
    <main className="song-page album-detail-page">
      <AsyncState loading={loading} loadingMessage="Loading album…" error={error} onRetry={retry} />

      {data && album && (
        <>
          <header className="song-hero album-hero">
            <div className="song-hero__inner">
              <div className="song-hero__copy">
                <h1 className={titleClassName}>
                  {album.spotifyUrl ? (
                    <a href={album.spotifyUrl} target="_blank" rel="noreferrer">
                      {album.name}
                    </a>
                  ) : (
                    album.name
                  )}
                </h1>
              </div>

              <div className="song-hero__art">
                {album.image ? (
                  <img
                    src={album.image}
                    alt={`${album.name} cover`}
                    width="440"
                    height="440"
                  />
                ) : (
                  <div className="song-hero__placeholder" aria-hidden="true">
                    ♪
                  </div>
                )}
              </div>
            </div>
          </header>

          <div className="song-page__body album-detail__body">
            <section className="playlist-summary album-summary" aria-label="Album details">
              <dl>
                <div>
                  <dt>Artist</dt>
                  <dd>{artistNames(album.artists)}</dd>
                </div>
                <div>
                  <dt>Released</dt>
                  <dd>{album.releaseDate || "Unknown"}</dd>
                </div>
                <div>
                  <dt>Tracks</dt>
                  <dd>{data.total}</dd>
                </div>
              </dl>
            </section>

            {!data.audioFeaturesAvailable && (
              <p className="notice">Spotify did not provide key data for these tracks.</p>
            )}

            <section className="playlist-tracks" aria-label="Album tracks">
              <AsyncState
                empty={data.items.length === 0}
                emptyMessage="No available tracks were found on this album page."
              />
              <TrackTable
                tracks={data.items}
                filterLabel={data.items.length > 0 ? "Filter album tracks" : undefined}
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
            </section>
            <SpotifyAttribution className="spotify-attribution--page" />
          </div>
        </>
      )}
    </main>
  );
}
