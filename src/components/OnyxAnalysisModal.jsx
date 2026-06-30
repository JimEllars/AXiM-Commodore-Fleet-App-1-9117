import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCommodoreStore } from '../store/useCommodoreStore';
import SafeIcon from '../common/SafeIcon';

export default function OnyxAnalysisModal() {
  const { activeOnyxTrace, setOnyxTrace } = useCommodoreStore();

  if (!activeOnyxTrace) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/90 backdrop-blur-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-2xl bg-axim-panel border border-axim-teal/30 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(45,212,191,0.2)]"
        >
          {/* Header */}
          <div className="p-4 border-b border-axim-border flex items-center justify-between bg-axim-teal/5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-axim-teal/10 rounded-lg">
                <SafeIcon name="Cpu" className="w-6 h-6 text-axim-teal" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">ONYX MK3 SWARM ANALYSIS</h3>
                <p className="text-[10px] font-mono text-axim-teal uppercase tracking-widest">Diagnostic Trace: {activeOnyxTrace.id}</p>
              </div>
            </div>
            <button 
              onClick={() => setOnyxTrace(null)}
              className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white"
            >
              <SafeIcon name="X" className="w-5 h-5" />
            </button>
          </div>

          {/* Analysis Body */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-void/50 border border-axim-border rounded-lg">
                <span className="text-[10px] font-mono text-gray-500 block mb-1 uppercase">Root Cause Analysis</span>
                <p className="text-sm text-axim-warn leading-relaxed">
                  {activeOnyxTrace.message.includes('ELD') 
                    ? "Hardware handshake failure detected. Reefer telemetry packet dropped. Potential sensor array malfunction in Unit OTR-99."
                    : "Geofence boundary breach triggered by localized GPS jitter or unauthorized pathing variance."}
                </p>
              </div>
              <div className="p-4 bg-void/50 border border-axim-border rounded-lg">
                <span className="text-[10px] font-mono text-gray-500 block mb-1 uppercase">Recommended Action</span>
                <div className="flex items-center gap-2 text-axim-teal text-sm mt-2">
                  <SafeIcon name="RefreshCw" className="w-4 h-4 animate-spin-slow" />
                  <span>Force Remote Reset of ELD Module</span>
                </div>
              </div>
            </div>

            {/* Simulated Trace Data */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-gray-500 uppercase">Sub-System Traces</span>
              <div className="bg-void p-3 rounded border border-axim-border font-mono text-[10px] space-y-1 max-h-40 overflow-y-auto">
                <div className="text-axim-success">✓ AXiM_CORE_AUTH: PASSED</div>
                <div className="text-axim-success">✓ KV_REPLICATION_STATE: STABLE</div>
                <div className="text-axim-alert">✗ EDGE_TELEMETRY_VALVE: CONNECTION_TIMED_OUT (408)</div>
                <div className="text-gray-500">... analyzing retransmission logs ...</div>
                <div className="text-gray-500">... probing ELD terminal through AgentView node ...</div>
                <div className="text-axim-warn">! DISPATCH_HANDSHAKE: MANUAL_INTERVENTION_REQUIRED</div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-void/80 border-t border-axim-border flex justify-end gap-3">
            <button 
              onClick={() => setOnyxTrace(null)}
              className="px-4 py-2 text-xs font-mono text-gray-400 hover:text-white"
            >
              DISMISS
            </button>
            <button className="px-6 py-2 bg-axim-teal text-void text-xs font-bold rounded hover:bg-white transition-colors">
              EXECUTE REMOTE RESET
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}