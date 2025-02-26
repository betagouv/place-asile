import { within, render, screen } from "@testing-library/react";
import { Header } from "../../src/app/components/Header";

describe("Header", () => {
  it("should show header elements when rendered", () => {
    // WHEN
    render(<Header />);

    // THEN
    const title = screen.getByRole("link", {
      name: "Place d’asile",
    });
    expect(title).toHaveAttribute("href", "/");
    const titleText = within(title).getByRole("heading", {
      level: 1,
      name: "Place d’asile",
    });
    expect(titleText).toBeInTheDocument();
    const help = screen.getByRole("button", { name: "Aide" });
    expect(help).toBeInTheDocument();
  });
});
