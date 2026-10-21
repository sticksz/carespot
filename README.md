# CareSpot Digital Clinic

CareSpot is a front-end-only clinic website built with HTML, CSS, and vanilla JavaScript. It includes
patient account screens, appointment booking and management, and a doctor dashboard. Patient
accounts and appointments are stored in the current browser's local storage; no server or database
is contacted.

## Project layout

| Folder | Contents |
|---|---|
| `html/` | The seven site pages |
| `css/` | Global and component styles |
| `js/` | Page scripts, components, and browser-only storage |
| `images/` | Doctor portraits and hospital background |
| `vercel.json` | Rewrites the site URLs to pages in `html/` |

There is no backend, API, database, Supabase, Appwrite, or secrets configuration in this version.
Data is local to a browser/device and can be inspected, modified, or cleared by its user.

## Site flow

1. Open `/account.html` to create a patient account or sign in. Patient passwords are stored as
   salted PBKDF2 hashes and checked at sign-in.
2. Book an appointment at `/appointment.html`. Duplicate active doctor/time slots are rejected in
   the current browser.
3. Return to the patient portal to see booking status, edit pending bookings, or cancel eligible
   appointments.
4. Open `/admin.html`, choose a doctor, and enter the shared doctor password `Admin2026` to see
   that doctor's appointments and change their status.

This is browser-side functionality, not secure authentication or access control. The shared doctor
password is included in the site's JavaScript and can be viewed by visitors. Data is not shared
between different browsers, devices, or visitors. Do not enter real patient details or medical
information.

## Run locally

Open the running front-end preview at `http://127.0.0.1:3000/`. For another static host, configure
the same page rewrites listed in `vercel.json` so `/account.html` and other root URLs map into `html/`.
No API server or environment variables are needed.
# carespot
