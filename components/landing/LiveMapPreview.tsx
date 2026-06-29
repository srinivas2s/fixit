'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { MapPin, Navigation2 } from 'lucide-react';

export default function LiveMapPreview() {
  return (
    <section className="py-24 relative overflow-hidden bg-navy-light/30 border-y border-card-border">
      <div className="section-container">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              See what's broken in your city, <span className="text-primary">right now</span>
            </h2>
            <p className="text-text-secondary text-lg max-w-xl">
              Our live community map tracks every reported issue. Watch the heatmap to see which neighborhoods need the most attention.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-6 md:mt-0"
          >
            <Link 
              href="/map"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-card-border hover:border-primary/50 text-text-primary font-semibold rounded-full transition-all"
            >
              <Navigation2 className="w-5 h-5 text-primary" />
              Explore Live Map
            </Link>
          </motion.div>
        </div>

        {/* Map Placeholder Graphic */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative w-full h-[500px] rounded-3xl overflow-hidden border border-card-border bg-[#0f172a] shadow-2xl shadow-black/50"
        >
          {/* Faux Map Background (Grid pattern to simulate map structure) */}
          <div className="absolute inset-0 opacity-20"
               style={{ 
                 backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)',
                 backgroundSize: '40px 40px' 
               }}
          />
          
          {/* Faux Roads */}
          <div className="absolute top-1/2 left-0 w-full h-4 bg-slate-800/50 -rotate-12 transform origin-left" />
          <div className="absolute top-1/4 left-0 w-full h-2 bg-slate-800/40 rotate-6 transform origin-left" />
          <div className="absolute top-0 left-1/3 w-3 h-full bg-slate-800/50 rotate-12 transform origin-top" />

          {/* Faux Heatmap Glow */}
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-urgency-red/20 rounded-full blur-[80px]" />
          <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-urgency-orange/20 rounded-full blur-[60px]" />
          <div className="absolute bottom-1/4 left-1/4 w-56 h-56 bg-primary/20 rounded-full blur-[70px]" />

          {/* Map Pins */}
          <div className="absolute top-[45%] left-[30%] flex flex-col items-center animate-bounce" style={{ animationDelay: '0ms', animationDuration: '2s' }}>
            <div className="w-8 h-8 rounded-full bg-urgency-red flex items-center justify-center shadow-lg shadow-urgency-red/50">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <div className="w-1 h-1 bg-urgency-red rounded-full mt-1" />
          </div>

          <div className="absolute top-[35%] right-[28%] flex flex-col items-center animate-bounce" style={{ animationDelay: '500ms', animationDuration: '2.5s' }}>
            <div className="w-6 h-6 rounded-full bg-urgency-orange flex items-center justify-center shadow-lg shadow-urgency-orange/50">
              <MapPin className="w-3 h-3 text-white" />
            </div>
            <div className="w-1 h-1 bg-urgency-orange rounded-full mt-1" />
          </div>

          <div className="absolute bottom-[30%] left-[40%] flex flex-col items-center animate-bounce" style={{ animationDelay: '200ms', animationDuration: '2.2s' }}>
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/50">
              <MapPin className="w-3.5 h-3.5 text-navy" />
            </div>
            <div className="w-1 h-1 bg-primary rounded-full mt-1" />
          </div>

          {/* UI Overlay */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
            <div className="glass-card px-4 py-2 flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-urgency-red shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                <span className="text-xs font-medium text-text-secondary">Critical</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-urgency-orange shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
                <span className="text-xs font-medium text-text-secondary">High</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                <span className="text-xs font-medium text-text-secondary">Low</span>
              </div>
            </div>
            <div className="glass-card p-2 rounded-xl flex flex-col gap-2">
              <div className="w-6 h-6 bg-navy border border-card-border rounded flex items-center justify-center text-text-secondary font-bold text-xs">+</div>
              <div className="w-6 h-6 bg-navy border border-card-border rounded flex items-center justify-center text-text-secondary font-bold text-xs">-</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
