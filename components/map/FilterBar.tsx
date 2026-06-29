'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ChevronDown, Check } from 'lucide-react';
import { useMapStore } from '@/lib/store';

const categories = [
  { id: 'all', label: 'All Issues' },
  { id: 'pothole', label: 'Potholes' },
  { id: 'streetlight', label: 'Streetlights' },
  { id: 'garbage', label: 'Garbage/Waste' },
  { id: 'water_leak', label: 'Water Leaks' },
];

export default function FilterBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <div className="absolute top-4 right-4 z-[400]">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-navy/90 backdrop-blur-md border border-card-border rounded-xl text-sm font-medium hover:bg-navy transition-colors shadow-lg"
        >
          <Filter className="w-4 h-4 text-primary" />
          <span className="hidden sm:inline">
            {categories.find(c => c.id === selectedCategory)?.label}
          </span>
          <ChevronDown className="w-4 h-4 text-text-secondary" />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-0 mt-2 w-48 bg-navy border border-card-border rounded-xl shadow-xl overflow-hidden py-1"
            >
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setIsOpen(false);
                    // In a real app, this would filter the reports in the MapStore
                  }}
                  className="flex items-center justify-between w-full px-4 py-2 text-sm text-left hover:bg-white/5 transition-colors"
                >
                  <span className={selectedCategory === category.id ? 'text-primary font-medium' : 'text-text-secondary'}>
                    {category.label}
                  </span>
                  {selectedCategory === category.id && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
