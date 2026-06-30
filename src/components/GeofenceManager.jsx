import React, { useState } from 'react';
import { useCommodoreStore } from '../store/useCommodoreStore';
import SafeIcon from '../common/SafeIcon';
import { motion, AnimatePresence } from 'framer-motion';

export default function GeofenceManager() {
  const { geofences, toggleGeofence, addGeofence, removeGeofence } = useCommodoreStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newGf, setNewGf] = useState({ name: '', lat: 45, lng: 45, radius: 5, type: 'RESTRICTED', severity: 'CRITICAL' });

  const handleAdd = async (e) => {
    e.preventDefault();
    await addGeofence({
      name: newGf.name,
      lat: newGf.lat,
      lng: newGf.lng,
      radius_km: newGf.radius,
      type: newGf.type,
      severity: newGf.severity
    });
    setShowAdd(false);
    setNewGf({ name: '', lat: 45, lng: 45, radius: 5, type: 'RESTRICTED', severity: 'CRITICAL' });
  };

  return (
    <div className="h-full flex flex-col bg-axim-panel border border-axim-border rounded-lg overflow-hidden font-mono relative">
      <div className="p-3 border-b border-axim-border bg-void/50 flex justify-between items-center">
        <div className="flex items-center gap-2 text-axim-teal text-xs uppercase tracking-widest">
          <SafeIcon name="Shield" className="w-4 h-4" />
          <span>Operational Geofencing</span>
        </div>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="text-[10px] text-axim-teal hover:text-white transition-colors flex items-center gap-1"
        >
          <SafeIcon name={showAdd ? 'X' : 'Plus'} className="w-3 h-3" />
          {showAdd ? 'CANCEL' : 'ADD REGION'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <AnimatePresence>
          {showAdd && (
            <motion.form 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              onSubmit={handleAdd}
              className="p-3 bg-void/50 border border-axim-teal/30 rounded mb-4 space-y-3 overflow-hidden"
            >
              <input 
                required
                placeholder="Region Name"
                className="w-full bg-void border border-axim-border rounded px-2 py-1 text-[10px] text-white focus:border-axim-teal outline-none"
                value={newGf.name}
                onChange={e => setNewGf({...newGf, name: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[8px] text-gray-500">LAT / LNG</label>
                  <div className="flex gap-1">
                    <input type="number" step="0.01" className="w-full bg-void border border-axim-border rounded px-1 py-1 text-[9px] text-white" value={newGf.lat} onChange={e => setNewGf({...newGf, lat: e.target.value})} />
                    <input type="number" step="0.01" className="w-full bg-void border border-axim-border rounded px-1 py-1 text-[9px] text-white" value={newGf.lng} onChange={e => setNewGf({...newGf, lng: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] text-gray-500">RADIUS (KM)</label>
                  <input type="number" className="w-full bg-void border border-axim-border rounded px-1 py-1 text-[9px] text-white" value={newGf.radius} onChange={e => setNewGf({...newGf, radius: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <select className="w-full bg-void border border-axim-border rounded px-1 py-1 text-[9px] text-white" value={newGf.type} onChange={e => setNewGf({...newGf, type: e.target.value})}>
                  <option value="RESTRICTED">RESTRICTED</option>
                  <option value="ADVISORY">ADVISORY</option>
                  <option value="PREFERRED">PREFERRED</option>
                </select>
                <select className="w-full bg-void border border-axim-border rounded px-1 py-1 text-[9px] text-white" value={newGf.severity} onChange={e => setNewGf({...newGf, severity: e.target.value})}>
                  <option value="CRITICAL">CRITICAL</option>
                  <option value="WARN">WARN</option>
                  <option value="INFO">INFO</option>
                </select>
              </div>
              <button type="submit" className="w-full py-1.5 bg-axim-teal text-void text-[9px] font-bold rounded hover:bg-white transition-colors uppercase">Initialize Polygon</button>
            </motion.form>
          )}
        </AnimatePresence>

        {geofences.map((gf) => (
          <div key={gf.id} className={`p-3 rounded border transition-all group ${gf.active ? 'bg-void/40 border-axim-border' : 'bg-void/10 border-axim-border opacity-50'}`}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                  {gf.name}
                  {gf.severity === 'CRITICAL' && <div className="w-1.5 h-1.5 rounded-full bg-axim-alert animate-pulse"></div>}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[8px] px-1 rounded ${gf.type === 'RESTRICTED' ? 'bg-axim-alert/20 text-axim-alert' : 'bg-axim-teal/20 text-axim-teal'}`}>
                    {gf.type}
                  </span>
                  <span className="text-[9px] text-gray-600">{gf.radius_km}KM RAD</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => removeGeofence(gf.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-600 hover:text-axim-alert transition-all"
                >
                  <SafeIcon name="Trash2" className="w-3 h-3" />
                </button>
                <button 
                  onClick={() => toggleGeofence(gf.id)}
                  className={`w-7 h-3.5 rounded-full relative transition-colors ${gf.active ? 'bg-axim-teal' : 'bg-gray-800'}`}
                >
                  <div className={`absolute top-0.5 w-2.5 h-2.5 bg-white rounded-full transition-all ${gf.active ? 'right-0.5' : 'left-0.5'}`}></div>
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center text-[8px] text-gray-500">
              <span className="truncate">COORD: {gf.lat.toFixed(2)}, {gf.lng.toFixed(2)}</span>
              <span className={gf.severity === 'CRITICAL' ? 'text-axim-alert' : 'text-axim-teal'}>{gf.severity}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}