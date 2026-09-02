import { Link } from "react-router-dom";

import useCollectionFilter from "../../hooks/useCollectionFilter";
import { artistNames } from "../../utils/music";
import CollectionFilter from "./CollectionFilter";

function mediaSearchText(item) {
  return [item.name, item.owner, artistNames(item.artists)].filter(Boolean).join(" ");
}

export default function MediaGrid({ filterLabel, items, kind, toolbarEnd }) {
  const routePrefix = kind === "playlist" ? "/playlists" : "/albums";
  const { filteredItems, query, setQuery } = useCollectionFilter(items, mediaSearchText);

  return (
    <>
      {filterLabel || toolbarEnd ? (
        <div className="track-list-toolbar media-grid-toolbar">
          {filterLabel ? (
            <CollectionFilter
              label={filterLabel}
              value={query}
              onChange={setQuery}
            />
          ) : null}
          {toolbarEnd}
        </div>
      ) : null}

      {filteredItems.length > 0 ? (
        <div className="media-grid">
          {filteredItems.map((item) => (
            <article className="media-card" key={item.id}>
              <Link className="media-card__link" to={`${routePrefix}/${item.id}`}>
                {item.image ? (
                  <img
                    className="media-card__image"
                    src={item.image}
                    alt=""
                    loading="lazy"
                    width="320"
                    height="320"
                  />
                ) : (
                  <span className="media-card__placeholder" aria-hidden="true">
                    ♪
                  </span>
                )}
                <span className="media-card__title">{item.name}</span>
              </Link>
              <p className="media-card__meta">
                {kind === "playlist"
                  ? [item.owner, item.total != null ? `${item.total} tracks` : null]
                      .filter(Boolean)
                      .join(" · ")
                  : artistNames(item.artists)}
              </p>
            </article>
          ))}
        </div>
      ) : query ? (
        <p className="collection-filter__empty" role="status">
          No {kind === "playlist" ? "playlists" : "albums"} on this page match “{query}”.
        </p>
      ) : null}
    </>
  );
}
