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

  app.innerHTML = `
    <header class="header">
      <nav class="nav container">
        <a href="index.html" class="logo">Care<span>Spot</span></a>
        <a href="appointment.html" class="nav__link">Book an appointment</a>
        <a href="account.html" class="nav__link">Patient portal</a>
      </nav>
    </header>
    <main class="admin container">
      <section class="admin__panel">
        <p class="eyebrow">Doctor access</p>
        <h1 class="title">Doctor Dashboard</h1>
        <p id="admin-message" class="admin__message" role="status" aria-live="polite"></p>
        <form id="login-form" class="admin__login">
          <div class="field">
            <label for="doctor-name">Doctor</label>
            <select id="doctor-name" name="doctor" required>
              <option value="">Choose a doctor</option>
              ${doctors.map(name => `<option value="${name}">${name}</option>`).join('')}
            </select>
          </div>
          <div class="field">
            <label for="doctor-password">Password</label>
            <input id="doctor-password" name="password" type="password" autocomplete="off" required>
          </div>
          <button class="btn" type="submit">Sign in</button>
        </form>
        <section id="dashboard" class="admin__dashboard" hidden>
          <div class="admin__toolbar">
            <p id="welcome"></p>
            <button id="refresh-bookings" class="btn btn--ghost" type="button">Refresh</button>
            <button id="sign-out" class="btn btn--ghost" type="button">Sign out</button>
          </div>
          <h2 class="title">Booking requests</h2>
          <div id="bookings" class="admin__bookings" aria-live="polite"></div>
        </section>
      </section>
    </main>
    <footer class="footer">
      <p class="footer__copy">&copy; ${new Date().getFullYear()} CareSpot Digital Clinic</p>
    </footer>`;

  const form = document.querySelector('#login-form');
  const dashboard = document.querySelector('#dashboard');
  const message = document.querySelector('#admin-message');
  const bookings = document.querySelector('#bookings');
  let doctor = null;

  function setMessage(text, kind = '') {
    message.textContent = text;
    message.className = `admin__message${kind ? ` admin__message--${kind}` : ''}`;
  }

  function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[char]);
  }

  function renderBookings() {
    const items = DemoStore.doctorBookings(doctor);
    if (!items.length) {
      bookings.innerHTML = '<p class="admin__empty">There are no booking requests for this doctor.</p>';
      return;
    }
    bookings.innerHTML = items.map(booking => `
      <article class="booking-card">
        <div class="booking-card__header">
          <h3>${escapeHTML(booking.name)}</h3>
          <span class="booking-card__status booking-card__status--${escapeHTML(booking.status)}">${escapeHTML(booking.status)}</span>
        </div>
        <dl class="booking-card__details">
          <div><dt>Appointment</dt><dd>${escapeHTML(booking.date)} at ${escapeHTML(booking.time)}</dd></div>
          <div><dt>Department</dt><dd>${escapeHTML(booking.department)}</dd></div>
          <div><dt>Phone</dt><dd><a href="tel:${escapeHTML(booking.phone)}">${escapeHTML(booking.phone)}</a></dd></div>
          <div><dt>Email</dt><dd><a href="mailto:${escapeHTML(booking.email)}">${escapeHTML(booking.email)}</a></dd></div>
          <div class="booking-card__reason"><dt>Reason</dt><dd>${escapeHTML(booking.reason || 'Not provided')}</dd></div>
        </dl>
        <label for="status-${escapeHTML(booking.id)}">Update status</label>
        <select id="status-${escapeHTML(booking.id)}" data-booking-id="${escapeHTML(booking.id)}" class="booking-card__status-select">
          ${['pending', 'confirmed', 'completed', 'cancelled'].map(status =>
            `<option value="${status}"${booking.status === status ? ' selected' : ''}>${status[0].toUpperCase()}${status.slice(1)}</option>`
          ).join('')}
        </select>
      </article>`).join('');
  }

  function showDashboard() {
    form.hidden = true;
    dashboard.hidden = false;
    document.querySelector('#welcome').textContent = `Signed in as ${doctor}.`;
    renderBookings();
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    try {
      doctor = form.elements.doctor.value;
      DemoStore.signInDoctor(doctor, form.elements.password.value);
      setMessage('');
      showDashboard();
    } catch (error) {
      setMessage(error.message, 'error');
    }
  });

  document.querySelector('#refresh-bookings').addEventListener('click', renderBookings);
  document.querySelector('#sign-out').addEventListener('click', () => {
    try {
      DemoStore.signOut('doctor');
      doctor = null;
      dashboard.hidden = true;
      form.hidden = false;
      form.reset();
      bookings.innerHTML = '';
      setMessage('You have signed out.');
    } catch (error) {
      setMessage(error.message, 'error');
    }
  });

  bookings.addEventListener('change', event => {
    const select = event.target.closest('[data-booking-id]');
    if (!select) return;
    try {
      DemoStore.updateDoctorBooking(select.dataset.bookingId, doctor, select.value);
      setMessage('Booking status updated.', 'success');
      renderBookings();
    } catch (error) {
      setMessage(error.message, 'error');
      renderBookings();
    }
  });

  try {
    const current = DemoStore.session('doctor');
    if (current && doctors.includes(current.name)) {
      doctor = current.name;
      showDashboard();
    }
  } catch (error) {
    setMessage(error.message, 'error');
  }
})();
