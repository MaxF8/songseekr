import { ExternalLinkIcon } from "lucide-react";
import { useParams } from "react-router-dom";

import SpotifyAttribution from "../../components/SpotifyAttribution/SpotifyAttribution";
import AsyncState from "../../components/ui/AsyncState";
import Pagination from "../../components/ui/Pagination";
import TrackTable from "../../components/ui/TrackTable";
import { Button } from "../../components/ui/button";
import useApiResource from "../../hooks/useApiResource";
import useArtworkTheme from "../../hooks/useArtworkTheme";
import usePage from "../../hooks/usePage";

const LIMIT = 16;

export default function PlaylistData() {
  const { playlistId } = useParams();
  const { offset, setPage } = usePage(LIMIT);
  const { data, error, loading, retry } = useApiResource(
    `/api/playlists/${encodeURIComponent(playlistId)}/items?limit=${LIMIT}&offset=${offset}`
  );
  const playlist = data?.playlist;
  const titleLength = playlist?.name.length || 0;
  const titleClassName = [
    "song-hero__title",
    titleLength > 34 ? "song-hero__title--long" : "",
    titleLength > 58 ? "song-hero__title--very-long" : "",
  ]
    .filter(Boolean)
    .join(" ");

  useArtworkTheme(playlist?.image, "playlist-detail-route");

  return (
    <main className="song-page playlist-detail-page">
      <AsyncState
        loading={loading}
        loadingMessage="Loading playlist…"
        error={error}
        onRetry={retry}
      />

      {data && playlist && (
        <>
          <header className="song-hero playlist-hero">
            <div className="song-hero__inner">
              <div className="song-hero__copy">
                <h1 className={titleClassName}>{playlist.name}</h1>
              </div>

              <div className="song-hero__art">
                {playlist.image ? (
                  <img
                    src={playlist.image}
                    alt={`${playlist.name} cover`}
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

          <div className="song-page__body playlist-detail__body">
            <section className="playlist-summary" aria-label="Playlist details">
              <dl>
                <div>
                  <dt>Created by</dt>
                  <dd>{playlist.owner || "Unknown"}</dd>
                </div>
                <div>
                  <dt>Tracks</dt>
                  <dd>{data.total}</dd>
                </div>
              </dl>

              {playlist.spotifyUrl ? (
                <Button asChild variant="outline" className="playlist-spotify-link">
                  <a href={playlist.spotifyUrl} target="_blank" rel="noreferrer">
                    Open in Spotify
                    <ExternalLinkIcon aria-hidden="true" />
                  </a>
                </Button>
              ) : null}
            </section>

            {!data.audioFeaturesAvailable && (
              <p className="notice">Spotify did not provide key data for these tracks.</p>
            )}

            <section className="playlist-tracks" aria-labelledby="playlist-tracks-heading">
              <div className="section-heading section-heading--row">
                <h2 id="playlist-tracks-heading">Tracks</h2>
                <span>{data.total} total items</span>
              </div>
              <AsyncState
                empty={data.items.length === 0}
                emptyMessage="No playable tracks were found on this playlist page."
              />
              {data.items.length > 0 ? <TrackTable tracks={data.items} /> : null}
              <Pagination
                limit={LIMIT}
                offset={offset}
                total={data.total}
                onPageChange={setPage}
              />
            </section>
            <SpotifyAttribution className="spotify-attribution--page" />
          </div>
        </>
      )}
    </main>
  );
}
