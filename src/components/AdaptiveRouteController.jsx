import React, { useState } from 'react';
import { useCommodoreStore } from '../store/useCommodoreStore';
import SafeIcon from '../common/SafeIcon';
import { motion, AnimatePresence } from 'framer-motion';
import OptimizerImpactView from './OptimizerImpactView';

export default function AdaptiveRouteController() {
  const { selectedVehicleId, manifests, triggerAdaptiveOptimization, isOptimizing, activeOptimization, currentUser } = useCommodoreStore();
  const [strategy, setStrategy] = useState('TIME');
  
  const manifest = manifests[selectedVehicleId];
  const hasProposal = !!activeOptimization;

  return (
    <div className="h-full flex flex-col bg-axim-panel border border-axim-border rounded-lg overflow-hidden font-mono">
      <div className="p-3 border-b border-axim-border bg-void/50 flex justify-between items-center">
        <div className="flex items-center gap-2 text-axim-teal text-xs uppercase tracking-widest">
          <SafeIcon name="Cpu" className="w-4 h-4" />
          <span>Adaptive Route Solver</span>
        </div>
        <div className="flex gap-1">
          {['TIME', 'FUEL', 'SLA'].map(s => (
            <button
              key={s}
              onClick={() => setStrategy(s)}
              className={`min-h-[44px] min-w-[44px] px-4 py-2 rounded text-[10px] border transition-all active:scale-95 focus:ring-2 focus:ring-axim-teal/50 ${strategy === s ? 'bg-axim-teal border-axim-teal text-void font-bold' : 'bg-void border-axim-border text-gray-500 hover:text-white'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-4 flex flex-col">
        {!hasProposal && !isOptimizing ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-12 h-12 rounded-full border border-axim-border flex items-center justify-center text-gray-600">
              <SafeIcon name="Zap" className="w-6 h-6" />
            </div>
            <p className="text-[10px] text-gray-500 uppercase leading-relaxed">
              No active proposal.<br/>Initialize Onyx-V3 to scan for efficiency gains.
            </p>
            <button 
              onClick={() => triggerAdaptiveOptimization(strategy)}
              disabled={currentUser?.role !== 'COMMANDER'}
              className={`min-h-[44px] px-6 py-2 bg-void border text-[10px] font-bold rounded uppercase tracking-widest transition-all flex items-center gap-2 active:scale-95 focus:ring-2 focus:ring-axim-teal/50 ${
                currentUser?.role === 'COMMANDER'
                  ? 'border-axim-teal text-axim-teal hover:bg-axim-teal hover:text-void'
                  : 'border-gray-600 text-gray-500 cursor-not-allowed opacity-60'
              }`}
            >
              {currentUser?.role !== 'COMMANDER' && <SafeIcon name="Lock" className="w-3 h-3" />}
              Run Adaptive Scan
            </button>
          </div>
        ) : isOptimizing ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="text-axim-teal"
            >
              <SafeIcon name="RefreshCw" className="w-8 h-8" />
            </motion.div>
            <div className="text-[10px] text-axim-teal animate-pulse uppercase tracking-widest">
              SOLVING TOPOLOGY VARIANCE...
            </div>
          </div>
        ) : (
          <OptimizerImpactView />
        )}
      </div>

      <div className="p-3 bg-void/50 border-t border-axim-border">
        <div className="flex justify-between items-center text-[9px] text-gray-500 uppercase">
          <span>Engine Status:</span>
          <span className="text-axim-success flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-axim-success animate-pulse"></div>
            Nominal
          </span>
        </div>
      </div>
    </div>
  );
}