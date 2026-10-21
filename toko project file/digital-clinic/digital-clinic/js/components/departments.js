/* Departments component (Services page). Cards are generated from DEPARTMENTS (js/data.js).
   Each "Book" button opens appointment.html?dept=<id>; AppointmentForm reads that query
   parameter and pre-selects the department. A URL is the simplest way to pass data
   between two separate pages. */
const Departments = {
  render() {
    return `
    <section class="section departments" id="departments">
      <div class="container">
        <p class="eyebrow center">Specialties</p>
        <h2 class="title center">Our Departments</h2>
        <div class="cards">
          ${DEPARTMENTS.map(d => `
            <article class="card reveal"><span>${d.icon}</span><h3>${d.name}</h3><p>${d.desc}</p>
            <a href="appointment.html?dept=${d.id}" class="btn">Book</a></article>`).join('')}
        </div>
      </div>
    </section>`;
  }
};
