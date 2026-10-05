<script setup lang="ts">
const { patients, load, admit } = useClinic()
await load()
const queue = computed(() => [...patients.value].sort((a, b) => b.score - a.score))
const toast = ref('')
const doAdmit = (p: any) => { admit(p.id); toast.value = `${p.name} admitted — open Consultation to begin.` }
</script>
<template>
  <h1>Clinical Triage & Patient Intake Queue</h1>
  <div v-if="toast" class="card ok">{{ toast }}</div>
  <div v-for="p in queue" :key="p.id" class="card row" :style="{ opacity: p.status === 'admitted' ? .55 : 1 }">
    <div style="width:46px;text-align:center"><b style="font-size:20px">{{ p.score }}</b><div class="mut">score</div></div>
    <span :class="['badge', p.severity]">{{ p.severity }}</span>
    <div class="grow">
      <b>{{ p.name }}</b> <span class="mut">{{ p.age }}y · {{ p.weight }}kg</span>
      <div class="row" style="margin-top:6px"><span v-for="c in p.complaint" :key="c" class="tag">{{ c }}</span></div>
    </div>
    <button :disabled="p.status === 'admitted'" @click="doAdmit(p)">{{ p.status === 'admitted' ? 'Admitted' : 'Admit' }}</button>
  </div>
</template>
