import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

import Pagination from "./Pagination";

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
