const DOCTORS = {
  'Dr. Silas James': 'WEB3FORMS_KEY_DR_SILAS_JAMES',
  'Dr. Isa Hosea': 'WEB3FORMS_KEY_DR_ISA_HOSEA',
  'Dr. Faith Emmanuel': 'WEB3FORMS_KEY_DR_FAITH_EMMANUEL',
  'Dr. Seed Iliya': 'WEB3FORMS_KEY_DR_SEED_ILIYA',
  'Dr. Delaiah Daniel': 'WEB3FORMS_KEY_DR_DELAIAH_DANIEL',
  'Dr. Martina Markus': 'WEB3FORMS_KEY_DR_MARTINA_MARKUS'
};

const TIME_SLOTS = new Set(['08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00']);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[+\d][\d\s-]{6,17}$/;

function isValidDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

function text(value, maxLength) {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= maxLength;
}

function prettyDate(isoDate) {
  return new Date(`${isoDate}T00:00:00Z`)
    .toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC'
    });
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  }

  const appointment = req.body;
  if (!appointment || typeof appointment !== 'object' || Array.isArray(appointment)) {
    return res.status(400).json({ success: false, message: 'Invalid booking details.' });
  }

  const { name, phone, email, deptName, doctor, date, time, reason } = appointment;
  if (
    !text(name, 120) ||
    !text(phone, 24) || !PHONE_PATTERN.test(phone) ||
    !text(email, 254) || !EMAIL_PATTERN.test(email) ||
    !text(deptName, 100) ||
    !Object.hasOwn(DOCTORS, doctor) ||
    !isValidDate(date) ||
    !TIME_SLOTS.has(time) ||
    (reason != null && (typeof reason !== 'string' || reason.length > 2000))
  ) {
    return res.status(400).json({ success: false, message: 'Invalid booking details.' });
  }

  const accessKey = process.env[DOCTORS[doctor]];
  if (!accessKey) {
    return res.status(503).json({
      success: false,
      code: 'not-configured',
      message: 'Email notification is not configured.'
    });
  }

  const formattedDate = prettyDate(date);
  const payload = {
    access_key: accessKey,
    subject: `New appointment: ${name}, ${formattedDate} at ${time}`,
    from_name: 'CareSpot Digital Clinic',
    replyto: email,
    'Patient name': name,
    Phone: phone,
    Email: email,
    Department: deptName,
    Doctor: doctor,
    Date: formattedDate,
    Time: time,
    'Reason for visit': reason?.trim() || 'Not given'
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      return res.status(502).json({ success: false, message: 'Email notification could not be sent.' });
    }
    return res.status(200).json({ success: true });
  } catch {
    return res.status(502).json({ success: false, message: 'Email notification could not be sent.' });
  } finally {
    clearTimeout(timeout);
  }
};
