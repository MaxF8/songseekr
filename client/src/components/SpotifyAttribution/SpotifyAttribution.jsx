import spotifyLogo from "../../assets/spotify/Full_Logo_White_RGB.svg";
import spotifyLogoBlack from "../../assets/Spotify_Logo_Black.png";

export default function SpotifyAttribution({ className = "" }) {
  return (
    <div className={`spotify-attribution ${className}`.trim()}>
      <a href="https://open.spotify.com/" rel="noreferrer" target="_blank" aria-label="Open Spotify">
        <img className="spotify-logo spotify-logo--dark" src={spotifyLogo} width="110" height="30" alt="Spotify" />
        <img
          className="spotify-logo spotify-logo--light"
          src={spotifyLogoBlack}
          width="110"
          height="33"
          alt=""
          aria-hidden="true"
        />
      </a>
    </div>
  );
}
