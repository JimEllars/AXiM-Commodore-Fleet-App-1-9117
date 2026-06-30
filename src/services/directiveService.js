import { ensureTab, getRows, appendRow } from '../lib/googleSheets';

const TAB = 'Directives';
const HEADERS = ['id', 'vehicle_id', 'sender', 'message', 'status', 'priority', 'created_at'];

export const directiveService = {
  async bootstrap() {
    await ensureTab(TAB, HEADERS);
    const rows = await this.getAll();
    if (rows.length === 0) {
      const initial = [
        [crypto.randomUUID(), 'TRUCK-01', 'DISPATCH_ALPHA', 'Route adjusted due to congestion on I-95.', 'read', 'normal', new Date().toISOString()],
        [crypto.randomUUID(), 'VAN-04', 'SYSTEM', 'Battery thermal warning. Reduce speed.', 'delivered', 'high', new Date().toISOString()]
      ];
      for (const d of initial) await appendRow(`${TAB}!A:G`, d);
    }
  },

  async getAll() {
    const rows = await getRows(`${TAB}!A2:G`);
    return rows.map(r => {
      const obj = {};
      HEADERS.forEach((h, i) => obj[h] = r[i]);
      return obj;
    });
  },

  async send(vehicleId, message, priority = 'normal') {
    const id = crypto.randomUUID();
    const row = [
      id, vehicleId, 'COMMODORE_CORE', message, 'sent', priority, new Date().toISOString()
    ];
    await appendRow(`${TAB}!A:G`, row);
    return id;
  }
};