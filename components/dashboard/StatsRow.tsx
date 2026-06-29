'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Clock, Building } from 'lucide-react';

const stats = [
  {
    title: 'Total Issues Reported',
    value: '2,341',
    change: '+12% this month',
    icon: AlertTriangle,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  {
    title: 'Resolved Issues',
    value: '1,892',
    change: '+18% this month',
    icon: CheckCircle2,
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    title: 'Avg Resolution Time',
    value: '42 hrs',
    change: '-4 hrs from last month',
    icon: Clock,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    title: 'Active Departments',
    value: '8',
    change: 'All departments online',
    icon: Building,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
];

export default function StatsRow() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-text-secondary text-sm font-medium">{stat.title}</h3>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.bg}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
          </div>
          <div className="text-3xl font-bold text-text-primary mb-1">{stat.value}</div>
          <div className="text-xs text-text-secondary">{stat.change}</div>
        </motion.div>
      ))}
    </div>
  );
}
