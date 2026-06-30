'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useMapStore } from '@/lib/store';
import { getCategoryIcon, getUrgencyColor } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Navigation, ThumbsUp, AlertCircle, Clock } from 'lucide-react';
import FilterBar from '@/components/map/FilterBar';
import HeatmapLayer from '@/components/map/HeatmapLayer';

// Fix Leaflet's default icon path issues in Next.js
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = defaultIcon;

// Component to handle dynamic map zooming based on selected report
function MapController() {
  const map = useMap();
  const { selectedReport } = useMapStore();

  useEffect(() => {
    if (selectedReport) {
      map.flyTo(
        [selectedReport.latitude, selectedReport.longitude],
        16, // zoom level
        { duration: 1.5 }
      );
    }
  }, [selectedReport, map]);

  return null;
}

export default function MapView() {
  const { reports, selectedReport, setSelectedReport } = useMapStore();
  const [mounted, setMounted] = useState(false);

  // Default center: Bangalore
  const defaultCenter: [number, number] = [12.9716, 77.5946];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full h-full relative flex">
      {/* Sidebar for Selected Report Details */}
      <AnimatePresence>
        {selectedReport && (
          <motion.div
            initial={{ x: -400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -400, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute top-4 left-4 z-[400] w-96 max-w-[calc(100vw-32px)] glass-card border border-card-border shadow-2xl flex flex-col max-h-[calc(100vh-100px)] overflow-hidden"
          >
            <div className="p-4 border-b border-card-border flex items-center justify-between bg-navy/80 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  {selectedReport.category.replace('_', ' ')}
                </span>
                <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                  selectedReport.urgency_score >= 8 ? 'bg-urgency-red/20 text-urgency-red border border-urgency-red/30' :
                  selectedReport.urgency_score >= 5 ? 'bg-urgency-orange/20 text-urgency-orange border border-urgency-orange/30' :
                  'bg-primary/20 text-primary border border-primary/30'
                }`}>
                  Urgency: {selectedReport.urgency_score}/10
                </span>
              </div>
              <button 
                onClick={() => setSelectedReport(null)}
                className="p-1 text-text-secondary hover:text-text-primary hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="overflow-y-auto p-4 flex-1">
              <h2 className="text-xl font-bold text-text-primary mb-2">
                {selectedReport.title}
              </h2>
              
              <div className="flex items-center gap-4 text-xs text-text-secondary mb-4 pb-4 border-b border-card-border">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(selectedReport.created_at).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {selectedReport.status}
                </div>
              </div>

              {selectedReport.photo_url && (
                <div className="w-full aspect-video bg-navy-light rounded-xl mb-4 overflow-hidden border border-card-border relative">
                  <img 
                    src={selectedReport.photo_url} 
                    alt={selectedReport.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Description</h4>
                  <p className="text-sm text-text-primary leading-relaxed">
                    {selectedReport.description}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Reported By</h4>
                  <p className="text-sm text-text-primary">
                    {selectedReport.authorName}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-card-border bg-navy/80 backdrop-blur-md flex gap-3">
              <button className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 border border-card-border rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 text-text-primary">
                <ThumbsUp className="w-4 h-4" />
                Confirm Issue ({selectedReport.confirmations})
              </button>
              <button className="w-11 h-11 bg-primary hover:bg-primary-hover text-navy rounded-xl flex items-center justify-center transition-colors shrink-0">
                <Navigation className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map */}
      <div className="flex-1 h-full z-0 relative">
        <FilterBar />
        <MapContainer 
          center={defaultCenter} 
          zoom={13} 
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%', backgroundColor: '#0f172a' }}
          zoomControl={false} // Will add custom positioned one if needed
        >
          {/* Dark Mode Map Tiles via OpenStreetMap CartoDB Dark Matter */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          
          <MapController />
          <HeatmapLayer />

          {reports.map((report) => (
            <Marker 
              key={report.id}
              position={[report.latitude, report.longitude]}
              eventHandlers={{
                click: () => {
                  setSelectedReport(report);
                },
              }}
            >
              {/* Optional: Simple tooltip on hover */}
              <Popup className="custom-popup">
                <div className="text-navy font-semibold">{report.title}</div>
                <div className="text-navy/70 text-xs">Urgency: {report.urgency_score}/10</div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
