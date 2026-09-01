import { ExternalLinkIcon } from "lucide-react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import SpotifyAttribution from "../../components/SpotifyAttribution/SpotifyAttribution";
import {
  ChordsInKey,
  PentatonicFretboard,
  PentatonicShapes,
} from "../../components/PracticeDiagrams/PracticeDiagrams";
import AsyncState from "../../components/ui/AsyncState";
import { Button } from "../../components/ui/button";
import useApiResource from "../../hooks/useApiResource";
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

function sampleArtworkColor(imageUrl, onColor) {
  const image = new Image();
  image.crossOrigin = "anonymous";
  image.src = imageUrl;

  image.onload = () => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return;

    canvas.width = 24;
    canvas.height = 24;
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    try {
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
      let red = 0;
      let green = 0;
      let blue = 0;
      let weight = 0;

      for (let index = 0; index < pixels.length; index += 16) {
        const alpha = pixels[index + 3] / 255;
        const brightness = (pixels[index] + pixels[index + 1] + pixels[index + 2]) / 3;
        if (alpha < 0.5 || brightness < 18 || brightness > 242) continue;

        red += pixels[index] * alpha;
        green += pixels[index + 1] * alpha;
        blue += pixels[index + 2] * alpha;
        weight += alpha;
      }

      if (weight > 0) {
        onColor({
          red: Math.round(red / weight),
          green: Math.round(green / weight),
          blue: Math.round(blue / weight),
        });
      }
    } catch {
      // Spotify artwork can still render if its CDN blocks canvas color sampling.
    }
  };

  return () => {
    image.onload = null;
  };
}

function ScaleReferences({ audioFeature }) {
  if (getPentatonicPitchClasses(audioFeature).length === 0) {
    return (
      <section className="status-alert" aria-labelledby="scale-heading">
        <h2 id="scale-heading">Practice references unavailable</h2>
        <p>
          Spotify did not return a reliable key for this track, so songseekr will not guess which
          scale to show.
        </p>
      </section>
    );
  }

  return (
    <section className="practice-references" aria-labelledby="scale-heading">
      <div className="practice-references__heading">
        <p>Practice references</p>
        <h2 id="scale-heading">{describeKey(audioFeature)}</h2>
      </div>
      <div className="reference-list">
        <section className="reference-item reference-item--strip" aria-labelledby="chords-heading">
          <h3 id="chords-heading">Chords in key</h3>
          <ChordsInKey audioFeature={audioFeature} />
        </section>
        <section className="reference-item reference-item--compact" aria-labelledby="shapes-heading">
          <h3 id="shapes-heading">Pentatonic shapes</h3>
          <PentatonicShapes audioFeature={audioFeature} />
        </section>
        <section className="reference-item reference-item--wide" aria-labelledby="fretboard-heading">
          <h3 id="fretboard-heading">Pentatonic fretboard</h3>
          <PentatonicFretboard audioFeature={audioFeature} />
        </section>
      </div>
    </section>
  );
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

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("song-route");

    let cancelSampling;
    if (track?.image) {
      cancelSampling = sampleArtworkColor(track.image, ({ red, green, blue }) => {
        root.style.setProperty(
          "--song-hero-light",
          `rgb(${Math.round(red * 0.25 + 255 * 0.75)} ${Math.round(
            green * 0.25 + 255 * 0.75
          )} ${Math.round(blue * 0.25 + 255 * 0.75)})`
        );
        root.style.setProperty(
          "--song-hero-dark",
          `rgb(${Math.round(red * 0.4 + 14 * 0.6)} ${Math.round(
            green * 0.4 + 18 * 0.6
          )} ${Math.round(blue * 0.4 + 28 * 0.6)})`
        );
      });
    }

    return () => {
      cancelSampling?.();
      root.classList.remove("song-route");
      root.style.removeProperty("--song-hero-light");
      root.style.removeProperty("--song-hero-dark");
    };
  }, [track?.image]);

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
            <section className="song-overview" aria-labelledby="track-details-heading">
              <div>
                <p className="song-overview__eyebrow">Track details</p>
                <h2 id="track-details-heading">Learn the song</h2>
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

              {track.spotifyUrl && (
                <Button asChild variant="outline" className="song-spotify-link">
                  <a href={track.spotifyUrl} target="_blank" rel="noreferrer">
                    Open in Spotify
                    <ExternalLinkIcon aria-hidden="true" />
                  </a>
                </Button>
              )}
            </section>

            <div className="song-references">
              {!data.audioFeaturesAvailable && (
                <p className="notice">
                  Key data is unavailable from Spotify right now. Track details remain available.
                </p>
              )}
              <ScaleReferences audioFeature={track.audioFeature} />
            </div>

            <SpotifyAttribution className="spotify-attribution--song" />
          </div>
        </>
      )}
    </main>
  );
}
