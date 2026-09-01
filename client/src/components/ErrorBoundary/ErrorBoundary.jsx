import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("songseekr render failure", error, errorInfo);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <main className="page page--centered">
        <section className="error-state" role="alert" aria-labelledby="error-heading">
          <h1 id="error-heading">This page could not be displayed</h1>
          <p>Reload the page. If the problem continues, return to songseekr’s home page.</p>
          <div className="button-row">
            <button className="button error-state__action" onClick={() => window.location.reload()}>
              Reload
            </button>
            <a className="button error-state__action" href="/">
              Go home
            </a>
          </div>
        </section>
      </main>
    );
  }
}
