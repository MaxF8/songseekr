import { Link } from "react-router-dom";

export default function Brand({ onClick }) {
  return (
    <Link className="brand" to="/" onClick={onClick} aria-label="songseekr home">
      <span className="brand-wordmark">songseekr</span>
      <svg className="brand-lens" viewBox="0 0 28 28" aria-hidden="true">
        <circle cx="11.5" cy="11.5" r="7.5" />
        <path d="m17 17 7 7" />
      </svg>
    </Link>
  );
}
