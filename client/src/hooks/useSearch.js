import { useCallback, useEffect, useState } from "react";

import { apiRequest } from "../api/client";

const DEBOUNCE_MS = 250;

export default function useSearch(value) {
  const query = value.trim();
  const [requestVersion, setRequestVersion] = useState(0);
  const [state, setState] = useState({
    data: null,
    error: null,
    loading: false,
    query: "",
  });

  useEffect(() => {
    if (!query) return undefined;

    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
      setState({ data: null, error: null, loading: true, query });
      apiRequest(`/api/search?q=${encodeURIComponent(query)}`, { signal: controller.signal })
        .then((data) => setState({ data, error: null, loading: false, query }))
        .catch((error) => {
          if (error.name !== "AbortError") {
            setState({ data: null, error, loading: false, query });
          }
        });
    }, DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [query, requestVersion]);

  const retry = useCallback(() => setRequestVersion((version) => version + 1), []);
  if (!query) return { data: null, error: null, loading: false, query: "", retry };

  return {
    data: state.query === query ? state.data : null,
    error: state.query === query ? state.error : null,
    loading: state.query === query ? state.loading : Boolean(query),
    query,
    retry,
  };
}
