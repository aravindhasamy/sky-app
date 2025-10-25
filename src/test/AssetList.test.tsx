import React from "react";
import { render, screen, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AssetListPage from "../pages/asset/view/AssetListPage";
// import AssetListPage from "../pages/AssetListPage";

const mockAssets = [
  {
    name: "Movie A",
    provider: "Netflix",
    description: "A great movie about AI and humanity.",
    duration: 7200,
    genre: ["Drama", "Sci-Fi"],
    assetImage: "movie-a.jpg",
    videoImage: "",
  },
  {
    name: "Movie B",
    provider: "Prime Video",
    description: "An exciting thriller.",
    duration: 5400,
    genre: ["Thriller"],
    assetImage: "movie-b.jpg",
    videoImage: "",
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
  jest.clearAllMocks();
  global.fetch = jest.fn() as jest.Mock;
});

afterEach(() => {
  jest.resetAllMocks();
});

describe("AssetListPage", () => {
  test("renders loading spinner initially", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockAssets,
    });

    render(
      <MemoryRouter>
        <AssetListPage />
      </MemoryRouter>
    );

    const loadingText = await screen.findByText(/loading assets/i);
    expect(loadingText).toBeInTheDocument();
  });

  test("renders list of assets after successful fetch", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockAssets,
    });

    await act(async () => {
      render(
        <MemoryRouter>
          <AssetListPage />
        </MemoryRouter>
      );
    });

    const movieA = await screen.findByText("Movie A");
    const movieB = await screen.findByText("Movie B");

    expect(movieA).toBeInTheDocument();
    expect(movieB).toBeInTheDocument();

    // Providers
    expect(await screen.findByText("Netflix")).toBeInTheDocument();
    expect(await screen.findByText("Prime Video")).toBeInTheDocument();

    // Genres
    expect(await screen.findByText("Drama")).toBeInTheDocument();
    expect(await screen.findByText("Sci-Fi")).toBeInTheDocument();
    expect(await screen.findByText("Thriller")).toBeInTheDocument();

    // Duration formatting check
    expect(await screen.findByText("2h 0m")).toBeInTheDocument(); // Movie A 7200s
    expect(await screen.findByText("1h 30m")).toBeInTheDocument(); // Movie B 5400s

    // Truncated description
    expect(screen.getByText(/A great movie about AI and hum/i)).toBeInTheDocument();
    expect(screen.getByText(/An exciting thriller/i)).toBeInTheDocument();
  });

  test("renders error message on failed fetch", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Fetch failed"));

    jest.spyOn(console, "error").mockImplementation(() => {});

    await act(async () => {
      render(
        <MemoryRouter>
          <AssetListPage />
        </MemoryRouter>
      );
    });

    expect(
      await screen.findByText(/Failed to load movies/i)
    ).toBeInTheDocument();

    jest.restoreAllMocks();
  });
});
