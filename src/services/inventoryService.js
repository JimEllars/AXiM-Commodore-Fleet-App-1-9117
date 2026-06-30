import { ensureTab, getRows, appendRow, findRowIndexById, updateRow } from '../lib/googleSheets';

const TAB = 'Inventory';
const HEADERS = ['id', 'vehicle_id', 'item_name', 'quantity', 'unit', 'weight_kg', 'status', 'created_at'];

export const inventoryService = {
  async bootstrap() {
    await ensureTab(TAB, HEADERS);
    const rows = await this.getAll();
    if (rows.length === 0) {
      const initial = [
        [crypto.randomUUID(), 'TRUCK-01', 'Medical Supplies (Grade A)', '450', 'units', '1200', 'secured', new Date().toISOString()],
        [crypto.randomUUID(), 'TRUCK-01', 'Industrial Coolant', '12', 'drums', '2400', 'secured', new Date().toISOString()],
        [crypto.randomUUID(), 'VAN-04', 'Consumer Electronics (Batch 9)', '85', 'parcels', '420', 'in_transit', new Date().toISOString()]
      ];
      for (const i of initial) await appendRow(`${TAB}!A:H`, i);
    }
  },

  async getAll() {
    const rows = await getRows(`${TAB}!A2:H`);
    return rows.map(r => {
      const obj = {};
      HEADERS.forEach((h, i) => obj[h] = r[i]);
      return obj;
    });
  },

  async add(data) {
    const row = [
      crypto.randomUUID(),
      data.vehicle_id,
      data.item_name,
      String(data.quantity),
      data.unit || 'UNITS',
      String(data.weight_kg),
      data.status || 'secured',
      new Date().toISOString()
    ];
    await appendRow(`${TAB}!A:H`, row);
  },

  async updateStatus(id, status) {
    const index = await findRowIndexById(TAB, id);
    if (index === -1) return null;
    const current = (await getRows(`${TAB}!A${index}:H${index}`))[0];
    const updated = [...current];
    updated[6] = status;
    return updateRow(`${TAB}!A${index}:H${index}`, updated);
  },

  async getForVehicle(vehicleId) {
    const all = await this.getAll();
    return all.filter(i => i.vehicle_id === vehicleId);
  }
};