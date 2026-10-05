<script setup lang="ts">
const { patients, selectedId, selected, rxs, load } = useClinic()
await load()
if (!selectedId.value) selectedId.value = patients.value[0].id
const q = ref(''), opts = ref<any[]>([]), drug = ref<any>(null)
const dose = ref(500), perDay = ref(3), days = ref(5)
const alertOpen = ref(false), override = ref(false), sig = ref(''), confirm = ref(false), msg = ref('')
const conflict = computed(() => !!drug.value && !!selected.value?.allergies.includes(drug.value.cls))
watch(q, async (v) => { opts.value = !v || drug.value?.name === v ? [] : await $fetch('/api/drugs', { query: { q: v } }) })
const pick = (d: any) => {
  drug.value = d; q.value = d.name; opts.value = []; override.value = false
  nextTick(() => { if (conflict.value) alertOpen.value = true })
}
watch(selectedId, () => { override.value = false; if (conflict.value) alertOpen.value = true })
const limit = computed(() => drug.value && selected.value ? Math.min(drug.value.maxMgDay, drug.value.maxMgKgDay * selected.value.weight) : 0)
const daily = computed(() => dose.value * perDay.value)
const doseOk = computed(() => !!drug.value && daily.value > 0 && daily.value <= limit.value)
const canSign = computed(() => doseOk.value && (!conflict.value || override.value) && confirm.value && sig.value.trim().length >= 3)
const submit = async () => {
  try {
    const r: any = await $fetch('/api/prescriptions', { method: 'POST', body: {
      patientId: selected.value.id, drug: drug.value.name, doseMg: dose.value, perDay: perDay.value, days: days.value,
      allergyOverride: override.value, signature: sig.value } })
    rxs.value.unshift({ ...r, patient: selected.value.name, drug: drug.value.name, dose: dose.value, perDay: perDay.value, days: days.value, by: sig.value })
    msg.value = `Signed & issued ${r.rxId}`; confirm.value = false
  } catch (e: any) { msg.value = 'Rejected: ' + (e.statusMessage || 'error') }
}
</script>
<template>
  <h1>Digital e-Prescription Pad</h1>
  <div class="grid2">
    <div class="card">
      <label class="mut">Patient</label>
      <select v-model.number="selectedId"><option v-for="p in patients" :key="p.id" :value="p.id">{{ p.name }} — {{ p.weight }}kg</option></select>
      <div class="mut" style="margin:6px 0 12px">Allergies: <b :class="selected?.allergies.length ? 'bad' : ''">{{ selected?.allergies.join(', ') || 'none' }}</b></div>
      <label class="mut">Medication</label>
      <div style="position:relative">
        <input v-model="q" placeholder="Search medication…" />
        <div v-if="opts.length" class="ac"><div v-for="d in opts" :key="d.name" @click="pick(d)">{{ d.name }} <span class="mut">{{ d.cls }}</span></div></div>
      </div>
      <div class="row" style="margin-top:12px">
        <div class="grow"><label class="mut">Dose (mg)</label><input type="number" v-model.number="dose" /></div>
        <div class="grow"><label class="mut">Times/day</label><input type="number" v-model.number="perDay" /></div>
        <div class="grow"><label class="mut">Days</label><input type="number" v-model.number="days" /></div>
      </div>
      <p v-if="drug" :class="doseOk ? 'ok' : 'bad'">
        {{ doseOk ? '✔' : '✖' }} Daily {{ daily }} mg vs safe max {{ Math.round(limit) }} mg/day for {{ selected.weight }}kg
      </p>
      <p v-if="conflict" class="bad">⚠ Allergy contraindication ({{ drug.cls }}) {{ override ? '— overridden by prescriber' : '' }}</p>
    </div>
    <div class="card">
      <b>Doctor digital signature</b>
      <input v-model="sig" placeholder="Type full name to sign (e.g. Dr. A. Sharma)" style="margin:10px 0" />
      <label class="row"><input type="checkbox" v-model="confirm" style="width:auto" /> I confirm this prescription is clinically reviewed.</label>
      <button :disabled="!canSign" style="margin-top:12px" @click="submit">Sign & Issue</button>
      <p v-if="msg">{{ msg }}</p>
      <h4>Issued this session</h4>
      <div v-for="r in rxs" :key="r.rxId" class="mut">{{ r.rxId }} · {{ r.patient }} · {{ r.drug }} {{ r.dose }}mg ×{{ r.perDay }}/d ×{{ r.days }}d · signed {{ r.by }}</div>
    </div>
  </div>
  <div v-if="alertOpen" class="modal"><div>
    <h3 class="bad">⚠ Allergy contraindication</h3>
    <p><b>{{ selected.name }}</b> has a recorded <b>{{ drug.cls }}</b> allergy; <b>{{ drug.name }}</b> belongs to that class.</p>
    <div class="row"><button class="ghost" @click="alertOpen = false; drug = null; q = ''">Cancel drug</button>
      <button class="off" @click="override = true; alertOpen = false">Override (clinical justification)</button></div>
  </div></div>
</template>
