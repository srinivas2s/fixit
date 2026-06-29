'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { TrendingUp, Clock, Users } from 'lucide-react';

const stats = [
  {
    value: 89,
    suffix: '%',
    label: 'Resolution Rate',
    description: 'Issues reported are resolved within 30 days',
    icon: TrendingUp,
    color: 'text-primary',
  },
  {
    value: 48,
    prefix: '<',
    suffix: 'hr',
    label: 'Avg Response Time',
    description: 'Departments acknowledge within 48 hours',
    icon: Clock,
    color: 'text-blue-400',
  },
  {
    value: 12000,
    suffix: '+',
    label: 'Active Citizens',
    description: 'Community members making their cities better',
    icon: Users,
    color: 'text-amber-400',
  },
];

function AnimatedCounter({ value, prefix, suffix }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {prefix}
      {count >= 1000 ? `${(count / 1000).toFixed(0).replace(/\.0$/, '')}k` : count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
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
            Real impact, <span className="gradient-text">real numbers</span>
          </h2>
          <p className="text-text-secondary text-lg">
            Every metric is transparent and publicly verifiable.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="glass-card p-8 text-center relative overflow-hidden group"
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-navy border border-card-border mb-6">
                  <stat.icon className={`w-7 h-7 ${stat.color}`} />
                </div>

                <div className={`text-5xl md:text-6xl font-bold tracking-tight mb-2 ${stat.color}`}>
                  <AnimatedCounter
                    value={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                  />
                </div>

                <h3 className="text-lg font-semibold mb-2">{stat.label}</h3>
                <p className="text-text-secondary text-sm">{stat.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
