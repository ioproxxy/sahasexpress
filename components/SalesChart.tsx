
import React from 'react';
// Note: In a real project, you would `npm install recharts`.
// For this environment, we assume it's globally available or polyfilled.
// We will use a placeholder if Recharts is not available.
// A real environment would have: import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Dummy components to avoid runtime errors if recharts isn't loaded by the environment
const ResponsiveContainer: React.FC<{ children: React.ReactNode; width: string | number; height: string | number }> = ({ children, width, height }) => <div style={{ width, height }}>{children}</div>;
const BarChart: React.FC<{ children: React.ReactNode; data: any[] }> = ({ children }) => <div>{children}</div>;
const Bar: React.FC<{ dataKey: string; fill: string }> = () => null;
const XAxis: React.FC<{ dataKey: string }> = () => null;
const YAxis: React.FC = () => null;
const CartesianGrid: React.FC<{ strokeDasharray: string }> = () => null;
const Tooltip: React.FC = () => null;
const Legend: React.FC = () => null;


interface SalesChartProps {
  data: { name: string; sales: number }[];
}

const SalesChart: React.FC<SalesChartProps> = ({ data }) => {
  // Check if recharts is available on the window object (a common way it's loaded from a CDN)
  // This is a defensive check for this specific coding environment.
  const Recharts = (window as any).Recharts;
  if (!Recharts) {
    return (
        <div className="w-full h-80 bg-gray-200 flex items-center justify-center rounded-lg">
            <p className="text-textSecondary">Chart library not available. Displaying mock data.</p>
        </div>
    );
  }

  const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = Recharts;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="sales" fill="#10B981" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SalesChart;
