/* Footer component. Contact details are placeholders: replace with the real clinic's. */
const Footer = {
  render() {
    return `
    <footer class="footer">
      <div class="container footer__grid">
        <div><a href="index.html" class="logo">Care<span>Spot</span></a><p>Compassionate, convenient healthcare.</p></div>
        <div><h4>Quick links</h4><a href="about.html">About</a><a href="services.html">Services</a><a href="health-info.html">Health Info</a><a href="appointment.html">Book</a></div>
        <div><h4>Contact</h4><p>📍 Biu, Borno State</p><p>📞 +234 000 000 0000</p><p>✉️ care@carespot.example</p></div>
        <div><h4>Hours</h4><p>Mon–Fri: 8am – 6pm</p><p>Sat: 9am – 2pm</p><p>Emergency: 24/7</p></div>
      </div>
      <p class="footer__copy">&copy; ${new Date().getFullYear()} CareSpot Digital Clinic. For emergencies, visit the nearest hospital.</p>
    </footer>`;
  }
};
