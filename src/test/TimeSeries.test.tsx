import { render, screen } from "@testing-library/react";
import TimeSeriesPage from "../pages/timeseries/view/TimeSeriesPage";

describe("TimeSeriesPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn() as jest.Mock;
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  test("renders loading spinner initially", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<TimeSeriesPage />);

    const loadingText = await screen.findByText(/loading time series data/i);
    expect(loadingText).toBeInTheDocument();
  });

  test("renders error message on fetch failure", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Failed fetch")
    );

    render(<TimeSeriesPage />);

    const errorMsg = await screen.findByText(
      /failed to load time series data/i
    );
    expect(errorMsg).toBeInTheDocument();
  });
});
