import React, { useEffect } from 'react';
import { useCommodoreStore } from '../store/useCommodoreStore';
import SafeIcon from '../common/SafeIcon';
import { motion, AnimatePresence } from 'framer-motion';

export default function MapPanel() {
  const { activeVehicles, selectedVehicleId, setSelectedVehicle, manifests, geofences, isTracking, setIsTracking } = useCommodoreStore();
  const selectedVehicle = activeVehicles[selectedVehicleId];
  const manifest = manifests[selectedVehicleId];

  // Helper to calculate relative viewbox for "Tracking Mode"
  const getTrackingTransform = () => {
    if (!isTracking || !selectedVehicle) return { x: 0, y: 0, scale: 1 };
    // Center the map on the selected vehicle
    const x = 50 - parseFloat(selectedVehicle.lng);
    const y = 50 - parseFloat(selectedVehicle.lat);
    return { x: x * 4, y: y * 4, scale: 2.5 };
  };

  const transform = getTrackingTransform();

  useEffect(() => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) return;

    let client;
    import('@supabase/supabase-js').then(({ createClient }) => {
      client = createClient(supabaseUrl, supabaseKey);
      const channel = client.channel('fleet-map-realtime')
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'hardware_registry' }, (payload) => {
          if (payload.new && payload.new.id) {
            useCommodoreStore.setState(state => {
              const current = state.activeVehicles[payload.new.id];
              if (current) {
                return {
                  activeVehicles: {
                    ...state.activeVehicles,
                    [payload.new.id]: { ...current, lat: payload.new.lat || current.lat, lng: payload.new.lng || current.lng }
                  }
                };
              }
              return state;
            });
          }
        })
        .subscribe();

      return () => { client && client.removeChannel(channel); };
    });
  }, []);

  return (
    <div className="h-full flex flex-col bg-axim-panel border border-axim-border rounded-lg overflow-hidden relative">
      <div className="p-3 border-b border-axim-border flex items-center justify-between bg-void/80 backdrop-blur-sm z-30">
        <div className="flex items-center gap-2 text-axim-teal font-mono text-sm">
          <SafeIcon name="Map" className="w-4 h-4" />
          <span>1. LIVE FLEET TOPOLOGY MAP</span>
        </div>
        <div className="flex gap-2">
          {isTracking && (
            <div className="flex items-center gap-2 px-2 py-0.5 bg-axim-teal/10 border border-axim-teal/30 text-[9px] font-mono text-axim-teal uppercase">
              <div className="w-1.5 h-1.5 rounded-full bg-axim-teal animate-pulse"></div>
              Tracking: {selectedVehicle?.name}
            </div>
          )}
          <button 
            onClick={() => setIsTracking(!isTracking)}
            className={`px-2 py-0.5 border rounded text-[9px] font-mono transition-all uppercase ${
              isTracking 
              ? 'bg-axim-teal text-void border-axim-teal font-bold' 
              : 'bg-void border-axim-border text-gray-500 hover:text-white'
            }`}
          >
            {isTracking ? 'Release Focus' : 'Focus Asset'}
          </button>
        </div>
      </div>

      <div className="flex-1 relative bg-[#0a0f18] overflow-hidden cursor-crosshair">
        {/* Dynamic Grid Background */}
        <motion.div 
          animate={{ 
            translateX: `${transform.x}%`, 
            translateY: `${transform.y}%`,
            scale: transform.scale 
          }}
          transition={{ type: 'spring', damping: 20, stiffness: 60 }}
          className="absolute inset-0 w-full h-full origin-center"
        >
          <div 
            className="absolute inset-[-200%] opacity-10 pointer-events-none" 
            style={{
              backgroundImage: 'radial-gradient(circle at center,#1f2937 1px,transparent 1px)',
              backgroundSize: '40px 40px'
            }}
          ></div>
          <div 
            className="absolute inset-[-200%] opacity-5 pointer-events-none" 
            style={{
              backgroundImage: 'linear-gradient(to right,#1f2937 1px,transparent 1px),linear-gradient(to bottom,#1f2937 1px,transparent 1px)',
              backgroundSize: '80px 80px'
            }}
          ></div>

          {/* Render Geofences */}
          {geofences.map(gf => (
            <div 
              key={gf.id} 
              className={`absolute rounded-full border-2 border-dashed pointer-events-none flex items-center justify-center ${
                gf.type === 'RESTRICTED' ? 'border-axim-alert/30 bg-axim-alert/5' : 'border-axim-teal/20 bg-axim-teal/5'
              }`}
              style={{
                top: `${gf.lat}%`,
                left: `${gf.lng}%`,
                width: `${gf.radius_km * 4}%`,
                height: `${gf.radius_km * 4}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <span className="text-[8px] font-mono text-white opacity-20 uppercase tracking-widest">{gf.name}</span>
            </div>
          ))}

          {/* Route Overlay */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30 z-0 overflow-visible">
            <AnimatePresence>
              {selectedVehicle && manifest && (
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2 }}
                  d={`M ${selectedVehicle.lng}% ${selectedVehicle.lat}% ${manifest.stops.map((s, i) => `L ${10 + (i * 20)}% ${20 + (i * 15)}%`).join(' ')}`}
                  fill="none"
                  stroke="#2dd4bf"
                  strokeWidth="0.5"
                  strokeDasharray="2,2"
                />
              )}
            </AnimatePresence>
          </svg>

          {/* Vehicle Markers */}
          {Object.values(activeVehicles).map(vehicle => {
            const isSelected = vehicle.id === selectedVehicleId;
            let statusColor = vehicle.status === 'en_route' ? 'bg-axim-success' : vehicle.status === 'maintenance' ? 'bg-axim-alert' : 'bg-gray-400';
            
            return (
              <motion.div
                key={vehicle.id}
                layout
                onClick={() => setSelectedVehicle(vehicle.id)}
                className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group z-${isSelected ? '50' : '10'}`}
                style={{ top: `${vehicle.lat}%`, left: `${vehicle.lng}%` }}
                transition={{ type: 'spring', damping: 25, stiffness: 120 }}
              >
                <div className="relative">
                  {isSelected && (
                    <div className="absolute inset-0 rounded-full animate-ping opacity-50 border-2 border-axim-teal" style={{ transform: 'scale(2.5)' }}></div>
                  )}
                  <div className={`w-8 h-8 rounded-lg ${isSelected ? 'bg-axim-teal text-void' : 'bg-void text-gray-400'} border border-axim-border shadow-lg flex items-center justify-center transition-all group-hover:scale-110`}>
                    <SafeIcon name="Truck" className="w-5 h-5" />
                    <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-void ${statusColor}`}></div>
                  </div>
                </div>
                {!isTracking && (
                  <div className={`mt-2 px-2 py-1 bg-void/90 border border-axim-border rounded text-[10px] font-mono whitespace-nowrap transition-all ${isSelected ? 'text-axim-teal border-axim-teal/50' : 'text-gray-500 opacity-0 group-hover:opacity-100'}`}>
                    {vehicle.name} • {vehicle.speed_mph} MPH
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* HUD Overlays */}
        <div className="absolute bottom-4 left-4 z-40 space-y-2">
          {selectedVehicle && (
            <div className="p-3 bg-void/90 border border-axim-border rounded-lg backdrop-blur-md">
              <div className="text-[9px] text-gray-500 font-mono uppercase mb-1">Telemetry Stream</div>
              <div className="flex gap-4">
                <div>
                  <div className="text-[8px] text-axim-teal">LAT</div>
                  <div className="text-xs font-mono text-white">{selectedVehicle.lat}</div>
                </div>
                <div>
                  <div className="text-[8px] text-axim-teal">LNG</div>
                  <div className="text-xs font-mono text-white">{selectedVehicle.lng}</div>
                </div>
                <div>
                  <div className="text-[8px] text-axim-teal">SPD</div>
                  <div className="text-xs font-mono text-white">{selectedVehicle.speed_mph}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}