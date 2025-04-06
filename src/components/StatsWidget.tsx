import React from 'react';

interface StatsWidgetProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  percentage?: number;
  color?: string;
}

const StatsWidget: React.FC<StatsWidgetProps> = ({
  icon,
  title,
  value,
  subtitle,
  percentage,
  color = 'emerald'
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-gray-500">
          {icon}
        </div>
        <h3 className="text-lg font-medium text-gray-700">{title}</h3>
      </div>

      {percentage !== undefined && (
        <div className="relative pt-1">
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-100">
            <div
              style={{ width: `${percentage}%` }}
              className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-${color}-500`}
            ></div>
          </div>
        </div>
      )}

      <div className="text-center">
        <h4 className="text-3xl font-bold text-gray-800 mb-2">{value}</h4>
        <p className="text-sm text-gray-600">{subtitle}</p>
      </div>
    </div>
  );
};

export default StatsWidget; 