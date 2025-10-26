import { useEffect, useRef, useState } from "react";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import { Link } from "react-router-dom";
import { Asset } from "../interfaces";

const API_URL =
  "https://my-json-server.typicode.com/alb90/aieng-tech-test-assets/data";

function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h ? h + "h " : ""}${m}m`;
}

export default function AssetListPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const fetchAssets = async () => {
      try {
        const res = await fetch(API_URL);

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data: Asset[] = await res.json();
        setAssets(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load movies. Please try again later.");
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 fs-5 text-muted">Loading movies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className=" mb-4 movies-title-container">
        <h1 className="movies-title">Movies</h1>
      </div>
      <div className="d-flex flex-wrap gap-3 justify-content-start">
        {assets.map((asset) => (
          <Card key={asset.name} className="shadow-sm card-custom">
            <Link
              to={`/assets/${encodeURIComponent(asset.name)}`}
              className="card-link"
            >
              <Card.Img
                variant="top"
                src={asset.videoImage || asset.assetImage}
                alt={asset.name}
                className="asset-list-card-image"
              />
              <Card.Body>
                <Card.Title data-testid="asset-title">{asset.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {asset.provider}
                </Card.Subtitle>
                <Card.Subtitle className="small">
                  {formatDuration(asset.duration)}
                </Card.Subtitle>
                <Card.Text>{asset.description.slice(0, 30)}...</Card.Text>
                <div>
                  {asset.genre.map((g) => (
                    <Badge bg="dark" key={g} className="me-1">
                      {g}
                    </Badge>
                  ))}
                </div>
              </Card.Body>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
