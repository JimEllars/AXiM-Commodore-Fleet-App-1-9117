import React, { useState } from 'react';
import { useCommodoreStore } from '../store/useCommodoreStore';
import SafeIcon from '../common/SafeIcon';

export default function MaintenanceScheduler({ onClose }) {
  const { selectedVehicleId, addMaintenanceRecord } = useCommodoreStore();
  const [form, setForm] = useState({ type: 'Oil Change', description: '', cost: '$', date: new Date().toISOString().split('T')[0] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addMaintenanceRecord({ ...form, vehicle_id: selectedVehicleId });
    onClose();
  };

  return (
    <div className="p-4 bg-void/50 border border-axim-teal/20 rounded-lg mb-4 font-mono">
      <div className="flex justify-between items-center mb-4">
        <span className="text-[10px] text-axim-teal uppercase font-bold">Schedule New Service</span>
        <button onClick={onClose} className="text-gray-500 hover:text-white"><SafeIcon name="X" className="w-4 h-4" /></button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <select 
            value={form.type}
            onChange={(e) => setForm({...form, type: e.target.value})}
            className="bg-void border border-axim-border text-[10px] text-white p-2 rounded outline-none focus:border-axim-teal"
          >
            <option>Oil Change</option>
            <option>Tire Rotation</option>
            <option>Brake Inspection</option>
            <option>Sensor Calibration</option>
            <option>ELD Reset</option>
          </select>
          <input 
            type="date"
            value={form.date}
            onChange={(e) => setForm({...form, date: e.target.value})}
            className="bg-void border border-axim-border text-[10px] text-white p-2 rounded outline-none focus:border-axim-teal"
          />
        </div>
        <input 
          placeholder="Service Description"
          value={form.description}
          onChange={(e) => setForm({...form, description: e.target.value})}
          className="w-full bg-void border border-axim-border text-[10px] text-white p-2 rounded outline-none focus:border-axim-teal"
        />
        <div className="flex gap-2">
          <input 
            placeholder="Est. Cost"
            value={form.cost}
            onChange={(e) => setForm({...form, cost: e.target.value})}
            className="flex-1 bg-void border border-axim-border text-[10px] text-white p-2 rounded outline-none focus:border-axim-teal"
          />
          <button type="submit" className="px-4 bg-axim-teal text-void text-[10px] font-bold rounded uppercase">Log Record</button>
        </div>
      </form>
    </div>
  );
}