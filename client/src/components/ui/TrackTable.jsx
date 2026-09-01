import { Link, useNavigate } from "react-router-dom";

import useCollectionFilter from "../../hooks/useCollectionFilter";
import { artistNames, describeKey, formatDuration } from "../../utils/music";
import CollectionFilter from "./CollectionFilter";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

function trackSearchText(track) {
  return [
    track.name,
    artistNames(track.artists),
    track.album?.name,
    describeKey(track.audioFeature),
  ].filter(Boolean).join(" ");
}

export default function TrackTable({ filterLabel, toolbarEnd, tracks }) {
  const navigate = useNavigate();
  const { filteredItems, query, setQuery } = useCollectionFilter(tracks, trackSearchText);

  const openTrack = (trackId) => {
    navigate(`/songs/${trackId}`);
  };

  return (
    <>
      {filterLabel || toolbarEnd ? (
        <div className="track-list-toolbar">
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
        <div className="table-wrap">
          <Table className="track-table">
            <TableHeader>
              <TableRow>
                <TableHead scope="col">Track</TableHead>
                <TableHead scope="col">Artist</TableHead>
                <TableHead scope="col">Key</TableHead>
                <TableHead scope="col" className="duration-column">
                  Length
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((track) => (
                <TableRow
                  key={track.id}
                  className="track-row"
                  tabIndex={0}
                  role="link"
                  aria-label={`Open ${track.name}`}
                  onClick={() => openTrack(track.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      openTrack(track.id);
                    }
                  }}
                >
                  <TableHead scope="row">
                    <Link to={`/songs/${track.id}`}>{track.name}</Link>
                    {track.album?.name && (
                      <span className="mobile-meta">{track.album.name}</span>
                    )}
                  </TableHead>
                  <TableCell>{artistNames(track.artists)}</TableCell>
                  <TableCell>{describeKey(track.audioFeature)}</TableCell>
                  <TableCell className="duration-column">
                    {formatDuration(track.durationMs)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : query ? (
        <p className="collection-filter__empty" role="status">
          No tracks on this page match “{query}”.
        </p>
      ) : null}
    </>
  );
}
