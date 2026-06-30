import { ensureTab, getRows, appendRow } from '../lib/googleSheets';

const TAB = 'OptimizationHistory';
const HEADERS = ['id', 'vehicle_id', 'algorithm', 'time_saved_mins', 'fuel_saved_gal', 'efficiency_gain', 'created_at'];

export const optimizationHistoryService = {
  async bootstrap() {
    await ensureTab(TAB, HEADERS);
    const rows = await this.getAll();
    if (rows.length === 0) {
      const initial = [
        [crypto.randomUUID(), 'TRUCK-01', 'Onyx-V3 (Alpha)', '22', '1.4', '+8.2%', new Date(Date.now() - 86400000).toISOString()],
        [crypto.randomUUID(), 'VAN-04', 'Onyx-V3 (Alpha)', '12', '0.8', '+4.5%', new Date(Date.now() - 172800000).toISOString()],
        [crypto.randomUUID(), 'OTR-99', 'Onyx-V3 (Alpha)', '45', '3.2', '+12.1%', new Date(Date.now() - 259200000).toISOString()]
      ];
      for (const h of initial) await appendRow(`${TAB}!A:G`, h);
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

  async log(vehicleId, data) {
    const row = [
      crypto.randomUUID(),
      vehicleId,
      'Onyx-V3 (Alpha)',
      data.timeSaved || '0',
      data.fuelSaved || '0',
      data.gain || '0%',
      new Date().toISOString()
    ];
    return appendRow(`${TAB}!A:G`, row);
  }
};