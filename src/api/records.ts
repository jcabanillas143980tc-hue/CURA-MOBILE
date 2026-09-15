import client from './client';

// Screen: screen-records — consultation history / medical records timeline
export const getMedicalRecords = () => client.get('/records').then(r => r.data);
export const getRecordDetail = (id: string) => client.get(`/records/${id}`).then(r => r.data);
