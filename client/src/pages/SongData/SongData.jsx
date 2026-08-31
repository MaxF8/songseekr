import { useParams } from "react-router-dom";

import SpotifyAttribution from "../../components/SpotifyAttribution/SpotifyAttribution";
import AsyncState from "../../components/ui/AsyncState";
import useApiResource from "../../hooks/useApiResource";
import { describeKey, scaleCoordinates } from "../../utils/music";

const scaleImages = import.meta.glob("../../assets/pentatonicScales/**/*.png", {
  eager: true,
  import: "default",
  query: "?url",
});

function findScaleImage(mode, folder, suffix) {
  const filename = `${folder}${suffix}.png`;
  const ending = `/pentatonicScales/${mode}/${folder}/${filename}`;
  const match = Object.entries(scaleImages).find(([path]) => path.endsWith(ending));
  return match?.[1] || null;
}

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

function ScaleReferences({ audioFeature }) {
  const scale = scaleCoordinates(audioFeature);
  if (!scale) {
    return (
      <section className="status-alert" aria-labelledby="scale-heading">
        <h2 id="scale-heading">Practice references unavailable</h2>
        <p>
          Spotify did not return a reliable key for this track, so SongSeekr will not guess which
          scale to show.
        </p>
      </section>
    );
  }

  const diagrams = [
    { label: "Chords in Key", suffix: "Chords" },
    { label: "Pentatonic Shapes", suffix: "" },
    { label: "Pentatonic Fretboard", suffix: "Fretboard" },
  ]
    .map((diagram) => ({
      ...diagram,
      src: findScaleImage(scale.mode, scale.folder, diagram.suffix),
    }))
    .filter((diagram) => diagram.src);

  return (
    <section className="practice-references" aria-labelledby="scale-heading">
      <h2 id="scale-heading">{describeKey(audioFeature)}</h2>
      <div className="reference-list">
        {diagrams.map((diagram) => (
          <figure className="reference-item" key={diagram.label}>
            <figcaption>{diagram.label}</figcaption>
            <img
              src={diagram.src}
              alt={`${describeKey(audioFeature)} ${diagram.label.toLowerCase()} diagram`}
              loading="lazy"
            />
          </figure>
        ))}
      </div>
    </section>
  );
}

export default function SongData() {
  const { trackId } = useParams();
  const { data, error, loading, retry } = useApiResource(
    `/api/tracks/${encodeURIComponent(trackId)}`
  );

  return (
    <main className="page song-page">
      <AsyncState loading={loading} loadingMessage="Loading track…" error={error} onRetry={retry} />

      {data?.track && (
        <>
          <div className="song-layout">
            <header className="detail-header">
              {data.track.image ? (
                <img src={data.track.image} alt={`${data.track.name} album art`} width="320" height="320" />
              ) : (
                <div className="detail-placeholder" aria-hidden="true">
                  ♪
                </div>
              )}
              <div className="song-summary">
                <h1>
                  {data.track.spotifyUrl ? (
                    <a href={data.track.spotifyUrl} target="_blank" rel="noreferrer">
                      {data.track.name}
                    </a>
                  ) : (
                    data.track.name
                  )}
                </h1>
                <p>
                  {data.track.artists.length === 1 ? "Artist" : "Artists"}: <span className="song-artists">
                    <ArtistLinks artists={data.track.artists} />
                  </span>
                </p>
                <p>Key: {describeKey(data.track.audioFeature).replace(/ major| minor/, "")}</p>
                <p>
                  Mode: {data.track.audioFeature ? (data.track.audioFeature.mode === 1 ? "Major" : "Minor") : "Unavailable"}
                </p>
                {data.track.album?.name && <p>Album: {data.track.album.name}</p>}
              </div>
            </header>

            <div className="song-references">
              {!data.audioFeaturesAvailable && (
                <p className="notice">
                  Key data is unavailable from Spotify right now. Track details remain available.
                </p>
              )}
              <ScaleReferences audioFeature={data.track.audioFeature} />
            </div>
          </div>
          <SpotifyAttribution className="spotify-attribution--song" />
        </>
      )}
    </main>
  );
}
