export async function loadAuditTools() {
  if (!import.meta.env.DEV) return;
  if (!new URLSearchParams(window.location.search).has('audit')) return;
  const { default: axe } = await import('axe-core');
  Object.assign(window, { axe });
}
