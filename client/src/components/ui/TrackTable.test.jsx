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
