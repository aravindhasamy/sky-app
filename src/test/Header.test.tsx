import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "../components/Header/view/Header";

describe("Header component", () => {
  test("renders the logo", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const logo = screen.getByAltText(/logo/i) as HTMLImageElement;
    expect(logo).toBeInTheDocument();
    expect(logo.src).toContain("test-file-stub"); // optional check for correct image
  });

  test("renders navigation links", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const assetsLink = screen.getByText(/assets/i) as HTMLAnchorElement;
    const timeseriesLink = screen.getByText(/timeseries/i) as HTMLAnchorElement;

    expect(assetsLink).toBeInTheDocument();
    expect(timeseriesLink).toBeInTheDocument();
    expect(assetsLink.href).toContain("/assets");
    expect(timeseriesLink.href).toContain("/timeseries");
  });

  test("active class is applied correctly based on route", () => {
    render(
      <MemoryRouter initialEntries={["/timeseries"]}>
        <Header />
      </MemoryRouter>
    );

    const assetsLink = screen.getByText(/assets/i);
    const timeseriesLink = screen.getByText(/timeseries/i);

    expect(assetsLink).not.toHaveClass("active");
    expect(timeseriesLink).toHaveClass("active");
  });
});
