import React from 'react';
import { useCommodoreStore } from '../store/useCommodoreStore';
import SafeIcon from '../common/SafeIcon';
import { motion, AnimatePresence } from 'framer-motion';

export default function GeofenceAlerts() {
  const { ecosystemAlerts, resolveAlert, sendDirective, activeVehicles } = useCommodoreStore();
  
  const geofenceAlerts = ecosystemAlerts.filter(a => 
    a.message.includes('POLYGON') || a.message.includes('BOUNDARY') || a.message.includes('GEOFENCE')
  );

  const handleResolution = async (alert, action) => {
    if (action === 'DIRECTIVE') {
      const vehicle = Object.values(activeVehicles).find(v => alert.message.includes(v.name));
      if (vehicle) {
        await sendDirective(vehicle.id, `IMMEDIATE ACTION: You have breached ${alert.source}. Correct course now.`);
      }
    }
    await resolveAlert(alert.id);
  };

  return (
    <div className="h-full flex flex-col bg-axim-panel border border-axim-border rounded-lg overflow-hidden font-mono">
      <div className="p-3 border-b border-axim-border bg-void/50 flex justify-between items-center">
        <div className="flex items-center gap-2 text-axim-alert text-xs uppercase tracking-widest">
          <SafeIcon name="ShieldAlert" className="w-4 h-4" />
          <span>Tactical Breach Log</span>
        </div>
        <div className="text-[9px] text-gray-500">{geofenceAlerts.length} ACTIVE BREACHES</div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        <AnimatePresence initial={false}>
          {geofenceAlerts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-30 py-10">
              <SafeIcon name="ShieldCheck" className="w-10 h-10 mb-2" />
              <div className="text-[10px] uppercase tracking-tighter">Boundaries Intact</div>
            </div>
          ) : (
            geofenceAlerts.map(alert => (
              <motion.div 
                key={alert.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-3 bg-void/50 border border-axim-alert/30 rounded-lg relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-axim-alert uppercase">{alert.type}</span>
                    <span className="text-[9px] text-gray-500">{new Date(alert.created_at).toLocaleTimeString()}</span>
                  </div>
                  <div className="px-1.5 py-0.5 bg-axim-alert/10 text-axim-alert text-[8px] rounded border border-axim-alert/20">
                    {alert.source}
                  </div>
                </div>
                
                <p className="text-[11px] text-gray-200 mb-3 leading-relaxed">{alert.message}</p>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleResolution(alert, 'DIRECTIVE')}
                    className="flex-1 py-1 bg-axim-alert text-void text-[9px] font-bold rounded hover:bg-white transition-colors uppercase"
                  >
                    Escalate to Driver
                  </button>
                  <button 
                    onClick={() => handleResolution(alert, 'DISMISS')}
                    className="px-2 py-1 bg-void border border-axim-border text-gray-500 text-[9px] font-bold rounded hover:text-white transition-colors uppercase"
                  >
                    Acknowledge
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}