/* Team component (About page). Doctors are read from DEPARTMENTS in data.js,
   so adding a doctor there updates the booking form AND this page. */
const Team = {
  render() {
    const doctorImages = {
      'Dr. Delaiah Daniel': 'images/Dr Delaiah Daniel.jpg',
      'Dr. Faith Emmanuel': 'images/Dr Faith Emmanuel.jpg',
      'Dr. Isa Hosea': 'images/Dr isa.png',
      'Dr. Martina Markus': 'images/Dr Martina.jpg',
      'Dr. Silas James': 'images/Dr Silas.jpeg',
      'Dr. Seed Iliya': 'images/Seed.jpg'
    };
    const people = DEPARTMENTS.flatMap(d => d.doctors.map(name => ({
      name, dept: d.name, icon: d.icon, image: doctorImages[name]
    })));
    const initials = n => n.replace('Dr. ', '').split(' ').map(w => w[0]).join('');
    return `
    <section class="section team">
      <div class="container">
        <p class="eyebrow center">Meet the team</p>
        <h2 class="title center">Our Doctors</h2>
        <div class="team__grid">
          ${people.map(p => `
            <article class="doctor reveal">
              ${p.image
                ? `<img class="doctor__photo" src="${p.image}" alt="Photo of ${p.name}" width="96" height="96" loading="lazy">`
                : `<div class="doctor__avatar" aria-hidden="true">${initials(p.name)}</div>`}
              <h3>${p.name}</h3><p>${p.icon} ${p.dept}</p>
              <a href="appointment.html" class="doctor__link">Book a visit</a>
            </article>`).join('')}
        </div>
      </div>
    </section>`;
  }
};
