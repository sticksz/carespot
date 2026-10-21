/* Appointment section: layout that composes AppointmentForm and AppointmentList. */
const Appointment = {
  render() {
    return `
    <section class="section appointment" id="appointment">
      <div class="container appt__grid">
        <div class="reveal">
          <p class="eyebrow">Appointments</p>
          <h2 class="title">Book your visit</h2>
          ${AppointmentForm.render()}
        </div>
        ${AppointmentList.render()}
      </div>
    </section>`;
  },
  init(root) { AppointmentForm.init(root); AppointmentList.init(root); }
};
