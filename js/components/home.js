/* Home (hero) component, used on index.html. Static markup; the stat numbers count up when revealed
   (handled by Utils.observeReveal through the data-count attributes). */
const Home = {
  render() {
    return `
    <section class="home" id="home">
      <div class="container home__grid">
        <div class="home__data reveal">
          <p class="eyebrow">Your health, our priority</p>
          <h1>Quality care, <br>booked in <span>minutes</span></h1>
          <p>Schedule appointments with trusted doctors online and learn how to look after your health, all in one place.</p>
          <div class="home__buttons">
            <a href="appointment.html" class="btn">Book Appointment</a>
            <a href="health-info.html" class="btn btn--ghost">Health Tips</a>
          </div>
          <ul class="stats">
            <li><strong data-count="6">0</strong><span>Specialists</span></li>
            <li><strong data-count="5000">0</strong><span>Patients</span></li>
            <li><strong data-count="10">0</strong><span>Years</span></li>
          </ul>
        </div>
        <div class="home__visual reveal" aria-hidden="true">
          <div class="pulse-card">
            <svg viewBox="0 0 200 200"><circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" stroke-width="2" opacity=".25"/><path d="M85 55h30v30h30v30h-30v30H85v-30H55V85h30z" fill="currentColor"/></svg>
          </div>
        </div>
      </div>
    </section>`;
  }
};
