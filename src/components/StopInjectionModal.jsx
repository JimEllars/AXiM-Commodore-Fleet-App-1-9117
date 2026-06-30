import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCommodoreStore } from '../store/useCommodoreStore';
import SafeIcon from '../common/SafeIcon';

export default function StopInjectionModal({ isOpen, onClose, vehicleId }) {
  const { injectEmergencyStop } = useCommodoreStore();
  const [name, setName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await injectEmergencyStop({ 
      source: 'MANUAL_DISPATCH', 
      message: `Emergency Stop: ${name}`,
      destination: name 
    });
    setName('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-axim-panel border border-axim-teal/30 rounded-xl overflow-hidden shadow-2xl"
        >
          <div className="p-4 border-b border-axim-border flex justify-between items-center bg-axim-teal/5">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Inject Emergency Stop</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
              <SafeIcon name="X" className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] text-gray-500 uppercase font-mono">Destination Name</label>
              <input 
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Distribution Center South"
                className="w-full bg-void border border-axim-border rounded px-4 py-2 text-sm text-white focus:border-axim-teal outline-none font-mono"
              />
            </div>
            <div className="p-3 bg-axim-warn/10 border border-axim-warn/30 rounded text-[10px] text-axim-warn font-mono uppercase leading-relaxed">
              Caution: Injecting a stop will trigger a global route re-optimization for this asset.
            </div>
            <button 
              type="submit"
              className="w-full py-3 bg-axim-teal text-void font-bold rounded hover:bg-white transition-all uppercase text-xs tracking-widest"
            >
              Confirm Injection
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}