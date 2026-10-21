/* about.html: navbar, title banner, who we are, the doctors, call-to-action, footer. */
Boot.run([
  Navbar,
  PageHeader.create({ title: 'About Us', text: 'Learn who we are and meet the people who will look after you.' }),
  About, Team, CtaBanner,
  Footer, BackToTop
]);
