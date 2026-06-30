'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useMapStore } from '@/lib/store';
import { createClient } from '@/lib/supabase/client';
import type { Report } from '@/types';
import { Loader2 } from 'lucide-react';

// Dynamically import the map component so it doesn't break SSR
const MapView = dynamic(() => import('@/components/map/MapView'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[calc(100vh-64px)] flex items-center justify-center bg-navy-light/50">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-text-secondary font-medium">Loading Map Data...</p>
      </div>
    </div>
  )
});

export default function MapPage() {
  const { setReports } = useMapStore();
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchReports() {
      try {
        const { data, error } = await supabase
          .from('reports')
          .select('*, profiles(full_name)')
          .in('status', ['reported', 'verified', 'in_progress']);

        if (error) throw error;
        
        // Convert to properly typed reports
        const mappedReports = data.map(r => ({
          ...r,
          authorName: r.profiles?.full_name || 'Anonymous'
        })) as unknown as Report[];

        setReports(mappedReports);
      } catch (err) {
        console.error("Failed to load map data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchReports();
  }, [supabase, setReports]);

  return (
    <div className="w-full h-[calc(100vh-64px)] relative">
      <MapView />
    </div>
  );
}
