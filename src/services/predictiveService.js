import { ensureTab, getRows, appendRow, updateRow, findRowIndexById } from '../lib/googleSheets';

const TAB = 'Diagnostics';
const HEADERS = ['id', 'vehicle_id', 'component', 'health_score', 'predicted_failure_date', 'stress_level', 'status', 'updated_at'];

export const predictiveService = {
  async bootstrap() {
    await ensureTab(TAB, HEADERS);
    const rows = await this.getAll();
    if (rows.length === 0) {
      const initial = [
        [crypto.randomUUID(), 'TRUCK-01', 'Propulsion System', '92', '2024-12-15', 'Low', 'NOMINAL', new Date().toISOString()],
        [crypto.randomUUID(), 'TRUCK-01', 'Tire Array', '84', '2024-09-10', 'Medium', 'WATCH', new Date().toISOString()],
        [crypto.randomUUID(), 'VAN-04', 'Battery Cells', '71', '2024-07-02', 'High', 'CRITICAL', new Date().toISOString()]
      ];
      for (const d of initial) await appendRow(`${TAB}!A:H`, d);
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

  async logStress(vehicleId, component, health) {
    const rows = await this.getAll();
    const existing = rows.find(r => r.vehicle_id === vehicleId && r.component === component);
    
    if (existing) {
      const index = await findRowIndexById(TAB, existing.id);
      const updated = [...Object.values(existing)];
      updated[3] = String(health);
      updated[7] = new Date().toISOString();
      return updateRow(`${TAB}!A${index}:H${index}`, updated);
    }
  }
};