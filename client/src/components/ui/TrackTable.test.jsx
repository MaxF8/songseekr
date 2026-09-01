import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";

import TrackTable from "./TrackTable";

function LocationProbe() {
  return <output data-testid="location">{useLocation().pathname}</output>;
}

it("renders a durable track link and accessible table headers", () => {
  render(
    <MemoryRouter>
      <TrackTable
        tracks={[
          {
            id: "track123",
            name: "Test Song",
            artists: [{ name: "Test Artist" }],
            durationMs: 185000,
            audioFeature: { key: 9, mode: 1 },
          },
        ]}
      />
    </MemoryRouter>
  );

  expect(screen.getByRole("columnheader", { name: "Track" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Test Song" })).toHaveAttribute(
    "href",
    "/songs/track123"
  );
  expect(screen.getByText("A major")).toBeInTheDocument();
});

it("opens the track when another part of its row is clicked", () => {
  render(
    <MemoryRouter>
      <LocationProbe />
      <TrackTable
        tracks={[{
          id: "track123",
          name: "Test Song",
          artists: [{ name: "Test Artist" }],
          durationMs: 185000,
          audioFeature: { key: 9, mode: 1 },
        }]}
      />
    </MemoryRouter>
  );

  const row = screen.getByRole("link", { name: "Open Test Song" });
  fireEvent.click(screen.getByText("Test Artist"));
  expect(screen.getByTestId("location")).toHaveTextContent("/songs/track123");
  expect(row).toBeInTheDocument();
});

it("filters the visible track page by song, artist, album, or key", () => {
  render(
    <MemoryRouter>
      <TrackTable
        filterLabel="Filter liked songs"
        tracks={[
          {
            id: "track123",
            name: "Test Song",
            artists: [{ name: "First Artist" }],
            album: { name: "First Album" },
            durationMs: 185000,
            audioFeature: { key: 9, mode: 1 },
          },
          {
            id: "track456",
            name: "Another Song",
            artists: [{ name: "Second Artist" }],
            album: { name: "Second Album" },
            durationMs: 210000,
            audioFeature: { key: 0, mode: 0 },
          },
        ]}
      />
    </MemoryRouter>
  );

  fireEvent.change(screen.getByRole("searchbox", { name: "Filter liked songs" }), {
    target: { value: "second album" },
  });

  expect(screen.queryByRole("link", { name: "Test Song" })).not.toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Another Song" })).toBeInTheDocument();
  expect(screen.queryByText(/shown on this page/i)).not.toBeInTheDocument();
});
