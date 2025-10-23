// src/pages/AssetListPage.tsx
import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import Spinner from "react-bootstrap/Spinner";
import { Link } from "react-router-dom";

interface TotalViews {
  total: number;
  "sky-go": number;
  "now-tv": number;
  peacock: number;
}

interface Asset {
  name: string;
  totalViews: TotalViews;
  prevTotalViews: TotalViews;
  description: string;
  duration: number; // seconds
  assetImage: string;
  videoImage: string;
  provider: string;
  genre: string[];
}

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

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch assets");
        return res.json();
      })
      .then((data: Asset[]) => {
        setAssets(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Unknown error");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p>Loading assets...</p>
      </div>
    );
  }

  if (error) {
    return <p className="text-danger text-center mt-5">Error: {error}</p>;
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Movies</h1>
      <div className="d-flex flex-wrap gap-3 justify-content-start">
        {assets.map((asset) => (
          <Card
            key={asset.name}
            style={{ width: "48%", padding: 10 }}
            className="shadow-sm"
          >
            <Link
              to={`/assets/${encodeURIComponent(asset.name)}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Card.Img
                variant="top"
                src={asset.videoImage || asset.assetImage}
                alt={asset.name}
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "contain",
                  borderRadius: 6,
                }}
              />
              <Card.Body>
                <Card.Title>{asset.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {asset.provider}
                </Card.Subtitle>
                <Card.Text>{asset.description.slice(0, 80)}...</Card.Text>
                <div>
                  <Badge bg="secondary" className="me-1">
                    {formatDuration(asset.duration)}
                  </Badge>
                  {asset.genre.map((g) => (
                    <Badge bg="secondary" key={g} className="me-1">
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
