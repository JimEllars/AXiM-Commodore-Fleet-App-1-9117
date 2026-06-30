import React from 'react';
import { useCommodoreStore } from '../store/useCommodoreStore';
import SafeIcon from '../common/SafeIcon';
import { motion, AnimatePresence } from 'framer-motion';

export default function TaskInjector() {
  const { ecosystemAlerts, injectEmergencyStop, resolveAlert, sendDirective, selectedVehicleId } = useCommodoreStore();

  const handlePushToDriver = async (alert) => {
    const msg = `ALERT: ${alert.message}. Please acknowledge and adjust route.`;
    await sendDirective(selectedVehicleId, msg);
    await resolveAlert(alert.id);
  };

  return (
    <div className="h-full flex flex-col bg-axim-panel border border-axim-border rounded-lg overflow-hidden">
      <div className="p-3 border-b border-axim-border bg-void/50 flex justify-between items-center">
        <div className="flex items-center gap-2 text-axim-teal font-mono text-xs uppercase tracking-widest">
          <SafeIcon name="Zap" className="w-4 h-4" />
          <span>Proactive Watchdog</span>
        </div>
        <div className="px-1.5 py-0.5 bg-axim-teal/10 text-axim-teal text-[8px] rounded border border-axim-teal/30">
          {ecosystemAlerts.length} ACTIVE
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        <AnimatePresence initial={false}>
          {ecosystemAlerts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-600 text-[10px] font-mono uppercase text-center opacity-50">
              <SafeIcon name="Shield" className="w-8 h-8 mb-2 mx-auto" />
              Horizon clear.<br/>No anomalies detected.
            </div>
          ) : (
            ecosystemAlerts.map(alert => {
              const isCritical = alert.type === 'CRITICAL';
              const isSystem = alert.source === 'SYSTEM' || alert.source.includes('TRUCK') || alert.source.includes('VAN');
              
              return (
                <motion.div 
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`p-3 rounded-lg border relative overflow-hidden ${isCritical ? 'border-axim-alert/50 bg-axim-alert/5' : 'border-axim-warn/50 bg-axim-warn/5'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono border ${isCritical ? 'bg-axim-alert/20 text-axim-alert border-axim-alert/30' : 'bg-axim-warn/20 text-axim-warn border-axim-warn/30'}`}>
                        {alert.source}
                      </span>
                      <span className={`text-[10px] font-mono font-bold ${isCritical ? 'text-axim-alert' : 'text-axim-warn'}`}>
                        {alert.type}
                      </span>
                    </div>
                    <div className="text-[8px] text-gray-600 font-mono">
                      {new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-300 mb-3 leading-relaxed">{alert.message}</p>
                  
                  <div className="flex gap-2">
                    {isSystem ? (
                      <>
                        <button 
                          onClick={() => handlePushToDriver(alert)}
                          className="flex-1 py-1 px-2 bg-axim-teal text-void text-[9px] font-bold rounded hover:bg-white transition-colors uppercase"
                        >
                          Push to Driver
                        </button>
                        <button 
                          onClick={() => resolveAlert(alert.id)}
                          className="px-2 py-1 bg-void border border-axim-border text-gray-500 text-[9px] rounded hover:text-axim-alert transition-colors"
                        >
                          Dismiss
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={() => injectEmergencyStop(alert)}
                        className={`w-full py-1.5 px-3 rounded text-[9px] font-mono font-bold transition-colors flex items-center justify-center gap-2 ${isCritical ? 'bg-axim-alert/10 text-axim-alert border border-axim-alert/30 hover:bg-axim-alert/20' : 'bg-axim-warn/10 text-axim-warn border border-axim-warn/30 hover:bg-axim-warn/20'}`}
                      >
                        <SafeIcon name="Crosshair" className="w-3 h-3" />
                        INTERCEPT & INJECT
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}