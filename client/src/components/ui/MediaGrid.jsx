import { Link } from "react-router-dom";

import { artistNames } from "../../utils/music";

export default function MediaGrid({ items, kind }) {
  const routePrefix = kind === "playlist" ? "/playlists" : "/albums";

  return (
    <div className="media-grid">
      {items.map((item) => (
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
              ? [item.owner, item.total != null ? `${item.total} items` : null]
                  .filter(Boolean)
                  .join(" · ")
              : artistNames(item.artists)}
          </p>
        </article>
      ))}
    </div>
  );
}
