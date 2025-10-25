import { useEffect, useRef, useState } from "react";
import {
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import dayjs from "dayjs";
import "../styles/TimeSeries.css";
import { TimeSeriesData } from "../interfaces";

export default function TimeSeriesPage() {
  const [data, setData] = useState<(TimeSeriesData & { date: string })[] | []>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const fetchData = async () => {
      try {
        const res = await fetch(
          "https://my-json-server.typicode.com/alb90/aieng-tech-test-timeseries/data"
        );
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const rawData: TimeSeriesData[] = await res.json();
        const formatted = rawData.map((item) => ({
          ...item,
          date: dayjs(item.timestamp).format("DD MMM YYYY"),
        }));
        setData(formatted);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load time series data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 fs-5 text-muted">Loading time series data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container my-5">
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      </div>
    );
  }

  return (
    <div className="container my-4 p-4 rounded time-series-custom-container">
      <Card className="p-4 shadow-sm border-0">
        <h3 className="mb-2 text-center time-series-title">
          Time Series Explorer
        </h3>
        <p className="text-center text-muted mb-4">
          Visualize the time-based data values over a date range
        </p>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 60, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0073c5" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#0073c5" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#dee2e6" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(ts) => dayjs(ts).format("DD MMM")}
              tick={{ fill: "#495057", fontWeight: 600 }}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis
              tickFormatter={(val) => val.toLocaleString()}
              tick={{ fill: "#495057", fontWeight: 600 }}
              width={50}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                borderRadius: 8,
                border: "1px solid #ced4da",
                boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
                fontWeight: 600,
              }}
              labelFormatter={(ts) => dayjs(ts).format("DD MMM YYYY, HH:mm")}
              formatter={(value: number) => value.toLocaleString()}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#0073c5"
              fillOpacity={1}
              fill="url(#colorValue)"
              strokeWidth={2}
              activeDot={{ r: 6, stroke: "#0056a3", strokeWidth: 2 }}
              cursor="pointer"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
