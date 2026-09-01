import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import MediaGrid from "./MediaGrid";

it("filters media cards by title and owner metadata", () => {
  render(
    <MemoryRouter>
      <MediaGrid
        kind="playlist"
        filterLabel="Filter playlists"
        items={[
          { id: "one", name: "Morning songs", owner: "Max" },
          { id: "two", name: "Night songs", owner: "Taylor" },
        ]}
      />
    </MemoryRouter>
  );

  fireEvent.change(screen.getByRole("searchbox", { name: "Filter playlists" }), {
    target: { value: "Taylor" },
  });

  expect(screen.queryByRole("link", { name: /Morning songs/ })).not.toBeInTheDocument();
  expect(screen.getByRole("link", { name: /Night songs/ })).toBeInTheDocument();
  expect(screen.queryByText(/shown on this page/i)).not.toBeInTheDocument();
});
