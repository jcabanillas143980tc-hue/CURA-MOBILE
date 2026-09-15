import client from './client';

// Screen: screen-notifications
export const getNotifications = () => client.get('/notifications').then(r => r.data);
export const markNotificationRead = (id: string) =>
  client.post(`/notifications/${id}/read`).then(r => r.data);
