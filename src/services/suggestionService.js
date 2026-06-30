import { ensureTab, getRows, appendRow, updateRow, findRowIndexById } from '../lib/googleSheets';

const TAB = 'Suggestions';
const HEADERS = ['id', 'vehicle_id', 'type', 'description', 'impact', 'status', 'created_at', 'updated_at'];

export const suggestionService = {
  async bootstrap() {
    await ensureTab(TAB, HEADERS);
    const rows = await this.getAll();
    if (rows.length === 0) {
      const initial = [
        [crypto.randomUUID(), 'TRUCK-01', 'TIME_RECOVERY', 'Heavy traffic detected on I-95. Reroute via Alt-4 to save 22 mins.', '-22m', 'pending', new Date().toISOString(), new Date().toISOString()],
        [crypto.randomUUID(), 'VAN-04', 'FUEL_EFFICIENCY', 'Stop #3 has low idle time. Batching with Stop #4 reduces fuel burn.', '-0.8g', 'pending', new Date().toISOString(), new Date().toISOString()],
        [crypto.randomUUID(), 'OTR-99', 'SLA_PROTECTION', 'Current pace risks late arrival at Terminal B. Suggesting high-priority re-sequence.', '99% Risk', 'pending', new Date().toISOString(), new Date().toISOString()]
      ];
      for (const s of initial) await appendRow(`${TAB}!A:H`, s);
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

  async add(vehicleId, type, description, impact) {
    const id = crypto.randomUUID();
    const row = [
      id,
      vehicleId,
      type,
      description,
      impact,
      'pending',
      new Date().toISOString(),
      new Date().toISOString()
    ];
    await appendRow(`${TAB}!A:H`, row);
    return id;
  },

  async updateStatus(id, status) {
    const index = await findRowIndexById(TAB, id);
    if (index === -1) return null;
    const current = (await getRows(`${TAB}!A${index}:H${index}`))[0];
    const updated = [...current];
    updated[5] = status;
    updated[7] = new Date().toISOString();
    return updateRow(`${TAB}!A${index}:H${index}`, updated);
  }
};