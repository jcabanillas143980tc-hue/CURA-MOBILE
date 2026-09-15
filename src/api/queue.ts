import client from './client';

// Screen: screen-queue — live queue number + estimated wait
export const getQueueStatus = (appointmentId: string) =>
  client.get(`/queue/${appointmentId}`).then(r => r.data);
