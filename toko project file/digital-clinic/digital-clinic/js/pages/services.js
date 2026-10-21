/* services.html: what we offer, plus the clinic's departments. */
Boot.run([
  Navbar,
  PageHeader.create({ title: 'Our Services', text: 'From emergency care to online consultations, everything under one roof.' }),
  Services, Departments, CtaBanner,
  Footer, BackToTop
]);
