'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import StatsRow from '@/components/dashboard/StatsRow';
import CategoryChart from '@/components/dashboard/CategoryChart';
import TrendChart from '@/components/dashboard/TrendChart';
import Leaderboard from '@/components/dashboard/Leaderboard';
import DepartmentScores from '@/components/dashboard/DepartmentScores';

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Public <span className="gradient-text">Impact Dashboard</span>
            </h1>
            <p className="text-text-secondary text-lg max-w-3xl">
              Complete transparency into the city's civic health. Track how fast issues are being resolved, which departments are responsive, and who the top community contributors are.
            </p>
          </motion.div>

          <StatsRow />

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <TrendChart />
            <CategoryChart />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <DepartmentScores />
            <Leaderboard />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
