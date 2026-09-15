import client from './client';

// Screens: screen-doctor -> screen-datetime -> screen-confirm -> screen-allset
export const bookAppointment = (payload: {
  doctor_id: string; date: string; time: string; reason?: string;
}) => client.post('/appointments', payload).then(r => r.data);

export const getMyAppointments = () => client.get('/appointments').then(r => r.data);
export const getUpcomingAppointment = () => client.get('/appointments/upcoming').then(r => r.data);
export const cancelAppointment = (id: string, reason: string) =>
  client.post(`/appointments/${id}/cancel`, { reason }).then(r => r.data);
export const rescheduleAppointment = (id: string, date: string, time: string) =>
  client.post(`/appointments/${id}/reschedule`, { date, time }).then(r => r.data);
