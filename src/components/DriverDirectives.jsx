import React, { useState } from 'react';
import { useCommodoreStore } from '../store/useCommodoreStore';
import SafeIcon from '../common/SafeIcon';
import { motion, AnimatePresence } from 'framer-motion';

export default function DriverDirectives() {
  const { directives, selectedVehicleId, activeVehicles, sendDirective } = useCommodoreStore();
  const [msg, setMsg] = useState('');
  
  const vehicleDirectives = directives.filter(d => d.vehicle_id === selectedVehicleId);
  const vehicle = activeVehicles[selectedVehicleId];

  const handleSend = async (e) => {
    e.preventDefault();
    if (!msg.trim()) return;
    await sendDirective(selectedVehicleId, msg);
    setMsg('');
  };

  return (
    <div className="h-full flex flex-col bg-axim-panel border border-axim-border rounded-lg overflow-hidden">
      <div className="p-3 border-b border-axim-border bg-void/50 flex justify-between items-center">
        <div className="flex items-center gap-2 text-axim-teal font-mono text-sm">
          <SafeIcon name="MessageSquare" className="w-4 h-4" />
          <span>5. DRIVER DIRECTIVES</span>
        </div>
        <div className="text-[10px] font-mono text-gray-500">
          NODE: {vehicle?.name || 'OFFLINE'}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-void/20">
        <AnimatePresence initial={false}>
          {vehicleDirectives.map((d) => (
            <motion.div 
              key={d.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`max-w-[85%] p-2 rounded-lg border ${d.sender === 'COMMODORE_CORE' ? 'ml-auto bg-axim-teal/10 border-axim-teal/30' : 'bg-axim-panel border-axim-border'}`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-[9px] font-bold text-axim-teal uppercase">{d.sender}</span>
                <span className="text-[8px] font-mono text-gray-600">{new Date(d.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <p className="text-xs text-gray-300">{d.message}</p>
              <div className="mt-1 flex justify-end">
                <span className="text-[8px] font-mono text-gray-500 uppercase">{d.status}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <form onSubmit={handleSend} className="p-3 border-t border-axim-border bg-void/50 flex gap-2">
        <input 
          type="text" 
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Enter command directive..."
          className="flex-1 bg-void border border-axim-border rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-axim-teal transition-colors"
        />
        <button 
          type="submit"
          className="p-2 bg-axim-teal text-void rounded hover:bg-white transition-colors"
        >
          <SafeIcon name="Send" className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}