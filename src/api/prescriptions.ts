import client from './client';

// Screen: screen-rx — prescriptions + medication tracker (dose status)
export const getPrescriptions = () => client.get('/prescriptions').then(r => r.data);
export const markDoseTaken = (prescriptionId: string, doseId: string) =>
  client.post(`/prescriptions/${prescriptionId}/doses/${doseId}/taken`).then(r => r.data);
