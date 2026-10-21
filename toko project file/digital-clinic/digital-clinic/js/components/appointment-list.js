/* "My Appointments" panel. Re-renders whenever AppointmentStore fires
   "appointments:changed". User text goes in with textContent (never innerHTML)
   so typed names cannot inject HTML. */
const AppointmentList = {
  render() {
    return `
    <aside class="my-appts reveal">
      <h3>My Appointments</h3>
      <ul id="appt-list"></ul>
      <p class="empty" id="appt-empty">No appointments yet.</p>
    </aside>`;
  },
  init() {
    const { $ } = Utils;
    const draw = () => {
      const list = AppointmentStore.load(), ul = $('#appt-list');
      $('#appt-empty').hidden = list.length > 0;
      ul.innerHTML = '';
      list.forEach(a => {
        const li = document.createElement('li');
        const when = document.createElement('strong'); when.textContent = `${a.date} at ${a.time}`;
        const info = document.createElement('span'); info.textContent = `${a.doctor} (${a.deptName}) for ${a.name}`;
        const cancel = document.createElement('button');
        cancel.className = 'cancel'; cancel.type = 'button'; cancel.textContent = 'Cancel';
        cancel.addEventListener('click', () => AppointmentStore.remove(a.id));
        li.append(when, info, document.createElement('br'), cancel);
        ul.append(li);
      });
    };
    document.addEventListener('appointments:changed', draw);
    draw();
  }
};
