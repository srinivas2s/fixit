'use client';

import { CircleMarker, useMap } from 'react-leaflet';
import { useMapStore } from '@/lib/store';
import { useEffect, useState } from 'react';

export default function HeatmapLayer() {
  const { reports } = useMapStore();
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());

  useEffect(() => {
    const onZoom = () => {
      setZoom(map.getZoom());
    };
    
    map.on('zoomend', onZoom);
    return () => {
      map.off('zoomend', onZoom);
    };
  }, [map]);

  // If zoomed in too close, we might want to hide the heatmap and just show pins
  if (zoom > 15) return null;

  return (
    <>
      {reports.map((report) => (
        <CircleMarker
          key={`heat-${report.id}`}
          center={[report.latitude, report.longitude]}
          radius={zoom * 3} // Dynamic radius based on zoom
          pathOptions={{
            fillColor: report.urgency_score > 7 ? '#ef4444' : report.urgency_score > 4 ? '#f97316' : '#3b82f6',
            fillOpacity: 0.2, // Low opacity for heatmap effect
            color: 'transparent', // No border
            weight: 0,
          }}
          interactive={false} // Don't block clicks on actual pins
        />
      ))}
      
      {/* Inner concentrated dots for the heatmap core */}
      {reports.map((report) => (
        <CircleMarker
          key={`heat-core-${report.id}`}
          center={[report.latitude, report.longitude]}
          radius={zoom * 1.5}
          pathOptions={{
            fillColor: report.urgency_score > 7 ? '#ef4444' : report.urgency_score > 4 ? '#f97316' : '#3b82f6',
            fillOpacity: 0.4,
            color: 'transparent',
            weight: 0,
          }}
          interactive={false}
        />
      ))}
    </>
  );
}
