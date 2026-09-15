export type Doctor = { id: string; name: string; specialty: string; avatar_url?: string };
export type Appointment = {
  id: string; doctor_name: string; date: string; time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
};
export type QueueStatus = { queue_number: number; estimated_wait_minutes: number; position: number };
export type MedicalRecord = { id: string; date: string; doctor_name: string; diagnosis: string; notes?: string };
export type Prescription = {
  id: string; medicine_name: string; dosage: string; frequency: string;
  duration: string; instructions?: string;
};
export type AppNotification = { id: string; title: string; body: string; read: boolean; created_at: string };
