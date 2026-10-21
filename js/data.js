/* Editable content: change doctors, departments and tips here, no other code needs touching. */
const DEPARTMENTS = [
  { id: 'general',    icon: '🩺', name: 'General Medicine', desc: 'Routine check-ups and common illnesses.',      doctors: ['Dr. Silas James', 'Dr. Isa Hosea'] },
  { id: 'cardiology', icon: '❤️', name: 'Cardiology',       desc: 'Heart health, blood pressure and care.',        doctors: ['Dr. Seed Iliya'] },
  { id: 'pediatrics', icon: '🧒', name: 'Pediatrics',       desc: 'Gentle care for babies and children.',          doctors: ['Dr. Faith Emmanuel'] },
  { id: 'dental',     icon: '🦷', name: 'Dental',           desc: 'Cleaning, fillings and oral health advice.',    doctors: ['Dr. Delaiah Daniel'] },
  { id: 'maternity',  icon: '🤰', name: 'Maternity',        desc: 'Antenatal, delivery and postnatal support.',    doctors: ['Dr. Martina Markus'] }
];

const TIME_SLOTS = ['08:00','09:00','10:00','11:00','12:00','14:00','15:00','16:00','17:00'];

const HEALTH_TIPS = [
  { q: 'How much water should I drink daily?', a: 'Most adults do well with about 6–8 glasses a day. Drink more in hot weather or when exercising.' },
  { q: 'Why is sleep important?', a: 'Adults need 7–9 hours of sleep. Good sleep supports immunity, memory, mood and heart health.' },
  { q: 'How can I prevent malaria?', a: 'Sleep under insecticide-treated nets, clear stagnant water, and seek testing early if you have fever.' },
  { q: 'How often should I get a check-up?', a: 'A yearly general check-up is a good habit. Regular blood pressure and blood sugar checks help catch problems early.' },
  { q: 'What are signs I need urgent care?', a: 'Chest pain, difficulty breathing, severe bleeding, sudden weakness or confusion need emergency care immediately.' },
  { q: 'How do I wash my hands properly?', a: 'Use soap and water for at least 20 seconds, covering palms, backs of hands, between fingers and under nails.' }
];
