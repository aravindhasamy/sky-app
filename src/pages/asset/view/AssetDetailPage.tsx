import React, { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import "../styles/Asset.css";
import { Asset, TotalViews } from "../interfaces";
import { Breadcrumb } from "react-bootstrap";

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
  const [bgLoaded, setBgLoaded] = useState(false);

  const fetchedRef = useRef(false);

  // After asset is fetched successfully
  useEffect(() => {
    if (asset) setBgLoaded(true);
  }, [asset]);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    if (!name) {
      setError("Invalid movie name");
      setLoading(false);
      return;
    }

    const fetchAsset = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        const data: Asset[] = await res.json();

        const decodedName = decodeURIComponent(name).toLowerCase().trim();
        const found = data.find(
          (a) => a.name.toLowerCase().trim() === decodedName
        );

        if (!found) {
          setError("Movie not found");
        } else {
          setAsset(found);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load movie details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAsset();
  }, [name]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 fs-5 text-muted">Loading movie details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
        <div className="text-center mt-3">
          <Link to="/assets" className="btn btn-primary">
            Back to Movies List
          </Link>
        </div>
      </div>
    );
  }

  if (!asset) {
    return null;
  }

  return (
    <div
      className={`asset-detail-background ${bgLoaded ? "loaded" : ""}`}
      style={{
        backgroundImage: `url(${asset.videoImage || asset.assetImage})`,
      }}
    >
      <div className="container mt-4 custom-container">
        <Breadcrumb>
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/assets" }}>
            Movies
          </Breadcrumb.Item>
          <Breadcrumb.Item data-testid="movie-title" active>{asset.name}</Breadcrumb.Item>
        </Breadcrumb>

        <Card className="p-4 shadow-sm">
          <div className="d-flex flex-row"> 
            <div>
              <img
                src={asset.videoImage || asset.assetImage}
                alt={asset.name}
                className="asset-detail-image"
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
                  <Badge bg="dark" className="me-1" key={g}>
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
                    <div key={providerKey} className="providerkey-container">
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
    </div>
  );
}
