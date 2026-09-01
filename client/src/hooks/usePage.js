import { useSearchParams } from "react-router-dom";

export function normalizePage(value, limit) {
  const text = typeof value === "string" ? value : String(value ?? "");
  const safeLimit = Number.isSafeInteger(limit) && limit > 0 ? limit : 1;
  if (!/^\d+$/.test(text)) return 1;

  const page = Number(text);
  const maximumPage = Math.max(1, Math.floor(Number.MAX_SAFE_INTEGER / safeLimit));
  return Number.isSafeInteger(page) && page > 0 ? Math.min(page, maximumPage) : 1;
}

export default function usePage(limit) {
  const [searchParams, setSearchParams] = useSearchParams();
  const safeLimit = Number.isSafeInteger(limit) && limit > 0 ? limit : 1;
  const page = normalizePage(searchParams.get("page"), safeLimit);

  const setPage = (nextPage) => {
    const next = new URLSearchParams(searchParams);
    const normalized = normalizePage(nextPage, safeLimit);
    if (normalized <= 1) next.delete("page");
    else next.set("page", String(normalized));
    setSearchParams(next);
  };

  return { offset: (page - 1) * safeLimit, page, setPage };
}
