/* Navbar component (shown on every page).
   render(): header markup. The link matching the current file name gets .active.
   init(): hamburger toggle (animates into an X via CSS), closes the menu after a link
   is tapped, and adds a shadow once the page is scrolled. */
const Navbar = {
  pages: [
    ['index.html', 'Home'], ['about.html', 'About'], ['services.html', 'Services'],
    ['health-info.html', 'Health Info']
  ],
  render() {
    const current = location.pathname.split('/').pop() || 'index.html';
    const links = this.pages.map(([href, label]) =>
      `<li><a href="${href}" class="nav__link${href === current ? ' active' : ''}">${label}</a></li>`).join('');
    return `
    <header class="header" id="header">
      <nav class="nav container">
        <a href="index.html" class="logo">Care<span>Spot</span></a>
        <ul class="nav__menu" id="nav-menu">
          ${links}
          <li><a href="account.html" class="nav__link${current === 'account.html' ? ' active' : ''}">My account</a></li>
          <li><a href="appointment.html" class="nav__link nav__cta">Book Now</a></li>
        </ul>
        <button class="nav__toggle" id="nav-toggle" aria-label="Toggle menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </nav>
    </header>`;
  },
  init() {
    const { $, $$ } = Utils;
    const toggle = $('#nav-toggle'), menu = $('#nav-menu'), header = $('#header');
    const setMenu = open => {
      menu.classList.toggle('open', open);
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open);
    };
    toggle.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
    $$('.nav__link').forEach(l => l.addEventListener('click', () => setMenu(false)));
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
};
