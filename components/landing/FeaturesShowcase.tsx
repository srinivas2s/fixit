'use client';

import { motion } from 'framer-motion';
import {
  Bot,
  Flame,
  Shield,
  BarChart3,
  Target,
  Trophy,
} from 'lucide-react';

const features = [
  {
    icon: Bot,
    title: 'AI Vision Triage',
    description:
      'Auto-classifies issue type and severity from a single photo using Google Gemini Vision.',
    gradient: 'from-violet-500/20 to-violet-600/5',
  },
  {
    icon: Flame,
    title: 'Live Urgency Score',
    description:
      'Dynamic 0–100 score that rises with confirmations, time elapsed, and risk factors.',
    gradient: 'from-orange-500/20 to-orange-600/5',
  },
  {
    icon: Shield,
    title: 'Anti-Spam Trust Layer',
    description:
      'Reputation scoring prevents fake reports and system gaming. Earn trust through verified reports.',
    gradient: 'from-blue-500/20 to-blue-600/5',
  },
  {
    icon: BarChart3,
    title: 'Impact Dashboard',
    description:
      'Public transparency scores for every local authority. Track resolution rates and response times.',
    gradient: 'from-emerald-500/20 to-emerald-600/5',
  },
  {
    icon: Target,
    title: 'Predictive Hotspots',
    description:
      'AI predicts where problems will emerge next, not just react. Proactive infrastructure care.',
    gradient: 'from-rose-500/20 to-rose-600/5',
  },
  {
    icon: Trophy,
    title: 'Civic Badges',
    description:
      'Gamified engagement — earn Neighborhood Guardian, First Responder, and more for your contributions.',
    gradient: 'from-amber-500/20 to-amber-600/5',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function FeaturesShowcase() {
  return (
    <section className="py-24 relative">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy via-navy-light/30 to-navy" />

      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Built for{' '}
            <span className="gradient-text">real accountability</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Every feature is designed to close the gap between citizens reporting
            problems and authorities actually fixing them.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="glass-card-hover p-6 relative overflow-hidden group"
            >
              {/* Gradient background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-navy border border-card-border flex items-center justify-center mb-4 group-hover:border-primary/30 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>

                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
