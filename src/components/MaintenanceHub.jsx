import React, { useState } from 'react';
import { useCommodoreStore } from '../store/useCommodoreStore';
import SafeIcon from '../common/SafeIcon';
import { motion, AnimatePresence } from 'framer-motion';
import MaintenanceScheduler from './MaintenanceScheduler';

export default function MaintenanceHub() {
  const { maintenanceRecords, completeMaintenance } = useCommodoreStore();
  const [showScheduler, setShowScheduler] = useState(false);

  return (
    <div className="h-full flex flex-col bg-axim-panel border border-axim-border rounded-lg overflow-hidden">
      <div className="p-3 border-b border-axim-border bg-void/50 flex justify-between items-center">
        <div className="flex items-center gap-2 text-axim-teal font-mono text-sm">
          <SafeIcon name="Tool" className="w-4 h-4" />
          <span>FLEET HEALTH & MAINTENANCE HUB</span>
        </div>
        <button 
          onClick={() => setShowScheduler(!showScheduler)}
          className="px-2 py-1 bg-axim-teal text-void text-[10px] font-bold rounded hover:bg-white transition-colors uppercase"
        >
          {showScheduler ? 'Cancel' : 'Schedule Service'}
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence>
          {showScheduler && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <MaintenanceScheduler onClose={() => setShowScheduler(false)} />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="grid grid-cols-1 gap-3">
          {maintenanceRecords.map((record) => {
            const isPending = record.status === 'pending';
            return (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                key={record.id} 
                className={`p-3 rounded-lg border ${isPending ? 'border-axim-warn/30 bg-axim-warn/5' : 'border-axim-border bg-void/30'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded ${isPending ? 'bg-axim-warn/20 text-axim-warn' : 'bg-axim-success/20 text-axim-success'}`}>
                      <SafeIcon name={isPending ? 'Clock' : 'Check'} className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{record.type}</h4>
                      <p className="text-[10px] font-mono text-gray-500 uppercase">{record.vehicle_id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-mono text-white font-bold">{record.cost}</div>
                    <div className="text-[9px] font-mono text-gray-600">{record.date}</div>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mb-3 leading-relaxed">{record.description}</p>
                <div className="flex gap-2">
                  <button className="flex-1 py-1 px-2 bg-void border border-axim-border rounded text-[10px] font-mono text-gray-400 hover:text-white hover:border-gray-600 transition-colors uppercase">
                    View Logs
                  </button>
                  {isPending && (
                    <button 
                      onClick={() => completeMaintenance(record.id)}
                      className="flex-1 py-1 px-2 bg-axim-success/10 border border-axim-success/30 rounded text-[10px] font-mono text-axim-success hover:bg-axim-success hover:text-void transition-colors uppercase font-bold"
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}