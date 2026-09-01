import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <p>Created by Max Friedman</p>
      <nav className="site-footer__links" aria-label="Creator links">
        <Link to="/about">
          About Me <span aria-hidden="true">›</span>
        </Link>
        <a href="https://www.linkedin.com/in/max-friedman/" target="_blank" rel="noreferrer">
          LinkedIn <span aria-hidden="true">›</span>
        </a>
      </nav>
    </footer>
  );
}
