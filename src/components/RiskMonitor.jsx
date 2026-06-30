import React from 'react';
import { useCommodoreStore } from '../store/useCommodoreStore';
import SafeIcon from '../common/SafeIcon';
import { motion } from 'framer-motion';

export default function RiskMonitor() {
  const { manifests, selectedVehicleId, activeVehicles } = useCommodoreStore();
  const manifest = manifests[selectedVehicleId];
  const vehicle = activeVehicles[selectedVehicleId];

  if (!manifest || !vehicle) return null;

  const pendingStops = manifest.stops.filter(s => s.status !== 'completed');
  
  // Dynamic SLA Calculation Logic
  const getSLAStatus = (stop, index) => {
    const speed = parseFloat(vehicle.speed_mph);
    const baseVariance = stop.is_injected ? 15 : 0;
    
    // If vehicle is moving slow, risk increases
    if (speed < 20 && vehicle.status === 'en_route') {
      return { 
        risk: 'HIGH', 
        variance: `+${baseVariance + 28}m`, 
        color: 'text-axim-alert', 
        bg: 'bg-axim-alert/10',
        border: 'border-axim-alert/30'
      };
    }
    
    if (stop.is_injected) {
       return { 
        risk: 'CRITICAL', 
        variance: `+${baseVariance + 12}m`, 
        color: 'text-axim-warn', 
        bg: 'bg-axim-warn/10',
        border: 'border-axim-warn/30'
      };
    }

    return { 
      risk: 'NOMINAL', 
      variance: '-2m', 
      color: 'text-axim-success', 
      bg: 'bg-axim-success/10',
      border: 'border-axim-success/30'
    };
  };

  return (
    <div className="h-full flex flex-col bg-axim-panel border border-axim-border rounded-lg overflow-hidden font-mono">
      <div className="p-3 border-b border-axim-border bg-void/50 flex justify-between items-center">
        <div className="flex items-center gap-2 text-axim-alert text-sm">
          <SafeIcon name="Shield" className="w-4 h-4" />
          <span>8. SLA RISK MONITOR</span>
        </div>
        <div className="text-[10px] text-gray-500 uppercase">Engine: Onyx-V3</div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {pendingStops.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-8">
            <div className="w-12 h-12 rounded-full border border-axim-success/30 flex items-center justify-center mb-2">
              <SafeIcon name="Check" className="text-axim-success w-6 h-6" />
            </div>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Route finalized<br/>No risks detected</p>
          </div>
        ) : (
          pendingStops.slice(0, 3).map((stop, idx) => {
            const status = getSLAStatus(stop, idx);
            return (
              <motion.div 
                initial={{ opacity: 0, y: 5 }} 
                animate={{ opacity: 1, y: 0 }} 
                key={stop.id} 
                className={`p-3 border rounded-lg relative overflow-hidden ${status.bg} ${status.border}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase truncate max-w-[120px]">{stop.destination_name}</h4>
                    <p className={`text-[9px] font-bold ${status.color}`}>VARIANCE: {status.variance}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400">STOP #{idx + 1}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-1 bg-void rounded-full overflow-hidden">
                    <div className={`h-full ${status.risk === 'NOMINAL' ? 'bg-axim-success' : status.risk === 'HIGH' ? 'bg-axim-alert' : 'bg-axim-warn'}`} style={{ width: status.risk === 'NOMINAL' ? '20%' : '85%' }}></div>
                  </div>
                  <span className={`text-[9px] font-bold ${status.color}`}>{status.risk}</span>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      <div className="p-3 bg-void/50 border-t border-axim-border">
        <div className="flex justify-between items-center text-[10px]">
          <span className="text-gray-500 uppercase">SLA Compliance:</span>
          <span className="text-axim-success font-bold">98.4%</span>
        </div>
      </div>
    </div>
  );
}