/* Health Info section: a layout that composes two smaller components,
   FaqAccordion and BmiCalculator. Each child keeps its own markup and behaviour. */
const HealthInfo = {
  render() {
    return `
    <section class="section info" id="health-info">
      <div class="container info__grid">
        <div class="reveal">
          <p class="eyebrow">Daily wellness</p>
          <h2 class="title">Stay informed, stay well</h2>
          ${FaqAccordion.render()}
        </div>
        ${BmiCalculator.render()}
      </div>
    </section>`;
  },
  init(root) { FaqAccordion.init(root); BmiCalculator.init(root); }
};
