import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCommodoreStore } from '../store/useCommodoreStore';
import SafeIcon from '../common/SafeIcon';

export default function OnyxAnalysisModal() {
  const { activeOnyxTrace, setOnyxTrace } = useCommodoreStore();
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

    const handleQuerySubmit = async (e) => { e.preventDefault(); if (!query.trim()) return; setIsLoading(true); setResponse(''); setError(null); const currentQuery = query; setQuery(''); try { const workerUrl = import.meta.env.VITE_WORKER_URL || 'https://api.axim.us.com'; const res = await fetch(`${workerUrl}/v1/ai/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-AXiM-Gateway-Trace': activeOnyxTrace.id || 'unknown-trace' }, body: JSON.stringify({ prompt: currentQuery, context: activeOnyxTrace }) }); if (!res.ok) throw new Error(`HTTP ${res.status}`); const data = await res.json(); const answerText = data.response || data.answer || data.message || "Onyx AI Analysis complete. No specific text returned."; let i = 0; const interval = setInterval(() => { setResponse(prev => answerText.slice(0, i + 1)); i++; if (i >= answerText.length) clearInterval(interval); }, 15); } catch (err) { console.error('Onyx AI Error:', err); setError(`[SYS_ERROR] Failed to communicate with Onyx AI Edge Endpoint. ${err.message}`); } finally { setIsLoading(false); } };

  if (!activeOnyxTrace) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/90 backdrop-blur-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-2xl bg-axim-panel border border-axim-teal/30 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(45,212,191,0.2)] flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-4 border-b border-axim-border flex items-center justify-between bg-axim-teal/5 shrink-0">
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
              onClick={() => { setOnyxTrace(null); setResponse(''); setQuery(''); }}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white active:scale-95 focus:ring-2 focus:ring-axim-teal/50"
            >
              <SafeIcon name="X" className="w-5 h-5" />
            </button>
          </div>

          {/* Analysis Body */}
          <div className="p-6 space-y-6 overflow-y-auto">
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

            {/* AI Query Section */}
            <div className="border-t border-axim-border pt-4 mt-4">
              <span className="text-[10px] font-mono text-gray-500 uppercase block mb-2">Ask Onyx AI</span>
              <form onSubmit={handleQuerySubmit} className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask Onyx about this incident..."
                  className="flex-1 bg-void border border-axim-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-axim-teal transition-colors"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !query.trim()}
                  className="min-h-[44px] bg-axim-teal text-void px-4 py-2 rounded text-sm font-bold disabled:opacity-50 hover:bg-white transition-colors active:scale-95 focus:ring-2 focus:ring-white/50"
                >
                  {isLoading ? 'Querying...' : 'Ask'}
                </button>
              </form>

              {/* Typewriter Response Container */}
              {(response || isLoading || error) && (
                <div className={`bg-void/80 border rounded p-4 font-mono text-xs min-h-[60px] whitespace-pre-wrap ${error ? 'border-axim-alert/50 text-axim-alert' : isLoading && !response ? 'border-axim-teal/60 border-dashed animate-pulse text-axim-teal' : 'border-axim-teal/30 text-axim-teal'}`}>
                  {error ? (
                    <div>
                      {error}
                      <button onClick={() => setQuery(query || "Retry")} className="ml-2 underline text-white hover:text-gray-300">Retry Query</button>
                    </div>
                  ) : (
                    <>
                      {response}
                      {isLoading && !response && <span>Analyzing trace data...</span>}
                      {isLoading && <span className="animate-pulse ml-1 inline-block w-1 h-3 bg-axim-teal"></span>}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="p-4 bg-void/80 border-t border-axim-border flex justify-end gap-3 shrink-0">
            <button 
              onClick={() => { setOnyxTrace(null); setResponse(''); setQuery(''); }}
              className="min-h-[44px] px-4 py-2 text-xs font-mono text-gray-400 hover:text-white active:scale-95 focus:ring-2 focus:ring-gray-400/50 rounded"
            >
              DISMISS
            </button>
            <button className="min-h-[44px] px-6 py-2 bg-axim-teal text-void text-xs font-bold rounded hover:bg-white transition-colors active:scale-95 focus:ring-2 focus:ring-axim-teal/50">
              EXECUTE REMOTE RESET
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
