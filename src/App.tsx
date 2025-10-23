// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AssetListPage from './pages/AssetListPage';
import AssetDetailPage from './pages/AssetDetailPage';
import TimeSeriesPage from './pages/TimeSeriesPage';
import Header from './components/Header';

function App() {
  return (
    <Router>
      <Header /> 
      <div style={{ paddingTop: 70 }}>
      <Routes>
        <Route path="/" element={<Navigate to="/assets" replace />} />
        <Route path="/assets" element={<AssetListPage />} />
        <Route path="/assets/:name" element={<AssetDetailPage />} />
        <Route path="/timeseries" element={<TimeSeriesPage />} />
      </Routes>
    </div>
    </Router>
  );
}

export default App;
  