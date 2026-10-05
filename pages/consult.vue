<script setup lang="ts">
const { patients, selectedId, selected, notes, load } = useClinic()
await load()
const stream = ref<MediaStream | null>(null), vid = ref<HTMLVideoElement>()
const mic = ref(true), cam = ref(true), err = ref(''), saved = ref('')
onMounted(async () => {
  try {
    stream.value = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    vid.value!.srcObject = stream.value
  } catch { err.value = 'Camera unavailable — showing placeholder frame.' }
})
onBeforeUnmount(() => stream.value?.getTracks().forEach(t => t.stop()))
const toggle = (kind: 'mic' | 'cam') => {
  const on = kind === 'mic' ? (mic.value = !mic.value) : (cam.value = !cam.value)
  stream.value?.[kind === 'mic' ? 'getAudioTracks' : 'getVideoTracks']().forEach(t => (t.enabled = on))
}
const text = computed({
  get: () => (selectedId.value ? notes.value[selectedId.value] ?? '' : ''),
  set: (v: string) => { notes.value[selectedId.value!] = v; saved.value = new Date().toLocaleTimeString() }
})
const template = () => { text.value = 'S: \nO: \nA: \nP: ' }
</script>
<template>
  <h1>Teleconsultation Workspace</h1>
  <div class="row" style="margin-bottom:12px">
    <select :value="selectedId" style="width:260px" @change="selectedId = Number(($event.target as HTMLSelectElement).value)">
      <option :value="null" disabled>Select patient…</option>
      <option v-for="p in patients" :key="p.id" :value="p.id">{{ p.name }} {{ p.status === 'admitted' ? '(admitted)' : '' }}</option>
    </select>
  </div>
  <div class="grid2">
    <div class="card">
      <div class="video">
        <video ref="vid" autoplay muted playsinline v-show="cam && stream" />
        <span v-if="!cam || !stream">{{ cam ? err || 'Connecting…' : 'Camera off' }}</span>
      </div>
      <div class="row" style="margin-top:10px;justify-content:center">
        <button :class="mic ? 'ghost' : 'off'" @click="toggle('mic')">{{ mic ? '🎙 Mic on' : '🔇 Mic off' }}</button>
        <button :class="cam ? 'ghost' : 'off'" @click="toggle('cam')">{{ cam ? '📷 Camera on' : '🚫 Camera off' }}</button>
      </div>
      <p class="mut">UI frame only: add a signaling channel (e.g. Durable Objects / Cloudflare Calls) with RTCPeerConnection for the remote peer.</p>
    </div>
    <div class="card" v-if="selected">
      <div class="row"><b class="grow">{{ selected.name }} · {{ selected.age }}y</b><span :class="['badge', selected.severity]">{{ selected.severity }}</span></div>
      <div class="mut">Allergies: {{ selected.allergies.join(', ') || 'none recorded' }} · Complaint: {{ selected.complaint.join(', ') }}</div>
      <textarea v-model="text" rows="14" placeholder="EHR clinical notes (SOAP)…" style="margin:10px 0" />
      <div class="row"><button class="ghost" @click="template">Insert SOAP template</button><span class="mut">{{ saved ? 'Autosaved ' + saved : '' }}</span></div>
    </div>
    <div v-else class="card mut">Select or admit a patient to open the EHR editor.</div>
  </div>
</template>
