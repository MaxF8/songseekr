import { Alert, AlertDescription, AlertTitle } from "./alert";
import { Button } from "./button";

export default function AsyncState({
  empty = false,
  emptyMessage = "Nothing was found.",
  error,
  loading = false,
  loadingMessage = "Loading…",
  onRetry,
}) {
  if (loading) {
    return (
      <div className="status" role="status" aria-live="polite">
        <span className="spinner" aria-hidden="true" />
        <p>{loadingMessage}</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="status-alert status-alert--error" variant="destructive">
        <AlertTitle>We could not load this</AlertTitle>
        <AlertDescription>
          <p>{error.message || String(error)}</p>
          <div className="button-row">
            {error.status === 401 && (
              <Button asChild className="button button--primary">
                <a href="/api/auth/start">Reconnect Spotify</a>
              </Button>
            )}
            {onRetry && error.status !== 401 && (
              <Button className="button button--secondary" type="button" onClick={onRetry}>
                Try again
              </Button>
            )}
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  if (empty) {
    return (
      <div className="status status--empty">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return null;
}
