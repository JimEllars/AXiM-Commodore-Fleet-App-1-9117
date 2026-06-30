import React from 'react';
import { useCommodoreStore } from '../store/useCommodoreStore';
import SafeIcon from '../common/SafeIcon';
import { motion, AnimatePresence } from 'framer-motion';

export default function AssetProfile() {
  const { selectedVehicleId, activeVehicles, inventory, maintenanceRecords, isTracking, setIsTracking } = useCommodoreStore();
  const vehicle = activeVehicles[selectedVehicleId];
  const records = maintenanceRecords.filter(r => r.vehicle_id === selectedVehicleId);

  if (!vehicle) return null;

  return (
    <div className="h-full flex flex-col bg-axim-panel border border-axim-border rounded-lg overflow-hidden font-mono">
      <div className="p-4 bg-axim-teal/5 border-b border-axim-border flex justify-between items-start">
        <div>
          <h2 className="text-lg font-bold text-white leading-tight">{vehicle.name}</h2>
          <p className="text-[10px] text-axim-teal uppercase">{vehicle.type} PROFILE</p>
        </div>
        <div className="flex flex-col items-end gap-2">
           <div className="px-2 py-1 rounded bg-void border border-axim-border text-[10px] text-gray-400">
            ID: {vehicle.id.split('-')[0]}
          </div>
          <button 
            onClick={() => setIsTracking(!isTracking)}
            className={`px-2 py-0.5 rounded text-[9px] border transition-all ${
              isTracking 
              ? 'bg-axim-teal border-axim-teal text-void font-bold' 
              : 'bg-void border-axim-border text-gray-500 hover:text-axim-teal'
            }`}
          >
            {isTracking ? 'TRACKING ON' : 'TRACKING OFF'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Dynamic Vitals */}
        <section>
          <h3 className="text-[10px] text-gray-500 uppercase mb-3 tracking-widest">Core Telemetry</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'VELOCITY', val: `${vehicle.speed_mph} MPH`, icon: 'Activity' },
              { label: 'HEADING', val: `${vehicle.heading}°`, icon: 'Compass' },
              { label: 'FUEL', val: `${vehicle.fuel}%`, icon: 'Droplet' },
              { label: 'LOAD', val: vehicle.load, icon: 'Package' }
            ].map((v, i) => (
              <div key={i} className="p-2 bg-void/50 border border-axim-border rounded">
                <div className="flex items-center gap-1.5 text-[9px] text-gray-500 mb-1 uppercase">
                  <SafeIcon name={v.icon} className="w-3 h-3" />
                  {v.label}
                </div>
                <div className="text-sm font-bold text-white">{v.val}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Assigned Personnel */}
        <section>
          <h3 className="text-[10px] text-gray-500 uppercase mb-3 tracking-widest">Personnel</h3>
          <div className="flex items-center gap-3 p-3 bg-axim-teal/5 border border-axim-teal/20 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-void border border-axim-teal/30 flex items-center justify-center text-axim-teal">
              <SafeIcon name="User" className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">{vehicle.driver}</div>
              <div className="text-[9px] text-axim-teal uppercase">Operator {vehicle.driver_id}</div>
            </div>
            <button className="ml-auto p-2 text-gray-500 hover:text-axim-teal transition-colors">
              <SafeIcon name="Phone" className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* Maintenance Snapshot */}
        <section>
          <h3 className="text-[10px] text-gray-500 uppercase mb-3 tracking-widest">Maintenance Status</h3>
          <div className="space-y-2">
            {records.slice(0, 2).map(r => (
              <div key={r.id} className="flex justify-between items-center text-[10px] p-2 border-l-2 border-axim-success bg-void/30">
                <span className="text-gray-300 uppercase">{r.type}</span>
                <span className="text-gray-500">{r.date}</span>
              </div>
            ))}
            <button className="w-full py-2 text-[9px] text-axim-teal border border-dashed border-axim-teal/30 rounded hover:bg-axim-teal/10 transition-colors uppercase">
              View Health History
            </button>
          </div>
        </section>
      </div>

      <div className="p-4 border-t border-axim-border bg-void/50">
        <button className="w-full py-2 bg-axim-alert/10 border border-axim-alert/30 text-axim-alert text-[10px] font-bold rounded hover:bg-axim-alert hover:text-void transition-all uppercase">
          Emergency Remote Shutdown
        </button>
      </div>
    </div>
  );
}