import maxPortrait from "../../assets/pics/max3.jpeg";

const links = [
  ["Portfolio", "https://maxfriedman.dev"],
  ["LinkedIn", "https://www.linkedin.com/in/max-friedman/"],
  ["GitHub", "https://github.com/MaxF8"],
];

export default function About() {
  return (
    <main className="about-page">
      <img
        className="about-page__portrait"
        src={maxPortrait}
        alt="Max Friedman standing on a boardwalk"
        width="340"
        height="340"
      />
      <h1>About Me</h1>
      <p>
        Hi 👋, my name is Max Friedman. I’m a software engineering student currently pursuing a
        BS in Computer Science.
      </p>
      <p>
        I made this app as a helpful tool to enhance my own guitar playing when playing my favorite
        tracks. Hopefully others can use it as well.
      </p>

      <section className="about-links" aria-labelledby="about-links-heading">
        <h2 id="about-links-heading">Links</h2>
        <ul>
          {links.map(([label, href]) => (
            <li key={label}>
              <a href={href} target="_blank" rel="noreferrer">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
