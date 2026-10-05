export const useClinic = () => {
  const patients = useState<any[]>('patients', () => [])
  const selectedId = useState<number | null>('selectedId', () => null)
  const notes = useState<Record<number, string>>('notes', () => ({}))
  const rxs = useState<any[]>('rxs', () => [])
  const load = async () => { if (!patients.value.length) patients.value = await $fetch('/api/patients') }
  const admit = (id: number) => {
    const p = patients.value.find(x => x.id === id); if (p) p.status = 'admitted'
    selectedId.value = id
  }
  const selected = computed(() => patients.value.find(p => p.id === selectedId.value))
  return { patients, selectedId, selected, notes, rxs, load, admit }
}
