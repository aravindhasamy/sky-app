import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function NotFoundPage() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/assets", { replace: true });
  };

  return (
    <div className="notfound-wrapper d-flex flex-column justify-content-center align-items-center text-center">
      <h1 className="display-1 fw-bold mb-3">404</h1>
      <h2 className="mb-3">Page Not Found</h2>
      <p className="mb-4 text-muted">
        Oops! The page you are looking for does not exist. You can go back to
        the home page to continue exploring.
      </p>
      <button className="btn btn-primary btn-lg" onClick={handleGoHome}>
        Go Back Home
      </button>
    </div>
  );
}

export default NotFoundPage;
