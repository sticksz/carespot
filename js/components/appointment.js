/* Appointment section containing the patient account booking form. */
const Appointment = {
  render() {
    return `
    <section class="section appointment" id="appointment">
      <div class="container appt__grid">
        <div class="reveal">
          <p class="eyebrow">Appointments</p>
          <h2 class="title">Book your visit</h2>
          <p class="form-msg" id="appt-auth-msg" role="status" hidden></p>
          ${AppointmentForm.render()}
        </div>
      </div>
    </section>`;
  },
  init(root) { AppointmentForm.init(root); }
};
