/* FAQ accordion (health tips from HEALTH_TIPS in js/data.js).
   Only one panel is open at a time. Height is animated via max-height = scrollHeight. */
const FaqAccordion = {
  render() {
    return `<div class="accordion" id="accordion">
      ${HEALTH_TIPS.map(t => `
        <div class="acc-item"><button class="acc-head" type="button" aria-expanded="false">${t.q}</button>
        <div class="acc-body"><p>${t.a}</p></div></div>`).join('')}
    </div>`;
  },
  init(root) {
    const { $, $$ } = Utils;
    $('#accordion', root).addEventListener('click', e => {
      const head = e.target.closest('.acc-head'); if (!head) return;
      const item = head.parentElement, body = $('.acc-body', item), willOpen = !item.classList.contains('open');
      $$('.acc-item.open', root).forEach(i => {
        i.classList.remove('open'); $('.acc-body', i).style.maxHeight = 0; $('.acc-head', i).setAttribute('aria-expanded', false);
      });
      if (willOpen) { item.classList.add('open'); body.style.maxHeight = body.scrollHeight + 'px'; head.setAttribute('aria-expanded', true); }
    });
  }
};
