import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import RaceDatabasePage from './pages/RaceDatabasePage';
import RunningShoeWidget from './components/RunningShoeWidget';
import RaceWidgetPage from './pages/RaceWidgetPage';
import WidgetsPage from './pages/WidgetsPage';
import AthletesPage from './pages/AthletesPage';
import AthleteStatsPage from './pages/AthleteStatsPage';
import ApiTestPage from './pages/ApiTestPage';
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/races" element={<RaceDatabasePage />} />
        <Route path="/shoes" element={<RunningShoeWidget />} />
        <Route path="/race-widget" element={<RaceWidgetPage />} />
        <Route path="/widgets" element={<WidgetsPage />} />
        <Route path="/athletes" element={<AthletesPage />} />
        <Route path="/athletes/:athleteId/stats" element={<AthleteStatsPage />} />
        <Route path="/api-test" element={<ApiTestPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
