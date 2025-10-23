import { useEffect, useState } from "react";
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
import dayjs from "dayjs";

interface TimeSeriesData {
  timestamp: number;
  value: number;
}

export default function TimeSeriesPage() {
  const [data, setData] = useState<
    (TimeSeriesData & { date: string })[] | null
  >(null);

  useEffect(() => {
    fetch(
      "https://my-json-server.typicode.com/alb90/aieng-tech-test-timeseries/data"
    )
      .then((res) => res.json())
      .then((rawData: TimeSeriesData[]) => {
        const formatted = rawData.map((item) => ({
          ...item,
          date: dayjs(item.timestamp).format("DD MMM YYYY"),
        }));
        setData(formatted);
      })
      .catch(console.error);
  }, []);

  if (!data) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 fs-5 text-muted">Loading time series data...</p>
      </div>
    );
  }

  return (
    <div
      className="container my-4 p-4 rounded"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <Card className="p-4 shadow-sm border-0">
        <h3 className="mb-2 text-center" style={{ color: "#0073c5" }}>
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
