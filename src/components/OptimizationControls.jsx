import React from 'react';
import { useCommodoreStore } from '../store/useCommodoreStore';
import SafeIcon from '../common/SafeIcon';

export default function OptimizationControls() {
  const { isOptimizing, triggerOptimization } = useCommodoreStore();

  return (
    <div className="h-full flex flex-col bg-axim-panel border border-axim-border rounded-lg overflow-hidden font-mono">
      <div className="p-3 border-b border-axim-border bg-void/50">
        <div className="flex items-center gap-2 text-axim-teal text-xs uppercase tracking-widest">
          <SafeIcon name="Settings" className="w-4 h-4" />
          <span>Solver Parameters</span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {[
          { label: 'SLA Priority', val: 'High', color: 'bg-axim-alert' },
          { label: 'Fuel Mode', val: 'Economy', color: 'bg-axim-teal' },
          { label: 'Risk Tolerance', val: 'Low', color: 'bg-axim-success' }
        ].map((pref, i) => (
          <div key={i}>
            <div className="flex justify-between text-[10px] mb-2">
              <span className="text-gray-500 uppercase font-bold">{pref.label}</span>
              <span className="text-white uppercase">{pref.val}</span>
            </div>
            <div className="h-1.5 w-full bg-void rounded-full overflow-hidden flex gap-1">
              {[1, 2, 3, 4, 5].map(tick => (
                <div key={tick} className={`h-full flex-1 ${tick <= 4 ? pref.color : 'bg-gray-800'}`}></div>
              ))}
            </div>
          </div>
        ))}

        <div className="pt-4 mt-2 border-t border-axim-border">
          <button 
            onClick={triggerOptimization}
            disabled={isOptimizing}
            className="w-full py-2 bg-axim-teal text-void text-[10px] font-bold rounded hover:bg-white transition-all uppercase flex items-center justify-center gap-2"
          >
            <SafeIcon name="Cpu" className={`w-3 h-3 ${isOptimizing ? 'animate-spin' : ''}`} />
            Run Global Re-Solve
          </button>
        </div>
      </div>
    </div>
  );
}