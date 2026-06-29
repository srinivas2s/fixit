'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Camera, MapPin, CheckCircle, ArrowRight, Smartphone } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Animated dot grid background */}
      <div className="absolute inset-0 dot-grid" />

      {/* Gradient orbs for depth */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/3 rounded-full blur-3xl" />

      <div className="section-container relative z-10 grid lg:grid-cols-2 gap-12 items-center py-20">
        {/* Left: Text content */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              AI-Powered Civic Intelligence
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-6">
              See It. Snap It.{' '}
              <span className="gradient-text">Get It Fixed.</span>
            </h1>

            <p className="text-lg md:text-xl text-text-secondary leading-relaxed mb-8 max-w-xl">
              AI-powered civic reporting that holds authorities accountable — snap
              a photo, watch it get fixed. No paperwork, no runaround.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/report"
                className="group inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-navy font-semibold rounded-full text-base transition-all hover:shadow-xl hover:shadow-primary/25 hover:scale-105"
              >
                Report an Issue
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/map"
                className="inline-flex items-center gap-2 px-6 py-3 border border-slate-400/30 hover:border-primary/50 text-text-primary font-semibold rounded-full text-base transition-all hover:bg-white/5"
              >
                <MapPin className="w-4 h-4" />
                View Live Map
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Right: Animated phone mockup */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="hidden lg:flex justify-center"
        >
          <div className="relative">
            {/* Phone frame */}
            <div className="w-72 h-[580px] bg-navy-light rounded-[3rem] border-2 border-card-border p-3 shadow-2xl shadow-black/50 animate-float">
              {/* Screen */}
              <div className="w-full h-full bg-navy rounded-[2.5rem] overflow-hidden relative">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-navy-light rounded-b-2xl z-10" />

                {/* App content */}
                <div className="p-5 pt-10 h-full flex flex-col">
                  {/* Status bar */}
                  <div className="flex items-center justify-between mb-4 text-xs text-text-secondary">
                    <span>9:41</span>
                    <div className="flex items-center gap-1">
                      <Smartphone className="w-3 h-3" />
                    </div>
                  </div>

                  {/* App header */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
                      <span className="text-navy text-xs font-bold">F</span>
                    </div>
                    <span className="text-sm font-semibold">FixIt</span>
                  </div>

                  {/* Camera capture area */}
                  <div className="flex-1 bg-navy-lighter/50 rounded-2xl border border-card-border flex flex-col items-center justify-center gap-3 mb-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-dashed border-primary/30 flex items-center justify-center">
                      <Camera className="w-7 h-7 text-primary" />
                    </div>
                    <p className="text-xs text-text-secondary text-center px-4">
                      Tap to capture civic issue
                    </p>
                  </div>

                  {/* AI classification preview */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                    className="bg-primary/10 border border-primary/20 rounded-xl p-3 mb-3"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span className="text-xs font-medium text-primary">
                        AI Detected: Pothole
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-text-secondary">
                        Severity: 7/10
                      </span>
                      <div className="flex-1 h-1.5 bg-navy-lighter rounded-full overflow-hidden">
                        <div className="w-[70%] h-full bg-urgency-orange rounded-full" />
                      </div>
                    </div>
                  </motion.div>

                  {/* Submit button */}
                  <div className="bg-primary text-navy text-center py-2.5 rounded-xl text-sm font-semibold">
                    Submit Report →
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute -left-16 top-1/4 glass-card px-3 py-2 flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-full bg-urgency-red/20 flex items-center justify-center">
                <span className="text-urgency-red text-sm">🔥</span>
              </div>
              <div>
                <div className="text-xs font-medium">Urgency: 85</div>
                <div className="text-xs text-text-secondary">Critical</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.5, duration: 0.5 }}
              className="absolute -right-12 top-1/2 glass-card px-3 py-2 flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary text-sm">✅</span>
              </div>
              <div>
                <div className="text-xs font-medium">Resolved</div>
                <div className="text-xs text-text-secondary">2h ago</div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="absolute bottom-0 left-0 right-0 border-t border-card-border bg-navy/80 backdrop-blur-xl"
      >
        <div className="section-container py-5 flex flex-wrap justify-center gap-8 md:gap-16 text-center">
          {[
            { value: '2,341', label: 'Issues Reported' },
            { value: '1,892', label: 'Resolved' },
            { value: '47', label: 'Cities Active' },
          ].map((stat) => (
            <div key={stat.label}>
              <span className="text-2xl md:text-3xl font-bold text-text-primary">
                {stat.value}
              </span>
              <span className="text-sm text-text-secondary ml-2">{stat.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
