'use client';

import { motion } from 'framer-motion';
import ReportForm from '@/components/report/ReportForm';

export default function ReportPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] py-12 px-4 relative overflow-hidden">
      {/* Background aesthetics */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Report a <span className="text-primary">Civic Issue</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            Snap a photo and let our AI handle the rest. Your report will be instantly routed to the correct department and tracked publicly.
          </p>
        </motion.div>

        <ReportForm />
      </div>
    </div>
  );
}
