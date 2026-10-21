(() => {
  const app = document.querySelector('#app');
  const doctors = [
    'Dr. Silas James',
    'Dr. Isa Hosea',
    'Dr. Faith Emmanuel',
    'Dr. Seed Iliya',
    'Dr. Delaiah Daniel',
    'Dr. Martina Markus'
  ];
  const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

  app.innerHTML = `
    <header class="header"><nav class="nav container">
      <a href="index.html" class="logo">Care<span>Spot</span></a>
      <a href="appointment.html" class="nav__link">Book an appointment</a>
    </nav></header>
    <main class="admin container">
      <section class="admin__panel">
        <div id="account-auth" class="account__auth">
          <p class="eyebrow">Patient portal</p>
          <h1 class="title">Your CareSpot account</h1>
          <p id="account-message" class="admin__message" role="status" aria-live="polite"></p>
          <div class="account__switch" role="group" aria-label="Choose sign-in or sign-up">
            <button id="show-signin" class="btn btn--ghost" type="button">Sign in</button>
            <button id="show-signup" class="btn btn--ghost" type="button">Create account</button>
          </div>
          <form id="signin-form" class="account__form" novalidate>
            <div class="field account__field"><label for="signin-email">Email address</label><div class="account__input-wrap account__input-wrap--email"><input id="signin-email" name="email" type="email" autocomplete="email" placeholder="you@example.com" required></div></div>
            <div class="field account__field"><label for="signin-password">Password</label><div class="account__input-wrap account__input-wrap--password"><input id="signin-password" name="password" type="password" autocomplete="current-password" placeholder="Enter your password" required><button class="account__password-toggle" type="button" data-toggle-password="signin-password" aria-label="Show password" aria-pressed="false">Show</button></div></div>
            <button class="btn" type="submit">Sign in</button>
          </form>
          <form id="signup-form" class="account__form" novalidate hidden>
            <div class="field"><label for="signup-name">Full name</label><input id="signup-name" name="name" type="text" autocomplete="name" maxlength="120" required></div>
            <div class="field account__field"><label for="signup-email">Email address</label><div class="account__input-wrap account__input-wrap--email"><input id="signup-email" name="email" type="email" autocomplete="email" placeholder="you@example.com" required></div></div>
            <div class="field account__field"><label for="signup-password">Password</label><div class="account__input-wrap account__input-wrap--password"><input id="signup-password" name="password" type="password" autocomplete="new-password" placeholder="Create a password" minlength="8" required><button class="account__password-toggle" type="button" data-toggle-password="signup-password" aria-label="Show password" aria-pressed="false">Show</button></div><small>Use at least 8 characters.</small></div>
            <div class="field account__field"><label for="signup-confirm">Confirm password</label><div class="account__input-wrap account__input-wrap--password"><input id="signup-confirm" name="confirm" type="password" autocomplete="new-password" placeholder="Enter your password again" minlength="8" required><button class="account__password-toggle" type="button" data-toggle-password="signup-confirm" aria-label="Show password" aria-pressed="false">Show</button></div></div>
            <button class="btn" type="submit">Create account</button>
          </form>
        </div>
        <section id="account-dashboard" class="account__dashboard" hidden>
          <p class="eyebrow">Patient portal</p>
          <h1 class="title">Your appointments</h1>
          <p id="account-welcome"></p>
          <p id="dashboard-message" class="admin__message" role="status" aria-live="polite"></p>
          <div class="account__toolbar">
            <a class="btn" href="appointment.html">Book an appointment</a>
            <div class="account__actions">
              <button id="refresh-patient-bookings" class="btn btn--ghost" type="button">Refresh</button>
              <button id="patient-sign-out" class="btn btn--ghost" type="button">Sign out</button>
            </div>
          </div>
          <div id="patient-bookings" class="admin__bookings" aria-live="polite"></div>
        </section>
      </section>
    </main>
    <footer class="footer"><p class="footer__copy">&copy; ${new Date().getFullYear()} CareSpot Digital Clinic</p></footer>`;

  const authPanel = document.querySelector('#account-auth');
  const dashboard = document.querySelector('#account-dashboard');
  const message = document.querySelector('#account-message');
  const dashboardMessage = document.querySelector('#dashboard-message');
  const bookingList = document.querySelector('#patient-bookings');
  const signinForm = document.querySelector('#signin-form');
  const signupForm = document.querySelector('#signup-form');
  const redirect = new URLSearchParams(location.search).get('redirect');
  const validRedirect = redirect === 'appointment.html' || /^appointment\.html\?dept=[a-z]+$/.test(redirect || '');
  let user = null;

  function setMessage(element, text, kind = '') {
    element.textContent = text;
    element.className = `admin__message${kind ? ` admin__message--${kind}` : ''}`;
  }

  function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[char]);
  }

  function showAuth(text = '') {
    authPanel.hidden = false;
    dashboard.hidden = true;
    if (text) setMessage(message, text);
  }

  function renderBookings() {
    const items = DemoStore.patientBookings(user.email);
    if (!items.length) {
      bookingList.innerHTML = '<p class="admin__empty">You do not have any appointments yet.</p>';
      return;
    }
    bookingList.innerHTML = items.map(booking => {
      const editable = booking.status === 'pending';
      const cancellable = ['pending', 'confirmed'].includes(booking.status);
      return `
        <article class="booking-card">
          <div class="booking-card__header">
            <h2>${escapeHTML(booking.doctor)}</h2>
            <span class="booking-card__status booking-card__status--${escapeHTML(booking.status)}">${escapeHTML(booking.status)}</span>
          </div>
          <dl class="booking-card__details">
            <div><dt>Appointment</dt><dd>${escapeHTML(booking.date)} at ${escapeHTML(booking.time)}</dd></div>
            <div><dt>Department</dt><dd>${escapeHTML(booking.department)}</dd></div>
            <div><dt>Patient</dt><dd>${escapeHTML(booking.name)}</dd></div>
          </dl>
          ${editable ? `
            <form class="account__edit" data-edit-booking="${escapeHTML(booking.id)}">
              <div class="field"><label for="date-${escapeHTML(booking.id)}">Date</label><input id="date-${escapeHTML(booking.id)}" name="date" type="date" min="${new Date().toISOString().slice(0, 10)}" value="${escapeHTML(booking.date)}" required></div>
              <div class="field"><label for="time-${escapeHTML(booking.id)}">Time</label><select id="time-${escapeHTML(booking.id)}" name="time" required>
                ${timeSlots.map(time => `<option value="${time}"${time === booking.time ? ' selected' : ''}>${time}</option>`).join('')}
              </select></div>
              <div class="field"><label for="phone-${escapeHTML(booking.id)}">Phone</label><input id="phone-${escapeHTML(booking.id)}" name="phone" type="tel" value="${escapeHTML(booking.phone)}" required></div>
              <div class="field field--wide"><label for="reason-${escapeHTML(booking.id)}">Reason for visit</label><textarea id="reason-${escapeHTML(booking.id)}" name="reason" rows="2" maxlength="2000">${escapeHTML(booking.reason)}</textarea></div>
              <button class="btn" type="submit">Save changes</button>
            </form>` : ''}
          ${cancellable ? `<div class="account__actions"><button class="btn btn--ghost" type="button" data-cancel-booking="${escapeHTML(booking.id)}">Cancel appointment</button></div>` : ''}
        </article>`;
    }).join('');
  }

  function showDashboard() {
    authPanel.hidden = true;
    dashboard.hidden = false;
    document.querySelector('#account-welcome').textContent = `Signed in as ${user.name} (${user.email}).`;
    renderBookings();
  }

  function switchMode(mode) {
    const signup = mode === 'signup';
    signinForm.hidden = signup;
    signupForm.hidden = !signup;
    setMessage(message, '');
  }

  document.querySelector('#show-signin').addEventListener('click', () => switchMode('signin'));
  document.querySelector('#show-signup').addEventListener('click', () => switchMode('signup'));

  document.querySelectorAll('[data-toggle-password]').forEach(button => {
    button.addEventListener('click', () => {
      const input = document.getElementById(button.dataset.togglePassword);
      const reveal = input.type === 'password';
      input.type = reveal ? 'text' : 'password';
      button.textContent = reveal ? 'Hide' : 'Show';
      button.setAttribute('aria-label', `${reveal ? 'Hide' : 'Show'} password`);
      button.setAttribute('aria-pressed', String(reveal));
    });
  });

  signinForm.addEventListener('submit', async event => {
    event.preventDefault();
    if (!signinForm.reportValidity()) return;
    try {
      user = await DemoStore.signInPatient(signinForm.elements.email.value, signinForm.elements.password.value);
      if (validRedirect) return location.assign(redirect);
      showDashboard();
    } catch (error) {
      setMessage(message, error.message, 'error');
    }
  });

  signupForm.addEventListener('submit', async event => {
    event.preventDefault();
    if (!signupForm.reportValidity()) return;
    const name = signupForm.elements.name.value.trim();
    const email = signupForm.elements.email.value.trim();
    const password = signupForm.elements.password.value;
    if (name.length < 3 || password.length < 8 || password !== signupForm.elements.confirm.value) {
      setMessage(message, password !== signupForm.elements.confirm.value
        ? 'The passwords do not match.'
        : 'Enter your full name and a password of at least 8 characters.', 'error');
      return;
    }
    try {
      user = await DemoStore.createPatient(name, email, password);
      if (validRedirect) return location.assign(redirect);
      showDashboard();
    } catch (error) {
      setMessage(message, error.message, 'error');
    }
  });

  document.querySelector('#refresh-patient-bookings').addEventListener('click', renderBookings);
  DemoStore.onBookingsChange(() => {
    if (user && !dashboard.hidden) {
      renderBookings();
      setMessage(dashboardMessage, 'Your appointment list is up to date.', 'success');
    }
  });
  document.querySelector('#patient-sign-out').addEventListener('click', () => {
    try {
      DemoStore.signOut('patient');
      user = null;
      showAuth('You have signed out.');
    } catch (error) {
      setMessage(dashboardMessage, error.message, 'error');
    }
  });

  bookingList.addEventListener('submit', event => {
    const form = event.target.closest('[data-edit-booking]');
    if (!form) return;
    event.preventDefault();
    if (!form.reportValidity()) return;
    try {
      DemoStore.updatePatientBooking(form.dataset.editBooking, user.email, {
        action: 'edit',
        phone: form.elements.phone.value,
        date: form.elements.date.value,
        time: form.elements.time.value,
        reason: form.elements.reason.value
      });
      setMessage(dashboardMessage, 'Appointment updated.', 'success');
      renderBookings();
    } catch (error) {
      setMessage(dashboardMessage, error.message, 'error');
    }
  });

  bookingList.addEventListener('click', event => {
    const button = event.target.closest('[data-cancel-booking]');
    if (!button || !window.confirm('Cancel this appointment?')) return;
    try {
      DemoStore.updatePatientBooking(button.dataset.cancelBooking, user.email, { action: 'cancel' });
      setMessage(dashboardMessage, 'Appointment cancelled.', 'success');
      renderBookings();
    } catch (error) {
      setMessage(dashboardMessage, error.message, 'error');
    }
  });

  try {
    const current = DemoStore.session('patient');
    if (current) {
      user = current;
      if (validRedirect) location.assign(redirect);
      else showDashboard();
    } else {
      showAuth();
    }
  } catch (error) {
    showAuth(error.message);
  }
})();
