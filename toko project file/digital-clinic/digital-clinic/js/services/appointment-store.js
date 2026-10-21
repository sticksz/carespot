/* appointment-store.js: the ONLY place that reads/writes appointments.
   Today it uses localStorage. To use a real backend (e.g. Supabase), replace the
   bodies of load() and save() with API calls; no component needs to change.
   After every change it fires "appointments:changed" so other components can refresh. */
const AppointmentStore = (() => {
  const KEY = 'carespot_appointments';

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
  }
  function save(list) {
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {}
    document.dispatchEvent(new CustomEvent('appointments:changed'));
  }
  const isTaken = (doctor, date, time) => load().some(a => a.doctor === doctor && a.date === date && a.time === time);
  const add = appt => save([...load(), { id: Date.now(), ...appt }]);
  const remove = id => save(load().filter(a => a.id !== id));

  return { load, add, remove, isTaken };
})();
