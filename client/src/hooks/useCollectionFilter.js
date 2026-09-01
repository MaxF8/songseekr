import { useMemo, useState } from "react";

function normalizeSearchValue(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replaceAll(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase()
    .trim();
}

export default function useCollectionFilter(items, getSearchText) {
  const [query, setQuery] = useState("");
  const normalizedQuery = normalizeSearchValue(query);
  const safeItems = useMemo(() => (Array.isArray(items) ? items : []), [items]);

  const filteredItems = useMemo(() => {
    if (!normalizedQuery) return safeItems;

    return safeItems.filter((item) =>
      normalizeSearchValue(getSearchText(item)).includes(normalizedQuery)
    );
  }, [getSearchText, normalizedQuery, safeItems]);

  return {
    filteredItems,
    query,
    setQuery,
  };
}
