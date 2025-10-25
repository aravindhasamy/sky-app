import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import AssetDetailPage from "../pages/asset/view/AssetDetailPage";

const mockAssets = [
  {
    name: "Movie A",
    provider: "Netflix",
    description: "A great movie about AI and humanity.",
    duration: 7200,
    genre: ["Drama", "Sci-Fi"],
    assetImage: "movie-a.jpg",
    videoImage: "",
    totalViews: {
      total: 100000,
      netflix: 20000,
      prime: 30000,
      hulu: 50000,
    },
    prevTotalViews: {
      total: 95000,
      netflix: 15000,
      prime: 25000,
      hulu: 55000,
    },
  },
];

beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockAssets),
    })
  ) as jest.Mock;
});

afterEach(() => {
  jest.clearAllMocks();
});

function renderWithRouter(initialRoute: string) {
  render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/assets/:name" element={<AssetDetailPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("AssetDetailPage", () => {
  test("renders loading spinner initially", async () => {
    renderWithRouter("/assets/Movie%20A");

    // Wait for the loading spinner to appear
    const spinner = await screen.findByText(/Loading movie details/i);
    expect(spinner).toBeInTheDocument();
  });

  test("renders asset details when data loads successfully", async () => {
    renderWithRouter("/assets/Movie%20A");

    // Wait for async fetch to resolve
    const movieTitle = await screen.findByText(/^Movie A/i);
    expect(movieTitle).toBeInTheDocument();

    const netflixElements = await screen.findAllByText(/^Netflix$/i);
    expect(netflixElements.length).toBeGreaterThan(0);

    expect(await screen.findByText(/Duration:/i)).toBeInTheDocument();
    expect(await screen.findByText(/Drama/i)).toBeInTheDocument();
  });

  test("renders 'Movie not found' when no match exists", async () => {
    renderWithRouter("/assets/UnknownMovie");

    const errorText = await screen.findByText(/Movie not found/i);
    expect(errorText).toBeInTheDocument();
  });

  test("renders error message on failed fetch", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});

    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error("Failed fetch"))
    );

    await renderWithRouter("/assets/Movie%20A");

    expect(
      await screen.findByText(/Failed to load movie details/i)
    ).toBeInTheDocument();

    jest.restoreAllMocks(); // restore after test
  });

  test("renders error for invalid name param", async () => {
    render(
      <MemoryRouter initialEntries={["/assets/"]}>
        <Routes>
          <Route path="/assets/" element={<AssetDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    const errorText = await screen.findByText(/Invalid movie name/i);
    expect(errorText).toBeInTheDocument();
  });
});
