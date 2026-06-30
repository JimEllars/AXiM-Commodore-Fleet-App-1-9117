import React from 'react';
import { useCommodoreStore } from '../store/useCommodoreStore';
import SafeIcon from '../common/SafeIcon';
import { motion } from 'framer-motion';

export default function DiagnosticSwarm() {
  const { diagnostics, selectedVehicleId } = useCommodoreStore();
  const vehicleStats = diagnostics.filter(d => d.vehicle_id === selectedVehicleId);

  const getStatusColor = (score) => {
    if (score > 85) return 'text-axim-success';
    if (score > 70) return 'text-axim-warn';
    return 'text-axim-alert';
  };

  return (
    <div className="h-full flex flex-col bg-axim-panel border border-axim-border rounded-lg overflow-hidden font-mono">
      <div className="p-3 border-b border-axim-border bg-void/50 flex justify-between items-center">
        <div className="flex items-center gap-2 text-axim-teal text-xs uppercase tracking-widest">
          <SafeIcon name="Cpu" className="w-4 h-4" />
          <span>Onyx-V4 Predictive Diagnostics</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {vehicleStats.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-30">
            <SafeIcon name="Activity" className="w-10 h-10 mb-2" />
            <span className="text-[10px] uppercase">No Scan Data</span>
          </div>
        ) : (
          vehicleStats.map((stat) => (
            <div key={stat.id} className="p-3 bg-void/50 border border-axim-border rounded-lg group hover:border-axim-teal/50 transition-all">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase">{stat.component}</h4>
                  <p className="text-[9px] text-gray-500 uppercase">Predicted Failure: {stat.predicted_failure_date}</p>
                </div>
                <div className={`text-lg font-bold ${getStatusColor(parseInt(stat.health_score))}`}>
                  {stat.health_score}%
                </div>
              </div>
              <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden flex gap-0.5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-full flex-1 transition-all duration-1000 ${i < parseInt(stat.health_score) / 10 ? (parseInt(stat.health_score) > 70 ? 'bg-axim-teal' : 'bg-axim-alert') : 'bg-gray-900'}`}
                  />
                ))}
              </div>
              <div className="mt-3 flex justify-between items-center">
                <span className="text-[9px] text-gray-600 uppercase">Stress: {stat.stress_level}</span>
                <button className="text-[8px] px-2 py-0.5 border border-axim-border rounded hover:border-axim-teal hover:text-axim-teal transition-all uppercase">
                  View Telemetry
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="p-3 bg-void/50 border-t border-axim-border">
        <button className="w-full py-2 bg-axim-teal/10 border border-axim-teal/30 text-axim-teal text-[10px] font-bold rounded hover:bg-axim-teal hover:text-void transition-all uppercase">
          Force Full System Probe
        </button>
      </div>
    </div>
  );
}