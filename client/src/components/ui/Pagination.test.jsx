import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

import Pagination, { mobilePaginationPages } from "./Pagination";

it("limits the mobile page window to three useful pages", () => {
  expect(mobilePaginationPages(1, 5)).toEqual([1, 2, 3]);
  expect(mobilePaginationPages(4, 10)).toEqual([3, 4, 5]);
  expect(mobilePaginationPages(10, 10)).toEqual([8, 9, 10]);
});

it("navigates the final valid page", () => {
  const onPageChange = vi.fn();
  render(
    <Pagination limit={24} offset={96} total={120} onPageChange={onPageChange} />
  );

  expect(screen.getByText("Page 5 of 5")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name: "Previous" }));
  expect(onPageChange).toHaveBeenCalledWith(4);
});

it("offers direct numbered navigation across a long result set", () => {
  const onPageChange = vi.fn();
  render(
    <Pagination limit={24} offset={48} total={504} onPageChange={onPageChange} />
  );

  expect(screen.getByRole("button", { name: "Page 3, current page" })).toHaveAttribute(
    "aria-current",
    "page"
  );
  fireEvent.click(screen.getByRole("button", { name: "Go to page 21" }));
  expect(onPageChange).toHaveBeenCalledWith(21);
});

it("recovers from an out-of-range page instead of becoming a dead end", () => {
  const onPageChange = vi.fn();
  render(
    <Pagination limit={24} offset={240} total={120} onPageChange={onPageChange} />
  );

  expect(screen.getByText("Page 5 of 5")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Previous" }));
  expect(onPageChange).toHaveBeenCalledWith(5);
});

it("does not render controls for malformed metadata", () => {
  const { container } = render(
    <Pagination limit={0} offset={Number.NaN} total={120} onPageChange={() => {}} />
  );
  expect(container).toBeEmptyDOMElement();
});
