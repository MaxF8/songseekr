import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="page page--centered">
      <section className="panel empty-state">
        <p>404</p>
        <h1>This page is off the set list</h1>
        <p>The address may be old or mistyped.</p>
        <div className="button-row">
          <Link className="button button--primary" to="/search">
            Search music
          </Link>
          <Link className="button button--secondary" to="/">
            Go home
          </Link>
        </div>
      </section>
    </main>
  );
}
