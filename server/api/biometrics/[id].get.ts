export default defineEventHandler((e) => biometrics(Number(getRouterParam(e, 'id')) || 1))
