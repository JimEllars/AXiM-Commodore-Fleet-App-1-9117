import React, { useEffect } from 'react';
import { useCommodoreStore } from '../store/useCommodoreStore';
import SafeIcon from '../common/SafeIcon';
import { motion } from 'framer-motion';

export default function BioTelemetry() {
  const { selectedVehicleId, activeVehicles, operatorVitals, drivers } = useCommodoreStore();
  const vehicle = activeVehicles[selectedVehicleId];
  const driver = drivers.find(d => d.id === vehicle?.driver_id || d.assigned_vehicle === vehicle?.id);
  const vitals = driver ? operatorVitals[driver.id] : null;
  useEffect(() => { const supabaseUrl = import.meta.env.VITE_SUPABASE_URL; const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY; if (!supabaseUrl || !supabaseKey) return; let client; let channel; import('@supabase/supabase-js').then(({ createClient }) => { client = createClient(supabaseUrl, supabaseKey); channel = client.channel('bio-telemetry-realtime').on('postgres_changes', { event: '*', schema: 'public', table: 'telemetry_stream' }, (payload) => { if (payload.new && payload.new.driver_id) { useCommodoreStore.setState(state => { const data = payload.new.data || payload.new; const currentVitals = state.operatorVitals[payload.new.driver_id]; if (currentVitals) { return { operatorVitals: { ...state.operatorVitals, [payload.new.driver_id]: { ...currentVitals, bpm: data.bpm !== undefined ? data.bpm : currentVitals.bpm, stress: data.stress !== undefined ? data.stress : currentVitals.stress, fatigue: data.fatigue !== undefined ? data.fatigue : currentVitals.fatigue } } }; } return state; }); } }).subscribe(); }); return () => { if (client && channel) client.removeChannel(channel); }; }, []);

  if (!vitals) return (
    <div className="h-full flex items-center justify-center bg-axim-panel border border-axim-border rounded-lg text-gray-600 text-[10px] font-mono uppercase">
      No Operator Linked
    </div>
  );

  const isHighStress = vitals.stress > 70;
  const isHighFatigue = vitals.fatigue > 80;

  return (
    <div className="h-full flex flex-col bg-axim-panel border border-axim-border rounded-lg overflow-hidden font-mono">
      <div className="p-3 border-b border-axim-border bg-void/50 flex justify-between items-center">
        <div className="flex items-center gap-2 text-axim-teal text-xs uppercase tracking-widest">
          <SafeIcon name="Activity" className="w-4 h-4" />
          <span>Operator Bio-Link</span>
        </div>
        <div className="text-[10px] text-gray-500">{driver.name}</div>
      </div>

      <div className="flex-1 p-4 grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="p-3 bg-void/50 border border-axim-border rounded relative overflow-hidden">
            <div className="text-[9px] text-gray-500 mb-1">HEART RATE</div>
            <div className="flex items-end gap-1">
              <span className={`text-2xl font-bold ${vitals.bpm > 100 ? 'text-axim-alert' : 'text-white'}`}>
                {Math.round(vitals.bpm)}
              </span>
              <span className="text-[10px] text-gray-600 mb-1">BPM</span>
            </div>
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 60 / vitals.bpm, repeat: Infinity }}
              className={`absolute top-2 right-2 w-2 h-2 rounded-full ${vitals.bpm > 100 ? 'bg-axim-alert' : 'bg-axim-teal'}`}
            />
          </div>

          <div className="p-3 bg-void/50 border border-axim-border rounded">
            <div className="text-[9px] text-gray-500 mb-1">STRESS (GSR)</div>
            <div className="flex items-end justify-between">
              <span className={`text-xl font-bold ${isHighStress ? 'text-axim-warn' : 'text-white'}`}>
                {Math.round(vitals.stress)}%
              </span>
              <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${isHighStress ? 'bg-axim-warn' : 'bg-axim-teal'}`}
                  style={{ width: `${vitals.stress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between">
          <div className={`p-4 rounded border flex flex-col items-center justify-center text-center transition-colors ${isHighFatigue ? 'bg-axim-alert/10 border-axim-alert/30' : 'bg-void/50 border-axim-border'}`}>
            <SafeIcon name="ZapOff" className={`w-8 h-8 mb-2 ${isHighFatigue ? 'text-axim-alert animate-pulse' : 'text-gray-600'}`} />
            <div className="text-[10px] text-gray-500 uppercase mb-1">Fatigue Index</div>
            <div className={`text-xl font-bold ${isHighFatigue ? 'text-axim-alert' : 'text-white'}`}>
              {Math.round(vitals.fatigue)}%
            </div>
          </div>

          <button className="w-full py-2 bg-void border border-axim-border text-[9px] text-gray-500 hover:text-axim-teal hover:border-axim-teal transition-all uppercase rounded">
            Full Bio-Log
          </button>
        </div>
      </div>
    </div>
  );
}