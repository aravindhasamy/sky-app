import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import Spinner from "react-bootstrap/Spinner";

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
  duration: number;
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

export default function AssetDetailPage() {
  const { name } = useParams<{ name: string }>();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!name) {
      setError("Invalid asset name");
      setLoading(false);
      return;
    }

    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch assets");
        return res.json();
      })
      .then((data: Asset[]) => {
        const decodedName = decodeURIComponent(name).toLowerCase().trim();
        const found = data.find(
          (a) => a.name.toLowerCase().trim() === decodedName
        );

        if (!found) {
          setError("Asset not found");
        } else {
          setAsset(found);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Unknown error");
        setLoading(false);
      });
  }, [name]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p>Loading asset details...</p>
      </div>
    );
  }

  if (error) {
    return <p className="text-danger text-center mt-5">Error: {error}</p>;
  }

  if (!asset) {
    return null;
  }

  return (
    <div className="container mt-4" style={{ maxWidth: 900 }}>
      <Link to="/assets" className="btn btn-link mb-3">
        ← Back to Asset List
      </Link>

      <Card className="p-4 shadow-sm">
        <div className="d-flex flex-row">
          <div>
            <img
              src={asset.videoImage || asset.assetImage}
              alt={asset.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: 6,
              }}
            />
          </div>

          <div className="ms-4 flex-grow-1 d-flex flex-column justify-content-start">
            <h2>{asset.name}</h2>
            <h6 className="text-muted mb-3">{asset.provider}</h6>
            <p>{asset.description}</p>
            <p>
              <strong>Duration:</strong> {formatDuration(asset.duration)}
            </p>
            <p>
              <strong>Genres:</strong>{" "}
              {asset.genre.map((g) => (
                <Badge bg="secondary" className="me-1" key={g}>
                  {g}
                </Badge>
              ))}
            </p>

            <h5 className="mt-auto">View Stats</h5>
            <p>
              <strong>Total Views: </strong>
              {asset.totalViews.total.toLocaleString()} (Previous:{" "}
              {asset.prevTotalViews.total.toLocaleString()})
            </p>
            <div className="d-flex gap-3 flex-wrap">
              {Object.keys(asset.totalViews).map((providerKey) => {
                if (providerKey === "total") return null;
                const current =
                  asset.totalViews[providerKey as keyof TotalViews];
                const prev =
                  asset.prevTotalViews[providerKey as keyof TotalViews];
                const diff = current - prev;
                const diffSign = diff > 0 ? "+" : "";
                return (
                  <div key={providerKey} style={{ minWidth: 120 }}>
                    <strong>{providerKey.toUpperCase()}</strong>
                    <p>
                      {current.toLocaleString()} ({diffSign}
                      {diff})
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
