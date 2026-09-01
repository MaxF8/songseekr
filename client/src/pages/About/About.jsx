import maxPortrait from "../../assets/pics/max3.jpeg";
import useArtworkTheme from "../../hooks/useArtworkTheme";

const links = [
  ["Portfolio", "https://maxefriedman.com"],
  ["LinkedIn", "https://www.linkedin.com/in/max-friedman/"],
  ["GitHub", "https://github.com/MaxF8"],
];

export default function About() {
  useArtworkTheme(undefined, "about-route");

  return (
    <main className="song-page about-page">
      <header className="song-hero about-page__hero">
        <div className="song-hero__inner">
          <div className="song-hero__copy">
            <h1 className="song-hero__title">About Me</h1>
          </div>
          <div className="song-hero__art">
            <img
              src={maxPortrait}
              alt="Max Friedman standing on a boardwalk"
              width="340"
              height="340"
            />
          </div>
        </div>
      </header>

      <div className="song-page__body about-page__body">
        <div className="about-page__content">
          <section className="about-page__bio" aria-label="About Max Friedman">
            <p className="about-page__intro">
              Hi 👋, my name is Max Friedman. I’m a software engineer!
            </p>
            <p>
              I made this app as a helpful tool to enhance my own guitar playing when playing my favorite
              tracks. Hopefully others can use it as well.
            </p>
          </section>

          <section className="about-links" aria-labelledby="about-links-heading">
            <h2 id="about-links-heading">Links</h2>
            <ul>
              {links.map(([label, href]) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noreferrer">
                    {label}
                    <span aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
