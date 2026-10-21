/* boot.js: starts a page. Each page file (js/pages/*.js) calls Boot.run([...components]).
   For every component, in order: create a wrapper <div> inside #app, render() its HTML,
   then call init() once everything is in the DOM, then start the scroll-reveal animation.
   Because every page lists only the components it needs, no page loads code it never uses. */
const Boot = {
  run(components) {
    const app = document.getElementById('app');
    const mounts = components.map(c => {
      const el = document.createElement('div');
      el.innerHTML = c.render();
      app.append(el);
      return [c, el];
    });
    mounts.forEach(([c, el]) => c.init && c.init(el));
    Utils.observeReveal(document);
  }
};
