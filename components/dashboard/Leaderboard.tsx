'use client';

import { motion } from 'framer-motion';
import { Trophy, Medal, Award } from 'lucide-react';

const leaders = [
  { name: 'Sarah J.', reports: 142, badges: ['🔥', '✅', '🏠'], score: 1420 },
  { name: 'Michael T.', reports: 118, badges: ['✅', '🏠'], score: 1180 },
  { name: 'Priya R.', reports: 94, badges: ['⚡', '✅'], score: 940 },
  { name: 'David L.', reports: 86, badges: ['🏠'], score: 860 },
  { name: 'Anita K.', reports: 72, badges: ['✅'], score: 720 },
];

export default function Leaderboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass-card p-6"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-text-primary">Top Citizens</h3>
          <p className="text-sm text-text-secondary">Most active community members</p>
        </div>
        <Trophy className="w-6 h-6 text-amber-500" />
      </div>

      <div className="space-y-4">
        {leaders.map((leader, index) => (
          <div key={leader.name} className="flex items-center justify-between p-3 rounded-xl bg-navy-light/30 border border-card-border hover:bg-navy-light/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center font-bold text-sm text-text-secondary border border-card-border">
                {index === 0 ? <Medal className="w-4 h-4 text-amber-500" /> : 
                 index === 1 ? <Medal className="w-4 h-4 text-slate-300" /> : 
                 index === 2 ? <Medal className="w-4 h-4 text-amber-700" /> : 
                 `#${index + 1}`}
              </div>
              <div>
                <div className="font-medium text-text-primary">{leader.name}</div>
                <div className="flex items-center gap-1 mt-1">
                  {leader.badges.map((badge, i) => (
                    <span key={i} className="text-xs">{badge}</span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="font-bold text-primary">{leader.score} <span className="text-xs font-normal text-text-secondary">pts</span></div>
              <div className="text-xs text-text-secondary">{leader.reports} verified</div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
