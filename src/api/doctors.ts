import client from './client';

// Screen: screen-doctor (doctor picker step of the booking flow)
export const getAvailableDoctors = () => client.get('/doctors').then(r => r.data);
export const getDoctorSlots = (doctorId: string, date: string) =>
  client.get(`/doctors/${doctorId}/availability`, { params: { date } }).then(r => r.data);
