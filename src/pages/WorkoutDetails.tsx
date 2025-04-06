import React from 'react';
import { useLocation } from 'react-router-dom';
import WorkoutCard from '../components/WorkoutCard';

const WorkoutDetails: React.FC = () => {
  const location = useLocation();
  const { workout } = location.state || {};

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <WorkoutCard workout={workout} onClose={() => window.history.back()} />
      </div>
    </div>
  );
};

export default WorkoutDetails; 