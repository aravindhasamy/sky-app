import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import "bootstrap/dist/css/bootstrap.min.css";
import AssetListPage from "./pages/asset/view/AssetListPage";
import AssetDetailPage from "./pages/asset/view/AssetDetailPage";
import TimeSeriesPage from "./pages/timeseries/view/TimeSeriesPage";
import Header from "./components/Header/view/Header";
import "./App.css";
import NotFoundPage from "./pages/notfound/NotFoundPage";

// Fallback UI for component errors
function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <div className="notfound-wrapper d-flex flex-column justify-content-center align-items-center text-center">
      <div className="card shadow-sm p-4" style={{ maxWidth: "500px" }}>
        <h2 className="card-title text-danger mb-3">Something went wrong</h2>
        <p className="card-text text-muted mb-3">
          An unexpected error occurred. Please try again.
        </p>
        <pre
          className="bg-light p-2 border rounded text-start w-100"
          style={{ whiteSpace: "pre-wrap" }}
        >
          {error.message}
        </pre>
        <button
          className="btn btn-primary btn-lg mt-3"
          onClick={resetErrorBoundary}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

// 404 Page

function App() {
  return (
    <Router>
      <Header />
      <div className="app-route-container">
        <Routes>
          {/* Redirect root to /assets */}
          <Route path="/" element={<Navigate to="/assets" replace />} />

          {/* Asset routes with error boundaries */}
          <Route
            path="/assets"
            element={
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <AssetListPage />
              </ErrorBoundary>
            }
          />
          <Route
            path="/assets/:name"
            element={
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <AssetDetailPage />
              </ErrorBoundary>
            }
          />

          {/* Time series route */}
          <Route
            path="/timeseries"
            element={
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <TimeSeriesPage />
              </ErrorBoundary>
            }
          />

          {/* Catch-all 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
