<script setup lang="ts">
const { patients, selectedId, load } = useClinic()
await load()
const pid = ref(selectedId.value || patients.value[0].id)
const { data: b } = await useFetch<any>(() => `/api/biometrics/${pid.value}`)
</script>
<template>
  <div class="row"><h1 class="grow">Biometric Trend Dashboard</h1>
    <select v-model.number="pid" style="width:220px"><option v-for="p in patients" :key="p.id" :value="p.id">{{ p.name }}</option></select>
  </div>
  <div v-if="b" class="grid2">
    <div class="card"><b>ECG waveform (Lead II preview)</b><LineChart :series="[{ label: 'mV', data: b.ecg, color: '#16a34a' }]" /></div>
    <div class="card"><b>Blood pressure (mmHg)</b><LineChart :series="[{ label: 'Systolic', data: b.sys, color: '#dc2626' }, { label: 'Diastolic', data: b.dia, color: '#2563eb' }]" /></div>
    <div class="card"><b>SpO₂ (%)</b><LineChart :series="[{ label: 'SpO₂', data: b.spo2, color: '#0891b2' }]" unit="%" /></div>
    <div class="card"><b>Blood glucose (mg/dL)</b><LineChart :series="[{ label: 'Glucose', data: b.glucose, color: '#d97706' }]" unit=" mg/dL" /></div>
  </div>
</template>
