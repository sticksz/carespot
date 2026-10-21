/* About component (About page): who the clinic is. Static markup. */
const About = {
  render() {
    return `
    <section class="section about" id="about">
      <div class="container about__grid">
        <div class="about__box reveal"><span>🩺</span><h3>10+ Years</h3><p>Of trusted community care</p></div>
        <div class="reveal">
          <p class="eyebrow">About us</p>
          <h2 class="title">A modern clinic built around you</h2>
          <p>CareSpot combines experienced doctors with simple digital tools. Book visits, get reminders and read reliable health advice without waiting in long queues.</p>
          <ul class="checklist">
            <li>Qualified and caring medical team</li>
            <li>Easy online scheduling</li>
            <li>Clean, safe and modern facilities</li>
          </ul>
        </div>
      </div>
    </section>`;
  }
};
