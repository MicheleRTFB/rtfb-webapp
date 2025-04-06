import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Onboarding } from './pages/Onboarding';
import WorkoutDetails from './pages/WorkoutDetails';
import Schedule from './pages/Schedule';
import Calendar from './pages/Calendar';
import Dashboard from './pages/Dashboard';
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/workout" element={<WorkoutDetails />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
