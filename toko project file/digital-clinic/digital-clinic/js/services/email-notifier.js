/* Sends booking details to the site's serverless endpoint. Provider credentials and
   recipient routing stay on the server and are never included in browser code. */
const EmailNotifier = (() => {
  async function send(a) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const res = await fetch('/api/send-appointment', {
        method: 'POST', signal: controller.signal,
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(a)
      });
      const data = await res.json();
      if (res.ok && data.success) return { ok: true };
      return { ok: false, reason: data.code === 'not-configured' ? 'not-configured' : 'rejected' };
    } catch {
      return { ok: false, reason: 'network' };
    } finally {
      clearTimeout(timeout);
    }
  }
  return { send };
})();
