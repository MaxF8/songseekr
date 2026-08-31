import { Link } from "react-router-dom";

import { artistNames, describeKey, formatDuration } from "../../utils/music";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

export default function TrackTable({ tracks }) {
  return (
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
          {tracks.map((track) => (
            <TableRow key={track.id}>
              <TableHead scope="row">
                <Link to={`/songs/${track.id}`}>{track.name}</Link>
                {track.album?.name && <span className="mobile-meta">{track.album.name}</span>}
              </TableHead>
              <TableCell>{artistNames(track.artists)}</TableCell>
              <TableCell>{describeKey(track.audioFeature)}</TableCell>
              <TableCell className="duration-column">{formatDuration(track.durationMs)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
