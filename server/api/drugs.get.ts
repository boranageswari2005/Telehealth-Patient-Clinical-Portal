export default defineEventHandler((e) => {
  const q = String(getQuery(e).q || '').toLowerCase()
  return drugs.filter(d => d.name.toLowerCase().includes(q)).slice(0, 6)
})
