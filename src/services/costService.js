import { ensureTab, getRows, appendRow } from '../lib/googleSheets';

const TAB = 'Costs';
const HEADERS = ['id', 'vehicle_id', 'category', 'amount', 'description', 'date', 'created_at'];

export const costService = {
  async bootstrap() {
    await ensureTab(TAB, HEADERS);
    const rows = await this.getAll();
    if (rows.length === 0) {
      const initial = [
        [crypto.randomUUID(), 'TRUCK-01', 'FUEL', '450.25', 'Fill up at Station 42', '2024-05-18', new Date().toISOString()],
        [crypto.randomUUID(), 'VAN-04', 'TOLL', '12.50', 'Bridge Crossing', '2024-05-19', new Date().toISOString()],
        [crypto.randomUUID(), 'OTR-99', 'MAINTENANCE', '1200.00', 'Engine Overhaul', '2024-05-15', new Date().toISOString()],
        [crypto.randomUUID(), 'TRUCK-01', 'LABOR', '300.00', 'Sarah Jenkins Daily Rate', '2024-05-20', new Date().toISOString()]
      ];
      for (const c of initial) await appendRow(`${TAB}!A:G`, c);
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

  async add(data) {
    const row = [
      crypto.randomUUID(),
      data.vehicle_id,
      data.category,
      data.amount,
      data.description,
      data.date || new Date().toISOString().split('T')[0],
      new Date().toISOString()
    ];
    return appendRow(`${TAB}!A:G`, row);
  }
};