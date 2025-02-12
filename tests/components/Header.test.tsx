import { expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Header } from "../../src/app/components/common/Header";

it("Header", () => {
  // WHEN
  render(<Header />);

  // THEN
  const title = screen.getByRole("link", { name: "Place d’asile" });
  expect(title).toBeDefined();
});
