/* Services component. Cards come from the SERVICES list below (edit it to add services). */
const SERVICES = [
  { icon: '🚑', title: 'Emergency Care', text: 'Fast response for urgent medical needs, day and night.' },
  { icon: '💊', title: 'Pharmacy', text: 'Prescription and over-the-counter medicines in-house.' },
  { icon: '🔬', title: 'Laboratory', text: 'Accurate diagnostic tests with quick results.' },
  { icon: '💻', title: 'Online Consultation', text: 'Speak to a doctor from the comfort of your home.' }
];
const Services = {
  render() {
    return `
    <section class="section services" id="services">
      <div class="container">
        <p class="eyebrow center">What we offer</p>
        <h2 class="title center">Care for every need</h2>
        <div class="cards">
          ${SERVICES.map(s => `<article class="card reveal"><span>${s.icon}</span><h3>${s.title}</h3><p>${s.text}</p></article>`).join('')}
        </div>
      </div>
    </section>`;
  }
};
