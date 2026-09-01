import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi } from "vitest";

import AlbumData from "./AlbumData/AlbumData";
import AlbumPage from "./AlbumPage/AlbumPage";
import LikedSongPage from "./LikedSongPage/LikedSongPage";
import PlaylistData from "./PlaylistData/PlaylistData";
import PlaylistPage from "./PlaylistPage/PlaylistPage";

const mocks = vi.hoisted(() => ({
  useApiResource: vi.fn(),
  useArtworkTheme: vi.fn(),
}));

vi.mock("../hooks/useApiResource", () => ({ default: mocks.useApiResource }));
vi.mock("../hooks/useArtworkTheme", () => ({ default: mocks.useArtworkTheme }));

const emptyPage = { items: [], total: 120, limit: 24, offset: 96 };

it.each([
  ["playlists", PlaylistPage, "/playlists?page=5", "/playlists", "/api/me/playlists?limit=24&offset=96"],
  ["albums", AlbumPage, "/albums?page=5", "/albums", "/api/me/albums?limit=24&offset=96"],
  ["liked songs", LikedSongPage, "/liked-songs?page=5", "/liked-songs", "/api/me/tracks?limit=24&offset=96"],
])("keeps %s page 5 navigable when all entries on that page are unavailable", (_, Component, entry, route, expectedRequest) => {
  mocks.useApiResource.mockReturnValue({ data: emptyPage, error: null, loading: false, retry: vi.fn() });

  render(
    <MemoryRouter initialEntries={[entry]}>
      <Routes><Route path={route} element={<Component />} /></Routes>
    </MemoryRouter>
  );

  expect(mocks.useApiResource).toHaveBeenLastCalledWith(expectedRequest);
  expect(screen.getAllByText("Page 5 of 5").length).toBeGreaterThan(0);
});

it.each([
  [
    "playlist tracks",
    PlaylistData,
    "/playlists/playlist1?page=5",
    "/playlists/:playlistId",
    "/api/playlists/playlist1/items?limit=16&offset=64",
    { playlist: { id: "playlist1", name: "Playlist", image: null, owner: null } },
  ],
  [
    "album tracks",
    AlbumData,
    "/albums/album1?page=5",
    "/albums/:albumId",
    "/api/albums/album1?limit=16&offset=64",
    { album: { id: "album1", name: "Album", image: null, artists: [] } },
  ],
])("keeps %s page 5 navigable when its media entries are unavailable", (_, Component, entry, route, expectedRequest, metadata) => {
  mocks.useApiResource.mockReturnValue({
    data: { ...metadata, items: [], total: 80, limit: 16, offset: 64, audioFeaturesAvailable: true },
    error: null,
    loading: false,
    retry: vi.fn(),
  });

  render(
    <MemoryRouter initialEntries={[entry]}>
      <Routes><Route path={route} element={<Component />} /></Routes>
    </MemoryRouter>
  );

  expect(mocks.useApiResource).toHaveBeenLastCalledWith(expectedRequest);
  expect(screen.getByText("Page 5 of 5")).toBeInTheDocument();
});
