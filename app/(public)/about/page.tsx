'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { ArrowRight, BrainCircuit, Map, ShieldCheck, Zap } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        {/* Hero Section */}
        <section className="section-container mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
              FixIt was born from frustration with civic systems that <span className="text-primary">don't listen.</span>
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed mb-10">
              We believe that keeping a city functional shouldn't require filling out forms, waiting on hold, or guessing if your report was ever seen. FixIt bridges the gap between citizens and authorities through total transparency and AI.
            </p>
          </motion.div>
        </section>

        {/* Problem vs Solution */}
        <section className="section-container mb-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-8 border-l-4 border-l-urgency-red/50"
            >
              <h3 className="text-2xl font-bold mb-4 text-urgency-red">The Old Way (The Problem)</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-text-secondary">
                  <span className="text-urgency-red mt-1">✗</span>
                  Complex forms and long waiting times on municipal hotlines.
                </li>
                <li className="flex items-start gap-3 text-text-secondary">
                  <span className="text-urgency-red mt-1">✗</span>
                  No public tracking. You report it, and it goes into a black box.
                </li>
                <li className="flex items-start gap-3 text-text-secondary">
                  <span className="text-urgency-red mt-1">✗</span>
                  Duplicate reports overwhelm departments, slowing down actual work.
                </li>
              </ul>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-8 border-l-4 border-l-primary"
            >
              <h3 className="text-2xl font-bold mb-4 text-primary">The FixIt Way (The Solution)</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-text-secondary">
                  <span className="text-primary mt-1">✓</span>
                  Snap a photo. AI instantly classifies the issue and calculates severity.
                </li>
                <li className="flex items-start gap-3 text-text-secondary">
                  <span className="text-primary mt-1">✓</span>
                  Live public map holds authorities accountable for resolution times.
                </li>
                <li className="flex items-start gap-3 text-text-secondary">
                  <span className="text-primary mt-1">✓</span>
                  Smart duplicate detection groups identical issues automatically.
                </li>
              </ul>
            </motion.div>
          </div>
        </section>

        {/* How AI Makes a Difference */}
        <section className="section-container mb-24 text-center">
          <h2 className="text-3xl font-bold mb-12">How AI powers FixIt</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-6 text-blue-400">
                <BrainCircuit className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold mb-3">Auto Classification</h4>
              <p className="text-text-secondary">
                Our vision AI instantly categorizes the issue (e.g., Pothole, Leak) and assigns a base severity score from 1-10 just by analyzing the photo.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center mb-6 text-amber-400">
                <Map className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold mb-3">Duplicate Detection</h4>
              <p className="text-text-secondary">
                By comparing geographic coordinates and photo similarity embeddings, AI flags duplicate reports to keep the department queue clean.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center mb-6 text-rose-400">
                <Zap className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold mb-3">Dynamic Urgency</h4>
              <p className="text-text-secondary">
                The Urgency Score isn't static. It climbs based on neighbor confirmations, elapsed time, and AI risk analysis, forcing critical issues to the top.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Accountability Loop */}
        <section className="section-container mb-24">
          <div className="bg-navy-light/50 border border-card-border rounded-3xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-center mb-12">The Accountability Loop</h2>
            
            <div className="flex flex-col md:flex-row items-center justify-between relative max-w-4xl mx-auto">
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-card-border -z-10 -translate-y-1/2" />
              
              <div className="flex flex-col items-center gap-3 bg-navy p-4 rounded-xl border border-card-border z-10 mb-8 md:mb-0">
                <ShieldCheck className="w-8 h-8 text-blue-400" />
                <span className="font-semibold text-sm">Citizen</span>
              </div>
              
              <div className="flex flex-col items-center gap-3 bg-navy p-4 rounded-xl border border-primary/50 z-10 mb-8 md:mb-0 shadow-[0_0_15px_rgba(34,197,94,0.15)]">
                <BrainCircuit className="w-8 h-8 text-primary" />
                <span className="font-semibold text-sm text-primary">AI Triage</span>
              </div>
              
              <div className="flex flex-col items-center gap-3 bg-navy p-4 rounded-xl border border-card-border z-10 mb-8 md:mb-0">
                <Map className="w-8 h-8 text-amber-400" />
                <span className="font-semibold text-sm">Public Map</span>
              </div>
              
              <div className="flex flex-col items-center gap-3 bg-navy p-4 rounded-xl border border-card-border z-10">
                <ShieldCheck className="w-8 h-8 text-rose-400" />
                <span className="font-semibold text-sm">Department</span>
              </div>
            </div>
            <p className="text-center text-text-secondary mt-8 max-w-2xl mx-auto">
              Once an issue is reported, it cannot be deleted by a department without public transparency. The loop only closes when the issue is verified as resolved.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="section-container text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to fix your neighborhood?</h2>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary-hover text-navy font-bold rounded-full text-lg transition-all hover:shadow-xl hover:shadow-primary/25 hover:scale-105"
          >
            Get Started Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}
