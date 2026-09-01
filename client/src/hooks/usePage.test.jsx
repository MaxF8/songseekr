import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";

import usePage, { normalizePage } from "./usePage";

function PageProbe() {
  const { offset, page, setPage } = usePage(24);
  const location = useLocation();
  return (
    <>
      <output data-testid="page">{page}</output>
      <output data-testid="offset">{offset}</output>
      <output data-testid="search">{location.search}</output>
      <button onClick={() => setPage(1)}>First</button>
      <button onClick={() => setPage(5)}>Fifth</button>
    </>
  );
}

it("maps late pages to exact safe offsets", () => {
  render(
    <MemoryRouter initialEntries={["/albums?page=5"]}>
      <PageProbe />
    </MemoryRouter>
  );

  expect(screen.getByTestId("page")).toHaveTextContent("5");
  expect(screen.getByTestId("offset")).toHaveTextContent("96");
  fireEvent.click(screen.getByRole("button", { name: "First" }));
  expect(screen.getByTestId("search")).toHaveTextContent("");
  fireEvent.click(screen.getByRole("button", { name: "Fifth" }));
  expect(screen.getByTestId("search")).toHaveTextContent("?page=5");
});

it("rejects malformed and overflow page values", () => {
  expect(normalizePage("5oops", 24)).toBe(1);
  expect(normalizePage("-5", 24)).toBe(1);
  expect(normalizePage("0", 24)).toBe(1);
  expect(normalizePage("1.5", 24)).toBe(1);
  expect(normalizePage("Infinity", 24)).toBe(1);
  expect(Number.isSafeInteger((normalizePage("999999999999999999999", 24) - 1) * 24)).toBe(
    true
  );
});
