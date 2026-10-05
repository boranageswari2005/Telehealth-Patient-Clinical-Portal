// Server-side re-validation: never trust client-side safety checks alone.
export default defineEventHandler(async (e) => {
  const b = await readBody(e)
  const p = patients.find(x => x.id === b.patientId)
  const d = drugs.find(x => x.name === b.drug)
  if (!p || !d) throw createError({ statusCode: 400, statusMessage: 'Unknown patient or drug' })
  if (b.doseMg * b.perDay > Math.min(d.maxMgDay, d.maxMgKgDay * p.weight))
    throw createError({ statusCode: 422, statusMessage: 'Daily dose exceeds safe limit' })
  if (p.allergies.includes(d.cls) && !b.allergyOverride)
    throw createError({ statusCode: 409, statusMessage: 'Allergy contraindication not acknowledged' })
  if (!b.signature || b.signature.trim().length < 3)
    throw createError({ statusCode: 401, statusMessage: 'Doctor signature required' })
  return { ok: true, rxId: 'RX-' + Date.now().toString(36).toUpperCase(), signedAt: new Date().toISOString() }
})
