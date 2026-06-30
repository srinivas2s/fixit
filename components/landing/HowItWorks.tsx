'use client';

import { motion } from 'framer-motion';
import { Camera, MapPinned, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    icon: Camera,
    emoji: '📸',
    title: 'Snap',
    description:
      'Take a photo of any civic issue. AI identifies the problem type and severity instantly — no forms needed.',
    color: 'from-blue-500/20 to-blue-600/5',
    borderColor: 'border-blue-500/20',
    iconColor: 'text-blue-400',
  },
  {
    icon: MapPinned,
    emoji: '🗺️',
    title: 'Submit',
    description:
      'It appears on the live community map. Neighbors confirm, urgency score rises, duplicates are merged automatically.',
    color: 'from-primary/20 to-primary/5',
    borderColor: 'border-primary/20',
    iconColor: 'text-primary',
  },
  {
    icon: CheckCircle2,
    emoji: '✅',
    title: 'Track',
    description:
      'Auto-routed to the right department. Public status tracking until it\'s actually resolved. Full transparency.',
    color: 'from-emerald-500/20 to-emerald-600/5',
    borderColor: 'border-emerald-500/20',
    iconColor: 'text-emerald-400',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
};

export default function HowItWorks() {
  return (
    <section className="py-24 relative">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Three steps to a{' '}
            <span className="gradient-text">better neighborhood</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            No bureaucracy, no phone trees. Just snap, submit, and track until it&apos;s done.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              variants={itemVariants}
              className="relative"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[calc(50%+60px)] w-[calc(100%-120px)] h-px bg-gradient-to-r from-card-border to-card-border via-primary/30" />
              )}

              <div className={`glass-card-hover p-8 text-center relative overflow-hidden`}>
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-b ${step.color} opacity-50`} />

                <div className="relative z-10">
                  {/* Step number */}
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-5">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-navy border ${step.borderColor} mb-5`}>
                    <step.icon className={`w-7 h-7 ${step.iconColor}`} />
                  </div>

                  <h3 className="text-xl font-bold mb-3">
                    {step.emoji} {step.title}
                  </h3>

                  <p className="text-text-secondary leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
