import { ensureTab, getRows, appendRow, updateRow, findRowIndexById, sheetsRequest } from '../lib/googleSheets';

const MANIFEST_TAB = 'Manifests';
const MANIFEST_HEADERS = ['id', 'vehicle_id', 'manifest_id', 'created_at', 'updated_at'];

const STOPS_TAB = 'Stops';
const STOPS_HEADERS = [
  'id', 'manifest_id', 'sequence_order', 'destination_name', 
  'status', 'arrival_time', 'is_injected', 'created_at', 'updated_at'
];

export const manifestService = {
  async bootstrap() {
    await ensureTab(MANIFEST_TAB, MANIFEST_HEADERS);
    await ensureTab(STOPS_TAB, STOPS_HEADERS);
  },

  async getForVehicle(vehicleId) {
    const manifests = await getRows(`${MANIFEST_TAB}!A2:E`);
    const manifestRow = manifests.find(m => m[1] === vehicleId);
    if (!manifestRow) return null;

    const manifestId = manifestRow[0];
    const allStops = await getRows(`${STOPS_TAB}!A2:I`);
    const stops = allStops
      .filter(s => s[1] === manifestId)
      .map(s => {
        const obj = {};
        STOPS_HEADERS.forEach((h, i) => {
          let val = s[i];
          if (h === 'sequence_order') val = parseFloat(val);
          if (h === 'is_injected') val = val === 'true';
          obj[h] = val;
        });
        return obj;
      })
      .sort((a, b) => a.sequence_order - b.sequence_order);

    return {
      id: manifestId,
      manifest_id: manifestRow[2],
      stops
    };
  },

  async updateStopStatus(stopId, status) {
    const index = await findRowIndexById(STOPS_TAB, stopId);
    if (index === -1) return null;
    
    // Read current row to preserve other fields
    const current = (await getRows(`${STOPS_TAB}!A${index}:I${index}`))[0];
    const updated = [...current];
    updated[4] = status; // status column
    updated[5] = status === 'arrived' || status === 'completed' ? new Date().toLocaleTimeString() : '';
    updated[8] = new Date().toISOString(); // updated_at

    return updateRow(`${STOPS_TAB}!A${index}:I${index}`, updated);
  },

  async reorderStops(manifestId, stops) {
    // Batch update via multiple requests or sequentially (REST API limitation for simple helpers)
    for (let i = 0; i < stops.length; i++) {
      const stop = stops[i];
      const index = await findRowIndexById(STOPS_TAB, stop.id);
      if (index !== -1) {
        const current = (await getRows(`${STOPS_TAB}!A${index}:I${index}`))[0];
        const updated = [...current];
        updated[2] = i + 1; // new sequence_order
        updated[8] = new Date().toISOString();
        await updateRow(`${STOPS_TAB}!A${index}:I${index}`, updated);
      }
    }
  },

  async addStop(manifestId, stopData) {
    const id = crypto.randomUUID();
    const row = [
      id, manifestId, stopData.sequence_order, stopData.destination_name,
      stopData.status || 'pending', stopData.arrival_time || '',
      String(!!stopData.is_injected), new Date().toISOString(), new Date().toISOString()
    ];
    await appendRow(`${STOPS_TAB}!A:I`, row);
    return id;
  }
};