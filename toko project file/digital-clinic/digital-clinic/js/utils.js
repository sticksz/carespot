/* utils.js: small helpers shared by all components.
   Utils.observeReveal(root)  fades in .reveal elements as they scroll into view
                              and starts the number counters inside them. */
const Utils = (() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  function countUp(el) {
    const target = +el.dataset.count, step = Math.max(1, Math.ceil(target / 60));
    let n = 0;
    const t = setInterval(() => {
      n = Math.min(n + step, target);
      el.textContent = n.toLocaleString() + '+';
      if (n >= target) clearInterval(t);
    }, 25);
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('visible');
      $$('[data-count]', e.target).forEach(countUp);
      io.unobserve(e.target);
    });
  }, { threshold: .15 });

  const observeReveal = root => $$('.reveal', root).forEach(el => io.observe(el));
  return { $, $$, observeReveal };
})();
