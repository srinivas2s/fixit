'use client';

import { motion } from 'framer-motion';

const departments = [
  { name: 'Roads & Infrastructure', score: 92, avgTime: '24h', pending: 45 },
  { name: 'Sanitation & Waste', score: 88, avgTime: '36h', pending: 82 },
  { name: 'Water Board', score: 75, avgTime: '48h', pending: 115 },
  { name: 'Parks & Recreation', score: 95, avgTime: '18h', pending: 12 },
  { name: 'Traffic & Transport', score: 82, avgTime: '40h', pending: 56 },
];

export default function DepartmentScores() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="glass-card p-6"
    >
      <div className="mb-6">
        <h3 className="text-lg font-bold text-text-primary">Department Responsiveness</h3>
        <p className="text-sm text-text-secondary">Performance metrics by authority</p>
      </div>

      <div className="space-y-6">
        {departments.map((dept) => (
          <div key={dept.name}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-sm text-text-primary">{dept.name}</span>
              <span className="text-xs font-bold text-primary">{dept.score}/100 Score</span>
            </div>
            
            <div className="h-2 w-full bg-navy-light rounded-full overflow-hidden mb-2">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${dept.score}%` }}
                transition={{ duration: 1, delay: 0.8 }}
                className={`h-full rounded-full ${
                  dept.score >= 90 ? 'bg-primary' : 
                  dept.score >= 80 ? 'bg-blue-500' : 
                  dept.score >= 70 ? 'bg-amber-500' : 'bg-urgency-red'
                }`}
              />
            </div>
            
            <div className="flex items-center justify-between text-xs text-text-secondary">
              <span>Avg Resolution: {dept.avgTime}</span>
              <span>{dept.pending} pending</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
