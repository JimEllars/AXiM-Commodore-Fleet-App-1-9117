import React from 'react';
import { useCommodoreStore } from '../store/useCommodoreStore';
import SafeIcon from '../common/SafeIcon';
import { motion } from 'framer-motion';

export default function RouteHistoryLogs() {
  const { routeHistory, selectedVehicleId } = useCommodoreStore();
  
  const history = routeHistory
    .filter(h => h.vehicle_id === selectedVehicleId)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return (
    <div className="h-full flex flex-col bg-axim-panel border border-axim-border rounded-lg overflow-hidden">
      <div className="p-3 border-b border-axim-border bg-void/50 flex justify-between items-center">
        <div className="flex items-center gap-2 text-axim-teal font-mono text-sm">
          <SafeIcon name="Map" className="w-4 h-4" />
          <span>6. ROUTE EVENT LEDGER</span>
        </div>
        <div className="text-[10px] font-mono text-gray-500 uppercase">
          Audit Trail Active
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-void/10">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-axim-panel/90 backdrop-blur-sm z-10 border-b border-axim-border">
            <tr>
              <th className="p-3 text-[10px] font-mono text-gray-500 uppercase">Timestamp</th>
              <th className="p-3 text-[10px] font-mono text-gray-500 uppercase">Event</th>
              <th className="p-3 text-[10px] font-mono text-gray-500 uppercase">Destination</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-axim-border/30">
            {history.length === 0 ? (
              <tr>
                <td colSpan="3" className="p-8 text-center text-gray-600 font-mono text-xs">
                  NO HISTORICAL DATA FOR THIS ASSET
                </td>
              </tr>
            ) : (
              history.map((entry, idx) => {
                const isArrived = entry.event_type === 'ARRIVED';
                const isCompleted = entry.event_type === 'COMPLETED';
                
                return (
                  <motion.tr 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    key={entry.id} 
                    className="hover:bg-axim-teal/5 transition-colors group"
                  >
                    <td className="p-3 text-[10px] font-mono text-gray-400">
                      {entry.timestamp}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-axim-success shadow-[0_0_8px_rgba(16,185,129,0.5)]' : isArrived ? 'bg-axim-teal shadow-[0_0_8px_rgba(45,212,191,0.5)]' : 'bg-axim-warn'}`}></div>
                        <span className={`text-[10px] font-bold font-mono ${isCompleted ? 'text-axim-success' : isArrived ? 'text-axim-teal' : 'text-axim-warn'}`}>
                          {entry.event_type}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-xs text-gray-300 group-hover:text-white transition-colors">
                        {entry.destination_name}
                      </div>
                    </td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      <div className="p-2 border-t border-axim-border bg-void/50 flex justify-center">
        <button className="text-[9px] font-mono text-gray-500 hover:text-axim-teal transition-colors flex items-center gap-1">
          <SafeIcon name="Download" className="w-3 h-3" /> EXPORT FULL LEDGER (CSV)
        </button>
      </div>
    </div>
  );
}