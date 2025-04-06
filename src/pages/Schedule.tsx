import React from 'react';
import WeeklySchedule from '../components/WeeklySchedule';
import WorkoutHistory from '../components/WorkoutHistory';

export const Schedule: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <WeeklySchedule />
        <div className="mt-8">
          <WorkoutHistory />
        </div>
      </div>
    </div>
  );
};

export default Schedule; 