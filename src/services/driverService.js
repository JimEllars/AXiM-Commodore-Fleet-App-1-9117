import { ensureTab, getRows, appendRow, updateRow, findRowIndexById } from '../lib/googleSheets';

const TAB = 'Drivers';
const HEADERS = [
  'id', 'name', 'status', 'license_no', 'phone', 'assigned_vehicle', 
  'total_hours', 'safety_score', 'efficiency_rating', 'on_time_perc', 
  'total_miles', 'certifications', 'license_expiry', 'created_at'
];

export const driverService = {
  async bootstrap() {
    await ensureTab(TAB, HEADERS);
    const rows = await this.getAll();
    if (rows.length === 0) {
      const initial = [
        [crypto.randomUUID(), 'Sarah Jenkins', 'active', 'DL-9921-X', '+1-555-0102', 'TRUCK-01', '1,240', '98', '94', '99.2', '45,200', 'HAZMAT,DOUBLE_T', '2025-12-01', new Date().toISOString()],
        [crypto.randomUUID(), 'Marcus Thorne', 'active', 'DL-4412-B', '+1-555-0199', 'VAN-04', '850', '82', '88', '94.5', '22,150', 'STANDARD', '2024-08-15', new Date().toISOString()],
        [crypto.randomUUID(), 'Elena Rodriguez', 'on_break', 'DL-7721-C', '+1-555-0211', 'None', '2,100', '95', '91', '97.8', '82,400', 'HAZMAT,REFRIG', '2026-01-10', new Date().toISOString()]
      ];
      for (const d of initial) await appendRow(`${TAB}!A:N`, d);
    }
  },

  async getAll() {
    const rows = await getRows(`${TAB}!A2:N`);
    return rows.map(r => {
      const obj = {};
      HEADERS.forEach((h, i) => obj[h] = r[i]);
      return obj;
    });
  },

  async updateMetrics(id, metrics) {
    const index = await findRowIndexById(TAB, id);
    if (index === -1) return null;
    const current = (await getRows(`${TAB}!A${index}:N${index}`))[0];
    const updated = [...current];
    if (metrics.safety_score) updated[7] = String(metrics.safety_score);
    if (metrics.efficiency_rating) updated[8] = String(metrics.efficiency_rating);
    if (metrics.on_time_perc) updated[9] = String(metrics.on_time_perc);
    return updateRow(`${TAB}!A${index}:N${index}`, updated);
  }
};