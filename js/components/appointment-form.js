/* Appointment booking form. */
const AppointmentForm = {
  render() {
    return `
    <form id="appt-form" novalidate hidden>
      <div class="field"><label for="name">Full name</label><input id="name" type="text" readonly required><small class="error"></small></div>
      <div class="row">
        <div class="field"><label for="phone">Phone</label><input id="phone" type="tel" required><small class="error"></small></div>
        <div class="field"><label for="email">Email</label><input id="email" type="email" readonly required><small class="error"></small></div>
      </div>
      <div class="row">
        <div class="field"><label for="department">Department</label><select id="department" required></select><small class="error"></small></div>
        <div class="field"><label for="doctor">Doctor</label><select id="doctor" required disabled><option value="">Select department first</option></select><small class="error"></small></div>
      </div>
      <div class="row">
        <div class="field"><label for="date">Date</label><input id="date" type="date" required><small class="error"></small></div>
        <div class="field"><label for="time">Time</label><select id="time" required></select><small class="error"></small></div>
      </div>
      <div class="field"><label for="reason">Reason for visit (optional)</label><textarea id="reason" rows="3" maxlength="2000"></textarea></div>
      <button class="btn" type="submit">Confirm Appointment</button>
      <p class="form-msg" id="form-msg" role="status"></p>
    </form>`;
  },
  init() {
    const { $ } = Utils;
    const form = $('#appt-form');
    const dept = $('#department');
    const doc = $('#doctor');
    const time = $('#time');
    const date = $('#date');
    const msg = $('#form-msg');
    const authMsg = $('#appt-auth-msg');
    const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

    dept.innerHTML = '<option value="">Select department</option>' +
      DEPARTMENTS.map(item => `<option value="${item.id}">${item.name}</option>`).join('');
    time.innerHTML = '<option value="">Select time</option>' +
      timeSlots.map(slot => `<option value="${slot}">${slot}</option>`).join('');
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    date.min = today.toISOString().slice(0, 10);

    const fillDoctors = () => {
      const department = DEPARTMENTS.find(item => item.id === dept.value);
      doc.disabled = !department;
      doc.innerHTML = department
        ? '<option value="">Select doctor</option>' + department.doctors.map(name => `<option>${name}</option>`).join('')
        : '<option value="">Select department first</option>';
    };
    dept.addEventListener('change', fillDoctors);
    const preset = new URLSearchParams(location.search).get('dept');
    if (DEPARTMENTS.some(item => item.id === preset)) {
      dept.value = preset;
      fillDoctors();
    }

    let current;
    try {
      current = DemoStore.session('patient');
    } catch (error) {
      authMsg.hidden = false;
      authMsg.className = 'form-msg bad';
      authMsg.textContent = error.message;
      return;
    }
    if (current?.type !== 'patient') {
      authMsg.hidden = false;
      authMsg.className = 'form-msg bad';
      authMsg.textContent = 'Sign in or create a patient account before booking.';
      const link = document.createElement('a');
      link.href = `account.html?redirect=${encodeURIComponent(`appointment.html${location.search}`)}`;
      link.textContent = 'Go to patient sign in';
      authMsg.append(' ', link);
      return;
    }

    authMsg.hidden = false;
    authMsg.hidden = true;
    form.hidden = false;
    $('#name').value = current.name;
    $('#email').value = current.email;

    const value = id => $('#' + id).value.trim();
    const setError = (input, text) => {
      const field = input.closest('.field');
      field.classList.toggle('invalid', Boolean(text));
      $('.error', field).textContent = text || '';
      return !text;
    };
    const validate = () => [
      setError($('#name'), value('name').length >= 3 ? '' : 'Enter your full name.'),
      setError($('#phone'), /^[+\d][\d\s-]{6,17}$/.test(value('phone')) ? '' : 'Enter a valid phone number.'),
      setError($('#email'), /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value('email')) ? '' : 'Enter a valid email.'),
      setError(dept, dept.value ? '' : 'Choose a department.'),
      setError(doc, doc.value ? '' : 'Choose a doctor.'),
      setError(date, date.value && date.value >= date.min ? '' : 'Pick today or a future date.'),
      setError(time, time.value ? '' : 'Choose a time.')
    ].every(Boolean);

    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!validate()) {
        msg.className = 'form-msg bad';
        msg.textContent = 'Please fix the highlighted fields.';
        return;
      }
      try {
        DemoStore.createBooking(current, {
          phone: value('phone'),
          department: dept.selectedOptions[0].text,
          doctor: doc.value,
          date: date.value,
          time: time.value,
          reason: value('reason')
        });
        msg.className = 'form-msg ok';
        msg.textContent = 'Appointment added to your appointments.';
        const phone = value('phone');
        form.reset();
        $('#name').value = current.name;
        $('#email').value = current.email;
        $('#phone').value = phone;
        fillDoctors();
      } catch (error) {
        msg.className = 'form-msg bad';
        msg.textContent = error.message || 'Could not save this appointment. Please try again.';
      }
    });
  }
};
