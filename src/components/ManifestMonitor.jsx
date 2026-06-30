import React, { useState } from 'react';
import { useCommodoreStore } from '../store/useCommodoreStore';
import SafeIcon from '../common/SafeIcon';
import { motion, AnimatePresence } from 'framer-motion';
import StopInjectionModal from './StopInjectionModal';

export default function ManifestMonitor() {
  const { manifests, activeVehicles, selectedVehicleId, isOptimizing, triggerOptimization, updateStopStatus } = useCommodoreStore();
  const [isInjecting, setIsInjecting] = useState(false);
  
  const vehicle = activeVehicles[selectedVehicleId];
  const manifest = manifests[selectedVehicleId];

  return (
    <div className="h-full flex flex-col bg-axim-panel border border-axim-border rounded-lg overflow-hidden">
      <StopInjectionModal 
        isOpen={isInjecting} 
        onClose={() => setIsInjecting(false)} 
        vehicleId={selectedVehicleId} 
      />
      
      {/* Header with Vehicle Details */}
      <div className="p-3 border-b border-axim-border bg-void/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center border border-axim-border ${vehicle?.status === 'en_route' ? 'bg-axim-success/10 text-axim-success' : 'bg-gray-800/50 text-gray-400'}`}>
              <SafeIcon name="Truck" className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{vehicle?.name} <span className="text-[10px] font-mono text-gray-500 ml-1">({vehicle?.status})</span></h3>
              <p className="text-[10px] font-mono text-axim-teal">{vehicle?.driver} | {vehicle?.driver_id || 'UNASSIGNED'}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsInjecting(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded text-[10px] font-mono border border-axim-alert/30 text-axim-alert hover:bg-axim-alert hover:text-void transition-all"
            >
              <SafeIcon name="Plus" className="w-3 h-3" />
              INJECT STOP
            </button>
            <button 
              onClick={triggerOptimization} 
              disabled={isOptimizing || !manifest}
              className={`flex items-center gap-2 px-3 py-1.5 rounded text-[10px] font-mono border transition-all ${isOptimizing ? 'bg-axim-teal/20 text-axim-teal border-axim-teal/30 cursor-not-allowed' : 'bg-void border-axim-border text-gray-400 hover:border-axim-teal hover:text-axim-teal disabled:opacity-30'}`}
            >
              <SafeIcon name="RefreshCw" className={`w-3 h-3 ${isOptimizing ? 'animate-spin' : ''}`} />
              {isOptimizing ? 'OPTIMIZING...' : 'RE-OPTIMIZE'}
            </button>
          </div>
        </div>

        {/* Vehicle Vitals */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-void/50 p-2 rounded border border-axim-border">
            <div className="text-[9px] text-gray-500 font-mono mb-1 flex items-center gap-1">
              <SafeIcon name="Droplet" className="w-3 h-3" />
              FUEL
            </div>
            <div className="flex items-center justify-between">
              <div className="h-1 flex-1 bg-gray-800 rounded-full mr-2">
                <div className="h-full bg-axim-warn rounded-full" style={{ width: `${vehicle?.fuel}%` }}></div>
              </div>
              <span className="text-[10px] font-mono text-white">{vehicle?.fuel}%</span>
            </div>
          </div>
          <div className="bg-void/50 p-2 rounded border border-axim-border">
            <div className="text-[9px] text-gray-500 font-mono mb-1 flex items-center gap-1">
              <SafeIcon name="Zap" className="w-3 h-3" />
              BATT
            </div>
            <div className="flex items-center justify-between">
              <div className="h-1 flex-1 bg-gray-800 rounded-full mr-2">
                <div className="h-full bg-axim-success rounded-full" style={{ width: `${vehicle?.battery}%` }}></div>
              </div>
              <span className="text-[10px] font-mono text-white">{vehicle?.battery}%</span>
            </div>
          </div>
          <div className="bg-void/50 p-2 rounded border border-axim-border text-center">
            <div className="text-[9px] text-gray-500 font-mono mb-1 flex items-center gap-1 justify-center">
              <SafeIcon name="Package" className="w-3 h-3" />
              LOAD
            </div>
            <span className="text-[10px] font-mono text-white">{vehicle?.load}</span>
          </div>
        </div>

        {!manifest ? (
          <div className="py-8 text-center text-gray-500 font-mono text-xs">
            NO ACTIVE MANIFEST
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-void rounded-full overflow-hidden border border-axim-border">
              <motion.div 
                animate={{ width: `${Math.round((manifest.stops.filter(s => s.status === 'completed').length / manifest.stops.length) * 100)}%` }}
                className="h-full bg-axim-teal shadow-[0_0_10px_rgba(45,212,191,0.5)]"
              ></motion.div>
            </div>
            <span className="text-[10px] font-mono text-axim-teal uppercase">Prog: {Math.round((manifest.stops.filter(s => s.status === 'completed').length / manifest.stops.length) * 100)}%</span>
          </div>
        )}
      </div>

      {manifest && (
        <div className="flex-1 overflow-y-auto p-4 relative">
          <AnimatePresence>
            {isOptimizing && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 bg-void/60 backdrop-blur-[2px] flex items-center justify-center"
              >
                <div className="text-center">
                  <SafeIcon name="RefreshCw" className="w-8 h-8 text-axim-teal animate-spin mx-auto mb-2" />
                  <span className="text-[10px] font-mono text-axim-teal animate-pulse uppercase tracking-widest">Recalculating Route...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="space-y-4">
            {manifest.stops.map((stop, idx) => {
              const isLast = idx === manifest.stops.length - 1;
              const isCompleted = stop.status === 'completed';
              const isArrived = stop.status === 'arrived';
              let icon = isCompleted ? 'CheckCircle' : isArrived ? 'MapPin' : stop.is_injected ? 'AlertCircle' : 'Circle';
              let colorClass = isCompleted ? 'text-axim-success' : isArrived ? 'text-axim-teal' : stop.is_injected ? 'text-axim-warn' : 'text-gray-500';

              return (
                <motion.div layout key={stop.id} className="relative flex gap-4">
                  {!isLast && <div className={`absolute left-3 top-6 bottom-[-1rem] w-px border-l-2 ${isCompleted ? 'border-axim-success' : 'border-gray-800'}`}></div>}
                  <div className={`relative z-10 mt-1 bg-axim-panel rounded-full ${colorClass}`}>
                    <SafeIcon name={icon} className="w-6 h-6" />
                  </div>
                  <div className={`flex-1 p-3 rounded-lg border transition-all ${stop.is_injected ? 'border-axim-warn/50 bg-axim-warn/10 shadow-[0_0_15px_rgba(251,191,36,0.1)]' : 'border-axim-border bg-void/30'} ${isCompleted ? 'opacity-60' : ''}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-gray-500">#{idx + 1}</span>
                          <h4 className={`text-sm font-medium ${isCompleted ? 'text-gray-500 line-through' : 'text-gray-200'}`}>{stop.destination_name}</h4>
                        </div>
                        <div className="text-[10px] text-gray-500 mt-1 font-mono uppercase">
                          Status: <span className={colorClass}>{stop.status}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {stop.arrival_time && (
                          <div className="text-[10px] font-mono text-gray-500 bg-void px-1.5 py-0.5 rounded border border-axim-border">
                            {stop.arrival_time}
                          </div>
                        )}
                        {!isCompleted && (
                          <div className="flex gap-1">
                            {!isArrived ? (
                              <button 
                                onClick={() => updateStopStatus(stop.id, 'arrived')}
                                className="px-2 py-0.5 bg-axim-teal/10 border border-axim-teal/30 text-[9px] font-mono text-axim-teal rounded hover:bg-axim-teal hover:text-void transition-colors"
                              >
                                ARRIVE
                              </button>
                            ) : (
                              <button 
                                onClick={() => updateStopStatus(stop.id, 'completed')}
                                className="px-2 py-0.5 bg-axim-success/10 border border-axim-success/30 text-[9px] font-mono text-axim-success rounded hover:bg-axim-success hover:text-void transition-colors"
                              >
                                COMPLETE
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}