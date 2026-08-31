import { useCallback, useEffect, useState } from "react";

import { apiRequest } from "../api/client";

export default function useApiResource(path) {
  const [requestVersion, setRequestVersion] = useState(0);
  const [state, setState] = useState({
    data: null,
    error: null,
    key: null,
  });
  const requestKey = path ? `${path}:${requestVersion}` : null;

  useEffect(() => {
    if (!path) return undefined;

    const controller = new AbortController();

    apiRequest(path, { signal: controller.signal })
      .then((data) => setState({ data, error: null, key: requestKey }))
      .catch((error) => {
        if (error.name !== "AbortError") {
          setState({ data: null, error, key: requestKey });
        }
      });

    return () => controller.abort();
  }, [path, requestKey]);

  const retry = useCallback(() => setRequestVersion((version) => version + 1), []);
  const isCurrent = state.key === requestKey;
  return {
    data: isCurrent ? state.data : null,
    error: isCurrent ? state.error : null,
    loading: Boolean(path) && !isCurrent,
    retry,
  };
}
