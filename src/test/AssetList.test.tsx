import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import TimeSeriesPage from "../pages/timeseries/view/TimeSeriesPage";

// Mock ResizeObserver to prevent recharts errors
beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

const mockData = [
  { timestamp: "2025-10-24T00:00:00Z", value: 12 },
  { timestamp: "2025-10-25T00:00:00Z", value: 24 },
];

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("TimeSeriesPage", () => {
  beforeEach(() => {
    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      } as Response)
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("renders loading spinner initially", () => {
    renderWithRouter(<TimeSeriesPage />);
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  test("renders chart when data loads successfully", async () => {
    renderWithRouter(<TimeSeriesPage />);

    expect(screen.getByText(/Time Series Explorer/i)).toBeInTheDocument();

    expect(await screen.findByText("24 Oct")).toBeInTheDocument();
    expect(await screen.findByText("25 Oct")).toBeInTheDocument();
  });

  test("renders error message on failed fetch", async () => {
    jest.restoreAllMocks();
    jest
      .spyOn(global, "fetch")
      .mockImplementation(() => Promise.reject(new Error("Failed fetch")));

    renderWithRouter(<TimeSeriesPage />);

    expect(
      screen.getByText(/Failed to load time series data/i)
    ).toBeInTheDocument();
  });
});
