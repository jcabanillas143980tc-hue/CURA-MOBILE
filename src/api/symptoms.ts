import client from './client';

// Sends patient-reported symptoms (EN/Tagalog/Bisaya) to the Laravel
// backend, which forwards them to the Python/FastAPI AI service and
// returns possible-condition predictions for the doctor to review.
export const submitSymptoms = (text: string, language: 'en' | 'tl' | 'ceb') =>
  client.post('/symptoms/analyze', { text, language }).then(r => r.data);
