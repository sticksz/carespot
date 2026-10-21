/* CtaBanner: "call to action" strip shown near the bottom of most pages,
   pushing visitors toward the booking page. */
const CtaBanner = {
  render() {
    return `
    <section class="cta">
      <div class="container cta__box reveal">
        <div><h2>Ready to see a doctor?</h2><p>Pick a department, choose a time and you are booked in under two minutes.</p></div>
        <a href="appointment.html" class="btn btn--light">Book Appointment</a>
      </div>
    </section>`;
  }
};
