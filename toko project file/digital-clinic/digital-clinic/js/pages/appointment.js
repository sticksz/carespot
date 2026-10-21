/* appointment.html: booking form and the visitor's saved appointments. */
Boot.run([
  Navbar,
  PageHeader.create({ title: 'Book an Appointment', text: 'Choose a department, doctor and time that suits you.' }),
  Appointment,
  Footer, BackToTop
]);
