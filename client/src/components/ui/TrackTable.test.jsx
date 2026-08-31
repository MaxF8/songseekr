import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import TrackTable from "./TrackTable";

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
