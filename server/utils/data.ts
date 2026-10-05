export const patients = [
  { id: 1, name: 'Ravi Kumar', age: 62, weight: 78, score: 94, complaint: ['Chest pain', 'Dyspnea'], allergies: ['Penicillin'] },
  { id: 2, name: 'Anita Rao', age: 34, weight: 58, score: 71, complaint: ['High fever', 'Cough'], allergies: [] },
  { id: 3, name: 'Imran Sheikh', age: 47, weight: 85, score: 66, complaint: ['Hyperglycemia'], allergies: ['Sulfa'] },
  { id: 4, name: 'Meera Nair', age: 28, weight: 54, score: 38, complaint: ['Migraine'], allergies: ['NSAIDs'] },
  { id: 5, name: 'Suresh Babu', age: 55, weight: 90, score: 52, complaint: ['Hypertension', 'Headache'], allergies: [] },
  { id: 6, name: 'Divya Menon', age: 22, weight: 50, score: 15, complaint: ['Sore throat'], allergies: [] }
].map(p => ({ ...p, status: 'waiting', severity: p.score >= 80 ? 'Urgent' : p.score >= 50 ? 'Priority' : 'Routine' }))

export const drugs = [
  { name: 'Amoxicillin', cls: 'Penicillin', maxMgKgDay: 90, maxMgDay: 3000 },
  { name: 'Azithromycin', cls: 'Macrolide', maxMgKgDay: 12, maxMgDay: 500 },
  { name: 'Paracetamol', cls: 'Analgesic', maxMgKgDay: 60, maxMgDay: 4000 },
  { name: 'Ibuprofen', cls: 'NSAIDs', maxMgKgDay: 40, maxMgDay: 2400 },
  { name: 'Metformin', cls: 'Biguanide', maxMgKgDay: 40, maxMgDay: 2550 },
  { name: 'Cotrimoxazole', cls: 'Sulfa', maxMgKgDay: 40, maxMgDay: 1920 },
  { name: 'Amlodipine', cls: 'CCB', maxMgKgDay: 0.15, maxMgDay: 10 },
  { name: 'Aspirin', cls: 'NSAIDs', maxMgKgDay: 50, maxMgDay: 4000 }
]

const rnd = (seed: number) => () => (seed = (seed * 16807) % 2147483647) / 2147483647
export function biometrics(id: number) {
  const r = rnd(id * 97 + 13)
  const hr = 60 + id * 6
  const ecg = Array.from({ length: 160 }, (_, i) => {
    const p = i % (200 - hr)
    return p === 10 ? 0.25 : p === 24 ? -0.15 : p === 27 ? 1 : p === 30 ? -0.3 : p === 46 ? 0.3 : (r() - 0.5) * 0.04
  })
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`)
  return {
    hours, ecg,
    sys: hours.map((_, i) => Math.round(110 + id * 5 + 12 * Math.sin(i / 3) + r() * 6)),
    dia: hours.map((_, i) => Math.round(70 + id * 2 + 7 * Math.sin(i / 3) + r() * 4)),
    spo2: hours.map(() => Math.round(Math.max(86, 99 - (id === 1 ? 6 : 0) - r() * 3))),
    glucose: hours.map((_, i) => Math.round(95 + (id === 3 ? 90 : 10) + 35 * Math.sin(i / 2.5) + r() * 10))
  }
}
