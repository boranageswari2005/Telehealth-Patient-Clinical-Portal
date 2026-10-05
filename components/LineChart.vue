<script setup lang="ts">
const props = defineProps<{ series: { label: string; data: number[]; color: string }[]; height?: number; unit?: string }>()
const W = 600, H = props.height || 140
const all = computed(() => props.series.flatMap(s => s.data))
const lo = computed(() => Math.min(...all.value)), hi = computed(() => Math.max(...all.value))
const pts = (d: number[]) => d.map((v, i) =>
  `${(i / (d.length - 1)) * W},${H - 8 - ((v - lo.value) / (hi.value - lo.value || 1)) * (H - 16)}`).join(' ')
</script>
<template>
  <div>
    <svg :viewBox="`0 0 ${W} ${H}`" width="100%" preserveAspectRatio="none" style="background:#fafbfd;border-radius:6px">
      <line v-for="i in 3" :key="i" x1="0" :x2="W" :y1="(H / 4) * i" :y2="(H / 4) * i" stroke="#e5e9f0" />
      <polyline v-for="s in series" :key="s.label" :points="pts(s.data)" fill="none" :stroke="s.color" stroke-width="2" vector-effect="non-scaling-stroke" />
    </svg>
    <div class="row mut">
      <span v-for="s in series" :key="s.label"><b :style="{ color: s.color }">●</b> {{ s.label }} (latest {{ s.data[s.data.length - 1] }}{{ unit }})</span>
      <span>range {{ lo }}–{{ hi }}</span>
    </div>
  </div>
</template>
