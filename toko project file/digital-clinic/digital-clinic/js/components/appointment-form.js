/* Appointment form component.
   - Department select fills the Doctor select (data from DEPARTMENTS).
   - Date cannot be in the past (min = today, in the user's timezone).
   - validate() checks every field and shows inline errors.
   - On success it saves through AppointmentStore (which notifies the list), then emails the
     booking to the selected doctor through EmailNotifier. The booking is saved FIRST, so a failed
     email never loses it; the patient is told if the email step did not go through.
   - A hidden "botcheck" checkbox is a honeypot: bots tick it, people never see it.
   - Reads ?dept=<id> from the URL (set by the Departments cards) to pre-select a department. */
const AppointmentForm = {
  render() {
    return `
    <form id="appt-form" novalidate>
      <div class="field"><label for="name">Full name</label><input id="name" type="text" required><small class="error"></small></div>
      <div class="row">
        <div class="field"><label for="phone">Phone</label><input id="phone" type="tel" required><small class="error"></small></div>
        <div class="field"><label for="email">Email</label><input id="email" type="email" required><small class="error"></small></div>
      </div>
      <div class="row">
        <div class="field"><label for="department">Department</label><select id="department" required></select><small class="error"></small></div>
        <div class="field"><label for="doctor">Doctor</label><select id="doctor" required disabled><option value="">Select department first</option></select><small class="error"></small></div>
      </div>
      <div class="row">
        <div class="field"><label for="date">Date</label><input id="date" type="date" required><small class="error"></small></div>
        <div class="field"><label for="time">Time</label><select id="time" required></select><small class="error"></small></div>
      </div>
      <div class="field"><label for="reason">Reason for visit (optional)</label><textarea id="reason" rows="3"></textarea></div>
      <input type="checkbox" id="botcheck" tabindex="-1" autocomplete="off" style="display:none" aria-hidden="true">
      <button class="btn" type="submit">Confirm Appointment</button>
      <p class="form-msg" id="form-msg" role="status"></p>
    </form>`;
  },
  init() {
    const { $ } = Utils;
    const form = $('#appt-form'), dept = $('#department'), doc = $('#doctor'), time = $('#time'), date = $('#date'), msg = $('#form-msg');

    dept.innerHTML = '<option value="">Select department</option>' + DEPARTMENTS.map(d => `<option value="${d.id}">${d.name}</option>`).join('');
    time.innerHTML = '<option value="">Select time</option>' + TIME_SLOTS.map(t => `<option>${t}</option>`).join('');
    const now = new Date(); now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    date.min = now.toISOString().split('T')[0];

    const fillDoctors = () => {
      const d = DEPARTMENTS.find(x => x.id === dept.value);
      doc.disabled = !d;
      doc.innerHTML = d ? '<option value="">Select doctor</option>' + d.doctors.map(n => `<option>${n}</option>`).join('')
                        : '<option value="">Select department first</option>';
    };
    dept.addEventListener('change', fillDoctors);
    const preset = new URLSearchParams(location.search).get('dept');
    if (DEPARTMENTS.some(d => d.id === preset)) { dept.value = preset; fillDoctors(); }

    const setError = (input, text) => {
      const f = input.closest('.field');
      f.classList.toggle('invalid', !!text); $('.error', f).textContent = text || '';
      return !text;
    };
    const val = id => $('#' + id).value.trim();
    const validate = () => [
      setError($('#name'), val('name').length >= 3 ? '' : 'Enter your full name.'),
      setError($('#phone'), /^[+\d][\d\s-]{6,17}$/.test(val('phone')) ? '' : 'Enter a valid phone number.'),
      setError($('#email'), /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val('email')) ? '' : 'Enter a valid email.'),
      setError(dept, dept.value ? '' : 'Choose a department.'),
      setError(doc, doc.value ? '' : 'Choose a doctor.'),
      setError(date, date.value && date.value >= date.min ? '' : 'Pick today or a future date.'),
      setError(time, time.value ? '' : 'Choose a time.')
    ].every(Boolean);

    form.addEventListener('submit', async e => {
      e.preventDefault();
      if ($('#botcheck').checked) return;   // honeypot: silently ignore bots
      if (!validate()) { msg.className = 'form-msg bad'; msg.textContent = 'Please fix the highlighted fields.'; return; }
      if (AppointmentStore.isTaken(doc.value, date.value, time.value)) {
        msg.className = 'form-msg bad'; msg.textContent = 'That slot is already booked. Please choose another time.'; return;
      }
      const appt = { name: val('name'), phone: val('phone'), email: val('email'), dept: dept.value,
        deptName: dept.selectedOptions[0].text, doctor: doc.value, date: date.value, time: time.value, reason: val('reason') };
      AppointmentStore.add(appt);                       // 1) save first: never lose a booking
      const btn = $('button[type=submit]', form);
      btn.disabled = true; msg.className = 'form-msg'; msg.textContent = 'Booking your appointment...';
      const result = await EmailNotifier.send(appt);    // 2) then notify the clinic by email
      btn.disabled = false;
      if (result.ok) { msg.className = 'form-msg ok'; msg.textContent = 'Appointment confirmed and the clinic has been notified by email.'; }
      else if (result.reason === 'not-configured') { msg.className = 'form-msg bad'; msg.textContent = 'Appointment saved, but this doctor’s email notification is not configured yet.'; }
      else { msg.className = 'form-msg bad'; msg.textContent = 'Appointment saved, but we could not send the email notification. Please call the clinic to confirm.'; }
      form.reset(); fillDoctors();
    });
  }
};
