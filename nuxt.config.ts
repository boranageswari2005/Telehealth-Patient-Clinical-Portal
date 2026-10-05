export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  nitro: { preset: 'cloudflare-pages' },
  css: ['~/assets/main.css'],
  app: { head: { title: 'ClinicFlow' } }
})
