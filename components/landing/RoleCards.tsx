'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Building2, Globe2, ArrowRight } from 'lucide-react';

const roles = [
  {
    icon: User,
    emoji: '👤',
    title: 'Citizen',
    description: 'Report civic issues, confirm reports from neighbors, track resolution, and earn recognition badges.',
    features: ['Report issues with photos', 'Confirm reports nearby', 'Track resolution status', 'Earn civic badges'],
    cta: 'Get Started',
    href: '/register',
    gradient: 'from-blue-500/10 to-blue-600/5',
    iconBg: 'bg-blue-500/10 border-blue-500/20',
    iconColor: 'text-blue-400',
  },
  {
    icon: Building2,
    emoji: '🏢',
    title: 'Department Admin',
    description: 'Receive auto-routed reports, update resolution status, and manage your department\'s queue.',
    features: ['Auto-routed issue queue', 'Update resolution status', 'View authority reports', 'Performance metrics'],
    cta: 'Admin Login',
    href: '/login',
    gradient: 'from-primary/10 to-primary/5',
    iconBg: 'bg-primary/10 border-primary/20',
    iconColor: 'text-primary',
  },
  {
    icon: Globe2,
    emoji: '🌆',
    title: 'Super Admin',
    description: 'Full city visibility, department oversight, report reassignment, and citywide analytics.',
    features: ['Full city overview', 'Department performance', 'Reassign misrouted reports', 'Citywide analytics'],
    cta: 'Admin Login',
    href: '/login',
    gradient: 'from-amber-500/10 to-amber-600/5',
    iconBg: 'bg-amber-500/10 border-amber-500/20',
    iconColor: 'text-amber-400',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
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

export default function RoleCards() {
  return (
    <section className="py-24">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            One platform, <span className="gradient-text">three powerful roles</span>
          </h2>
          <p className="text-text-secondary text-lg">
            Everyone has a part to play in making cities better.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {roles.map((role) => (
            <motion.div
              key={role.title}
              variants={itemVariants}
              className="glass-card relative overflow-hidden group"
            >
              {/* Gradient top */}
              <div className={`absolute inset-0 bg-gradient-to-b ${role.gradient} opacity-60`} />

              <div className="relative z-10 p-7">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl ${role.iconBg} border flex items-center justify-center mb-5`}>
                  <role.icon className={`w-7 h-7 ${role.iconColor}`} />
                </div>

                <h3 className="text-xl font-bold mb-2">
                  {role.emoji} {role.title}
                </h3>

                <p className="text-text-secondary text-sm leading-relaxed mb-5">
                  {role.description}
                </p>

                {/* Feature list */}
                <ul className="space-y-2 mb-6">
                  {role.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm text-text-secondary"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href={role.href}
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-light transition-colors group/link"
                >
                  {role.cta}
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
