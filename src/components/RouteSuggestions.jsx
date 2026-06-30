import React, { useState } from 'react';
import { useCommodoreStore } from '../store/useCommodoreStore';
import SafeIcon from '../common/SafeIcon';
import { motion, AnimatePresence } from 'framer-motion';

export default function RouteSuggestions() {
  const { routeSuggestions, selectedVehicleId, applySuggestion, dismissSuggestion, generateProactiveSuggestions } = useCommodoreStore();
  const [isScanning, setIsScanning] = useState(false);
  
  const suggestions = routeSuggestions.filter(s => 
    s.vehicle_id === selectedVehicleId && s.status === 'pending'
  );

  const handleScan = async () => {
    setIsScanning(true);
    await generateProactiveSuggestions();
    setTimeout(() => setIsScanning(false), 1500);
  };

  return (
    <div className="h-full flex flex-col bg-axim-panel border border-axim-border rounded-lg overflow-hidden">
      <div className="p-3 border-b border-axim-border bg-void/50 flex justify-between items-center">
        <div className="flex items-center gap-2 text-axim-teal font-mono text-sm">
          <SafeIcon name="Cpu" className="w-4 h-4" />
          <span>7. ONYX OPTIMIZATION ADVISOR</span>
        </div>
        <button 
          onClick={handleScan}
          disabled={isScanning}
          className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-mono border transition-all ${
            isScanning 
            ? 'bg-axim-teal/20 text-axim-teal border-axim-teal/30' 
            : 'bg-void border-axim-border text-gray-500 hover:border-axim-teal hover:text-axim-teal'
          }`}
        >
          <SafeIcon name="RefreshCw" className={`w-3 h-3 ${isScanning ? 'animate-spin' : ''}`} />
          {isScanning ? 'SCANNING...' : 'SCAN FOR GAINS'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-void/20">
        <AnimatePresence mode="popLayout">
          {suggestions.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center text-center p-6"
            >
              <div className="relative mb-3">
                <SafeIcon name="ShieldCheck" className="w-8 h-8 text-gray-800" />
                <div className="absolute inset-0 bg-axim-teal/10 blur-xl rounded-full"></div>
              </div>
              <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                Topology is optimal.<br/>No intervention required.
              </p>
            </motion.div>
          ) : (
            suggestions.map((s) => (
              <motion.div 
                key={s.id}
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-3 bg-axim-panel border border-axim-border rounded-lg relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-2">
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                    s.type === 'SLA_PROTECTION' 
                    ? 'bg-axim-alert/20 text-axim-alert border-axim-alert/30' 
                    : 'bg-axim-teal/20 text-axim-teal border-axim-teal/30'
                  }`}>
                    IMPACT: {s.impact}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${s.type === 'SLA_PROTECTION' ? 'bg-axim-alert animate-pulse' : 'bg-axim-teal'}`}></div>
                  <span className="text-[10px] font-bold text-white uppercase tracking-tighter">{s.type.replace('_', ' ')}</span>
                </div>

                <p className="text-xs text-gray-400 mb-4 pr-16 leading-relaxed">
                  {s.description}
                </p>

                <div className="flex gap-2">
                  <button 
                    onClick={() => applySuggestion(s)}
                    className="flex-1 py-1.5 bg-axim-teal text-void text-[10px] font-bold rounded hover:bg-white transition-colors uppercase tracking-wider shadow-[0_0_10px_rgba(45,212,191,0.2)]"
                  >
                    Apply Change
                  </button>
                  <button 
                    onClick={() => dismissSuggestion(s.id)}
                    className="px-3 py-1.5 bg-void border border-axim-border text-gray-500 text-[10px] font-bold rounded hover:text-axim-alert hover:border-axim-alert transition-colors"
                  >
                    <SafeIcon name="X" className="w-3 h-3" />
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