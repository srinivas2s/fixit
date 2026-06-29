'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/lib/store';
import type { Report } from '@/types';
import { getUrgencyColor } from '@/lib/utils';
import { Clock, CheckCircle2, AlertCircle, Loader2, Filter, Settings2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DepartmentAdminPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'open' | 'in_progress' | 'resolved' | 'all'>('open');
  const { profile } = useAuthStore();
  const supabase = createClient();

  useEffect(() => {
    async function fetchDepartmentReports() {
      // In a real app we would filter by department_id, but we're mocking it
      // so we'll just fetch all and pretend they belong to the current department
      try {
        let query = supabase
          .from('reports')
          .select('*, profiles(full_name)')
          .order('urgency_score', { ascending: false })
          .order('created_at', { ascending: false });

        if (filter !== 'all') {
          query = query.eq('status', filter);
        }

        const { data, error } = await query;
        if (error) throw error;
        setReports(data as unknown as Report[]);
      } catch (err) {
        console.error("Failed to fetch department reports:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDepartmentReports();
  }, [filter, supabase]);

  const handleUpdateStatus = async (reportId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('reports')
        .update({ status: newStatus })
        .eq('id', reportId);

      if (error) throw error;

      // Optimistic update
      setReports(reports.map(r => r.id === reportId ? { ...r, status: newStatus as any } : r));
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status");
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Department Queue</h1>
          <p className="text-text-secondary">
            Managing issues for: <span className="font-semibold text-text-primary">{profile?.department || 'Roads & Infrastructure'}</span>
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-navy-light/50 border border-card-border p-1 rounded-xl">
          {(['all', 'open', 'in_progress', 'resolved'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                filter === f ? 'bg-primary text-navy' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : reports.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <h3 className="text-xl font-bold mb-2">Queue is empty</h3>
          <p className="text-text-secondary">No reports match the current filter.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {reports.map((report) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card border border-card-border p-5 flex flex-col lg:flex-row gap-6 relative overflow-hidden group"
            >
              {/* Urgency Highlight Bar */}
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                report.urgency_score >= 8 ? 'bg-urgency-red' :
                report.urgency_score >= 5 ? 'bg-urgency-orange' : 'bg-primary'
              }`} />

              <div className="flex-1 flex flex-col md:flex-row gap-6">
                {/* Img */}
                {report.image_url ? (
                  <img src={report.image_url} alt="" className="w-32 h-24 object-cover rounded-lg border border-card-border shrink-0" />
                ) : (
                  <div className="w-32 h-24 bg-navy-light rounded-lg border border-card-border shrink-0 flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-text-secondary/50" />
                  </div>
                )}

                {/* Info */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider border ${
                      report.urgency_score >= 8 ? 'bg-urgency-red/10 text-urgency-red border-urgency-red/20' :
                      report.urgency_score >= 5 ? 'bg-urgency-orange/10 text-urgency-orange border-urgency-orange/20' : 
                      'bg-primary/10 text-primary border-primary/20'
                    }`}>
                      Urgency {report.urgency_score}
                    </span>
                    <span className="text-xs uppercase tracking-wider font-medium text-text-secondary bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                      {report.category.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-text-secondary ml-auto flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(report.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-text-primary mb-1">{report.title}</h3>
                  <p className="text-text-secondary text-sm line-clamp-2">{report.description}</p>
                  
                  <div className="mt-3 text-xs font-medium text-text-secondary">
                    Reported by: {(report as any).profiles?.full_name || 'Citizen'} • {report.confirmations} confirmations
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex lg:flex-col gap-2 shrink-0 border-t lg:border-t-0 lg:border-l border-card-border pt-4 lg:pt-0 lg:pl-6 justify-center">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1 block">Status</label>
                <select
                  value={report.status}
                  onChange={(e) => handleUpdateStatus(report.id, e.target.value)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold cursor-pointer border focus:outline-none appearance-none ${
                    report.status === 'resolved' ? 'bg-primary/10 text-primary border-primary/30' : 
                    report.status === 'in_progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' : 
                    'bg-navy-light text-text-primary border-card-border hover:border-text-secondary'
                  }`}
                >
                  <option value="open">Open / Triage</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
                
                <button className="px-3 py-2 mt-auto bg-white/5 hover:bg-white/10 border border-card-border rounded-lg text-xs font-medium transition-colors text-text-primary">
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
