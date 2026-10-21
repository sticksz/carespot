/* health-info.html: health tips accordion and BMI calculator. */
Boot.run([
  Navbar,
  PageHeader.create({ title: 'Health Information', text: 'Simple, reliable advice to help you stay well every day.' }),
  HealthInfo, CtaBanner,
  Footer, BackToTop
]);
