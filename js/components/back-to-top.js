/* Back-to-top button: appears after scrolling 500px, smooth-scrolls to the top. */
const BackToTop = {
  render() { return '<button class="to-top" id="to-top" aria-label="Back to top">↑</button>'; },
  init() {
    const btn = Utils.$('#to-top');
    window.addEventListener('scroll', () => btn.classList.toggle('show', window.scrollY > 500), { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
};
