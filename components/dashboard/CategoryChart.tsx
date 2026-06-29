'use client';

import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'Pothole', count: 840, color: '#ef4444' },
  { name: 'Streetlight', count: 520, color: '#eab308' },
  { name: 'Garbage', count: 430, color: '#a855f7' },
  { name: 'Water Leak', count: 320, color: '#3b82f6' },
  { name: 'Fallen Tree', count: 120, color: '#22c55e' },
  { name: 'Signage', count: 80, color: '#f97316' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-navy border border-card-border p-3 rounded-lg shadow-xl">
        <p className="font-medium text-text-primary mb-1">{label}</p>
        <p className="text-sm text-text-secondary">
          <span className="font-bold text-text-primary">{payload[0].value}</span> reports
        </p>
      </div>
    );
  }
  return null;
};

export default function CategoryChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card p-6 h-[400px] flex flex-col"
    >
      <div className="mb-6">
        <h3 className="text-lg font-bold text-text-primary">Issues by Category</h3>
        <p className="text-sm text-text-secondary">Distribution of reported problems</p>
      </div>
      
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#334155', opacity: 0.4 }} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
