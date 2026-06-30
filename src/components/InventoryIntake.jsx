import React, { useState } from 'react';
import { useCommodoreStore } from '../store/useCommodoreStore';
import SafeIcon from '../common/SafeIcon';

export default function InventoryIntake({ onClose }) {
  const { selectedVehicleId, addInventoryItem } = useCommodoreStore();
  const [form, setForm] = useState({ name: '', qty: '', weight: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.qty || !form.weight) return;
    await addInventoryItem({
      vehicle_id: selectedVehicleId,
      item_name: form.name,
      quantity: form.qty,
      unit: 'UNITS',
      weight_kg: form.weight,
      status: 'secured'
    });
    onClose();
  };

  return (
    <div className="p-4 bg-void/50 border border-axim-teal/20 rounded-lg mb-4 font-mono">
      <div className="flex justify-between items-center mb-4">
        <span className="text-[10px] text-axim-teal uppercase font-bold">New Payload Intake</span>
        <button onClick={onClose} className="text-gray-500 hover:text-white"><SafeIcon name="X" className="w-4 h-4" /></button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input 
          placeholder="Item Name / SKU"
          value={form.name}
          onChange={(e) => setForm({...form, name: e.target.value})}
          className="w-full bg-void border border-axim-border text-[10px] text-white p-2 rounded outline-none focus:border-axim-teal"
        />
        <div className="grid grid-cols-2 gap-3">
          <input 
            placeholder="Quantity"
            type="number"
            value={form.qty}
            onChange={(e) => setForm({...form, qty: e.target.value})}
            className="bg-void border border-axim-border text-[10px] text-white p-2 rounded outline-none focus:border-axim-teal"
          />
          <input 
            placeholder="Weight (KG)"
            type="number"
            value={form.weight}
            onChange={(e) => setForm({...form, weight: e.target.value})}
            className="bg-void border border-axim-border text-[10px] text-white p-2 rounded outline-none focus:border-axim-teal"
          />
        </div>
        <button type="submit" className="w-full py-2 bg-axim-teal text-void text-[10px] font-bold rounded uppercase">Authorize Loading</button>
      </form>
    </div>
  );
}