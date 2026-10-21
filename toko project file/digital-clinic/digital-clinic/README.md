# CareSpot Digital Clinic

Responsive clinic website in plain HTML, CSS and JavaScript, with a Vercel serverless function for
booking email notifications. No database is required. Deploy the `digital-clinic` folder to Vercel.

## Pages (5)
| Page | File | Components it loads |
|---|---|---|
| Home | `index.html` | Navbar, Home, CtaBanner, Footer |
| About | `about.html` | PageHeader, About, Team, CtaBanner |
| Services | `services.html` | PageHeader, Services, Departments, CtaBanner |
| Health Info | `health-info.html` | PageHeader, HealthInfo (FaqAccordion + BmiCalculator), CtaBanner |
| Book Appointment | `appointment.html` | PageHeader, Appointment (AppointmentForm + AppointmentList) |

Each page has three parts: the HTML file (which only links the CSS/JS it needs), a page script in
`js/pages/` (which lists its components in order) and the components themselves.

## How it is organised
Every component has its **own JS file** (markup + behaviour) and its **own CSS file** (look).

```
*.html                         5 pages: links to the css/js they need + an empty <div id="app">
css/
  base.css                     variables (--primary...), reset, layout helpers
  reveal.css  form-controls.css
  components/                  one CSS file per component (button, card, navbar, home, about, team,
                               services, departments, health-info, faq-accordion, bmi-calculator,
                               appointment, appointment-form, appointment-list, page-header,
                               cta-banner, footer, back-to-top)
js/
  data.js                      editable content: departments, doctors, time slots, health tips
  utils.js                     $ / $$ helpers, reveal observer, number counters
  boot.js                      Boot.run([...]) renders a page's components in order
  pages/                       one tiny file per page: its component list
  services/appointment-store.js  the only code that saves/loads appointments
  components/                  one JS file per component (same names as the CSS files)
```

## Components
| Component | What it does |
|---|---|
| Navbar | Links to the pages, highlights the current page, animated hamburger and mobile menu |
| PageHeader | Title banner + breadcrumb for inner pages (`PageHeader.create({title,text})`) |
| Home | Hero text, buttons, animated stat counters |
| About | Intro box and checklist |
| Team | Doctor cards generated from `DEPARTMENTS`; named portraits live in `images/` |
| Services / Departments | Cards from `SERVICES` / `DEPARTMENTS`; "Book" opens `appointment.html?dept=<id>` |
| HealthInfo | Layout combining FaqAccordion (health tips) and BmiCalculator |
| Appointment | Layout combining AppointmentForm (validation, dependent doctor list, double-booking check) and AppointmentList (view/cancel) |
| CtaBanner | "Ready to see a doctor?" strip linking to the booking page |
| Footer / BackToTop | Shared on every page |

## Sending bookings to doctors by email
Bookings are posted to `api/send-appointment.js`, which chooses the Web3Forms access key for the selected
doctor on the server. Doctor email addresses and access keys are not sent to or included in browser code.
No database or Supabase setup is needed.

1. Create a Web3Forms access key for each doctor's inbox.
2. In Vercel, open the project's **Settings → Environment Variables** and add the six variables listed
   in `.env.example`, each with the access key registered to that doctor's email. Keep them server-only;
   do not prefix them with `NEXT_PUBLIC_` or `VITE_`.
3. Redeploy the project after setting the variables, then submit a test booking for each doctor.

For local development, use `vercel dev` with the Vercel CLI and set these variables in an ignored
`.env.local` file. Never commit `.env.local` or real access keys. The booking is saved in the browser
before notification is attempted; missing keys or delivery failures are reported to the patient.
Appointment details pass through Web3Forms, so mention this in your privacy notice.

The root of the Vercel project must be this `digital-clinic` folder, where the static pages and `api/`
directory are located. Opening `index.html` directly does not run the serverless email endpoint.

## Design decisions
- **Components render themselves.** Each exposes `render()` (returns HTML) and optionally `init()` (adds behaviour).
  `boot.js` calls them in the order a page lists them. This works from `file://`, unlike fetching HTML partials, which browsers block.
- **Pages and components share data through the URL and events, not each other's DOM.** `?dept=` carries the
  chosen department from Services to the booking page; `appointments:changed` (Store to List) refreshes the list. You can remove or replace a component without breaking the others.
- **Content is data.** Add a doctor or tip in `data.js`; the UI updates without HTML edits.
- **Doctor portraits.** Add portrait files to `images/` and map each exact doctor name to its image in `js/components/team.js`. Doctors without a mapped portrait keep their initials avatar.
- **One storage gateway.** `appointment-store.js` uses localStorage today. For a real clinic, swap `load()`/`save()`
  for API calls (e.g. Supabase); no component changes.
- **Safe rendering.** User-typed text is inserted with `textContent`, never raw HTML.
- **Accessibility.** `aria-expanded` on the toggle and accordion, labelled inputs, reduced-motion support.
- **Theming.** Change `--primary` in `base.css` (e.g. to NAUB colours) to rebrand everything.

## Adding a component or page
1. Create `js/components/x.js` (`const X = { render(){...}, init(){...} }`) and `css/components/x.css`.
2. Link both from the page(s) that use it and add `X` to that page's list in `js/pages/<page>.js`.
3. New page: copy an existing `.html`, change the links and create its `js/pages/` file; add it to `Navbar.pages`.

Footer contact details and the "CareSpot" name are placeholders. Open `index.html` directly, or run
`python3 -m http.server` in this folder if your browser restricts local files.
