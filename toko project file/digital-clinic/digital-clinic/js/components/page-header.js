/* PageHeader: the title banner at the top of every inner page.
   It is a factory, so each page creates its own: PageHeader.create({ title, text }).
   The page name also appears in the breadcrumb ("Home / Services"). */
const PageHeader = {
  create({ title, text }) {
    return {
      render: () => `
        <section class="page-header">
          <div class="container">
            <p class="crumb"><a href="index.html">Home</a> / <span>${title}</span></p>
            <h1>${title}</h1>
            <p>${text}</p>
          </div>
        </section>`
    };
  }
};
