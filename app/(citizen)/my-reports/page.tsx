'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/lib/store';
import type { Report } from '@/types';
import { getUrgencyColor } from '@/lib/utils';
import { Clock, CheckCircle2, AlertCircle, FileText, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function MyReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();
  const supabase = createClient();

  useEffect(() => {
    async function fetchMyReports() {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('reports')
          .select('*')
          .eq('author_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setReports(data as Report[]);
      } catch (err) {
        console.error("Failed to fetch reports:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMyReports();
  }, [user, supabase]);

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="section-container py-12">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">My Reports</h1>
          <p className="text-text-secondary">Track the progress of the issues you've reported.</p>
        </div>
        
        <Link 
          href="/report" 
          className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-navy font-bold rounded-xl transition-colors flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          New Report
        </Link>
      </div>

      {reports.length === 0 ? (
        <div className="glass-card p-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-navy-light rounded-full flex items-center justify-center mb-4 border border-card-border">
            <FileText className="w-8 h-8 text-text-secondary" />
          </div>
          <h2 className="text-xl font-bold mb-2">No reports yet</h2>
          <p className="text-text-secondary max-w-md mx-auto mb-6">
            You haven't reported any issues yet. Help your community by reporting potholes, leaks, or broken infrastructure.
          </p>
          <Link 
            href="/report" 
            className="text-primary hover:text-primary-hover font-medium flex items-center gap-1"
          >
            Make your first report <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {reports.map((report, i) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 flex flex-col md:flex-row gap-6 relative overflow-hidden"
            >
              {/* Status Indicator Line */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                report.status === 'resolved' ? 'bg-primary' : 
                report.status === 'in_progress' ? 'bg-blue-500' : 'bg-urgency-orange'
              }`} />
              
              {/* Image Thumbnail */}
              {report.photo_url ? (
                <div className="w-full h-48 md:h-full overflow-hidden">
                  <img src={report.photo_url} alt={report.title} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-full md:w-48 h-32 rounded-xl shrink-0 border border-card-border bg-navy-light flex items-center justify-center">
                  <FileText className="w-8 h-8 text-text-secondary opacity-50" />
                </div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-md border ${
                    report.status === 'resolved' ? 'bg-primary/20 text-primary border-primary/30' : 
                    report.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 
                    'bg-urgency-orange/20 text-urgency-orange border-urgency-orange/30'
                  }`}>
                    {report.status.replace('_', ' ')}
                  </span>
                  
                  <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-md text-xs font-medium uppercase tracking-wider text-text-secondary">
                    {report.category.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-text-primary mb-2 truncate">{report.title}</h3>
                <p className="text-text-secondary text-sm line-clamp-2 mb-4">
                  {report.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
                  <div className="flex items-center gap-1.5 text-text-secondary">
                    <Clock className="w-4 h-4" />
                    {new Date(report.created_at).toLocaleDateString()}
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-text-secondary">
                    <AlertCircle className="w-4 h-4" />
                    Severity: <span className={getUrgencyColor(report.urgency_score)}>{report.urgency_score}/10</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-text-secondary">
                    <CheckCircle2 className="w-4 h-4" />
                    {report.confirmations} Confirmations
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
