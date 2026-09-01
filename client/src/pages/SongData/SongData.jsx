import { Link, useParams } from "react-router-dom";

import SoloWorkspace from "../../components/SoloWorkspace/SoloWorkspace";
import SpotifyAttribution from "../../components/SpotifyAttribution/SpotifyAttribution";
import AsyncState from "../../components/ui/AsyncState";
import useApiResource from "../../hooks/useApiResource";
import useArtworkTheme from "../../hooks/useArtworkTheme";
import { describeKey, getPentatonicPitchClasses } from "../../utils/music";

function ArtistLinks({ artists = [] }) {
  if (artists.length === 0) return "Unknown artist";

  return artists.map((artist, index) => (
    <span key={artist.id || `${artist.name}-${index}`}>
      {index > 0 && ", "}
      {artist.spotifyUrl ? (
        <a href={artist.spotifyUrl} target="_blank" rel="noreferrer">
          {artist.name}
        </a>
      ) : (
        artist.name
      )}
    </span>
  ));
}

export default function SongData() {
  const { trackId } = useParams();
  const { data, error, loading, retry } = useApiResource(
    `/api/tracks/${encodeURIComponent(trackId)}`
  );

  const track = data?.track;
  const titleLength = track?.name.length || 0;
  const titleClassName = [
    "song-hero__title",
    titleLength > 34 ? "song-hero__title--long" : "",
    titleLength > 58 ? "song-hero__title--very-long" : "",
  ]
    .filter(Boolean)
    .join(" ");

  useArtworkTheme(track?.image, "song-route");

  return (
    <main className="song-page">
      <AsyncState loading={loading} loadingMessage="Loading track…" error={error} onRetry={retry} />

      {track && (
        <>
          <header className="song-hero">
            <div className="song-hero__inner">
              <div className="song-hero__copy">
                <h1 className={titleClassName}>
                  {track.spotifyUrl ? (
                    <a href={track.spotifyUrl} target="_blank" rel="noreferrer">
                      {track.name}
                    </a>
                  ) : (
                    track.name
                  )}
                </h1>
              </div>

              <div className="song-hero__art">
                {track.image ? (
                  <img
                    src={track.image}
                    alt={`${track.name} album art`}
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

          <div className="song-page__body">
            <section className="song-overview" aria-label="Track details">
              <div>
                <p className="song-overview__eyebrow">Track details</p>
                <p className="song-overview__artists">
                  <span>{track.artists.length === 1 ? "Artist: " : "Artists: "}</span>
                  <ArtistLinks artists={track.artists} />
                </p>
              </div>

              <dl className="song-facts">
                <div>
                  <dt>Key</dt>
                  <dd>{describeKey(track.audioFeature).replace(/ major| minor/, "")}</dd>
                </div>
                <div>
                  <dt>Mode</dt>
                  <dd>
                    {track.audioFeature
                      ? track.audioFeature.mode === 1
                        ? "Major"
                        : "Minor"
                      : "Unavailable"}
                  </dd>
                </div>
                {track.album?.name && (
                  <div>
                    <dt>Album</dt>
                    <dd>
                      {track.album.id ? (
                        <Link to={`/albums/${track.album.id}`}>{track.album.name}</Link>
                      ) : (
                        track.album.name
                      )}
                    </dd>
                  </div>
                )}
              </dl>

            </section>

            {getPentatonicPitchClasses(track.audioFeature).length > 0 ? (
              <SoloWorkspace audioFeature={track.audioFeature} />
            ) : (
              <section className="status-alert" aria-labelledby="solo-unavailable-heading">
                <h2 id="solo-unavailable-heading">Solo workspace unavailable</h2>
                <p>Spotify did not return a reliable key, so songseekr will not guess.</p>
              </section>
            )}

            <SpotifyAttribution className="spotify-attribution--song" />
          </div>
        </>
      )}
    </main>
  );
}
