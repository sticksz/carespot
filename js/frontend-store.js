/* Browser-side account and appointment state. */
const DemoStore = (() => {
  const ACCOUNTS_KEY = 'carespot-demo-accounts';
  const BOOKINGS_KEY = 'carespot-demo-bookings';
  const SESSION_KEY = 'carespot-demo-session';
  const DOCTOR_PASSWORD = 'Admin2026';

  function read(storage, key, fallback) {
    try {
      const value = storage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (error) {
      throw new Error(`Could not read saved account data: ${error.message}`);
    }
  }

  function write(storage, key, value) {
    try {
      storage.setItem(key, JSON.stringify(value));
    } catch (error) {
      throw new Error(`Could not save account data: ${error.message}`);
    }
  }

  function accounts() {
    return read(localStorage, ACCOUNTS_KEY, []);
  }

  function bookings() {
    return read(localStorage, BOOKINGS_KEY, []);
  }

  function session(type) {
    const key = type ? `${SESSION_KEY}-${type}` : SESSION_KEY;
    return read(sessionStorage, key, null);
  }

  function startSession(value) {
    write(sessionStorage, `${SESSION_KEY}-${value.type}`, value);
    return value;
  }

  function bytesToBase64(bytes) {
    return btoa(Array.from(bytes, byte => String.fromCharCode(byte)).join(''));
  }

  function base64ToBytes(value) {
    return Uint8Array.from(atob(value), char => char.charCodeAt(0));
  }

  async function passwordRecord(password) {
    if (!globalThis.crypto?.subtle || !globalThis.crypto?.getRandomValues) {
      throw new Error('Password hashing is unavailable in this browser. Use localhost or HTTPS.');
    }
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits({
      name: 'PBKDF2',
      salt,
      iterations: 150000,
      hash: 'SHA-256'
    }, keyMaterial, 256);
    return { salt: bytesToBase64(salt), hash: bytesToBase64(new Uint8Array(bits)) };
  }

  async function verifyPassword(password, record) {
    const expected = base64ToBytes(record.hash);
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits({
      name: 'PBKDF2',
      salt: base64ToBytes(record.salt),
      iterations: 150000,
      hash: 'SHA-256'
    }, keyMaterial, 256);
    const actual = new Uint8Array(bits);
    return actual.length === expected.length && actual.every((byte, index) => byte === expected[index]);
  }

  async function createPatient(name, email, password) {
    const normalizedEmail = email.trim().toLowerCase();
    const list = accounts();
    const existingIndex = list.findIndex(account => account.email === normalizedEmail);
    if (existingIndex >= 0 && list[existingIndex].hash) {
      throw new Error('An account with this email already exists. Sign in instead.');
    }
    const credentials = await passwordRecord(password);
    const patient = { type: 'patient', name: name.trim(), email: normalizedEmail, ...credentials };
    if (existingIndex >= 0) list[existingIndex] = patient;
    else list.push(patient);
    write(localStorage, ACCOUNTS_KEY, list);
    return startSession({ type: 'patient', name: patient.name, email: patient.email });
  }

  async function signInPatient(email, password) {
    const normalizedEmail = email.trim().toLowerCase();
    const patient = accounts().find(account => account.email === normalizedEmail);
    if (!patient) throw new Error('No account found for this email. Create an account first.');
    if (!patient.hash || !await verifyPassword(password, patient)) {
      throw new Error('The email or password is incorrect.');
    }
    return startSession({ type: 'patient', name: patient.name, email: patient.email });
  }

  function signInDoctor(name, password) {
    if (typeof name !== 'string' || !name.trim()) throw new Error('Choose a doctor account.');
    if (password !== DOCTOR_PASSWORD) throw new Error('The doctor password is incorrect.');
    return startSession({ type: 'doctor', name: name.trim() });
  }

  function signOut(type) {
    try {
      sessionStorage.removeItem(`${SESSION_KEY}-${type}`);
    } catch (error) {
      throw new Error(`Could not sign out: ${error.message}`);
    }
  }

  function patientBookings(email) {
    const normalizedEmail = email.trim().toLowerCase();
    return bookings()
      .filter(booking => booking.email === normalizedEmail)
      .sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));
  }

  function doctorBookings(name) {
    return bookings()
      .filter(booking => booking.doctor === name)
      .sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));
  }

  function createBooking(patient, details) {
    const list = bookings();
    const alreadyBooked = list.some(booking =>
      booking.doctor === details.doctor &&
      booking.date === details.date &&
      booking.time === details.time &&
      booking.status !== 'cancelled'
    );
    if (alreadyBooked) throw new Error('That doctor and time is already booked. Please choose another time.');

    const booking = {
      id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: patient.name,
      email: patient.email,
      phone: details.phone,
      department: details.department,
      doctor: details.doctor,
      date: details.date,
      time: details.time,
      reason: details.reason,
      status: 'pending'
    };
    list.push(booking);
    write(localStorage, BOOKINGS_KEY, list);
    notifyBookingsChanged();
    return booking;
  }

  function updatePatientBooking(id, email, changes) {
    const list = bookings();
    const booking = list.find(item => item.id === id && item.email === email.trim().toLowerCase());
    if (!booking) throw new Error('Appointment not found for this patient.');
    if (!['pending', 'confirmed'].includes(booking.status)) {
      throw new Error('This appointment can no longer be changed.');
    }
    if (changes.action === 'cancel') {
      booking.status = 'cancelled';
    } else {
      if (booking.status !== 'pending') throw new Error('Only pending appointments can be edited.');
      const conflict = list.some(item =>
        item.id !== id && item.doctor === booking.doctor && item.date === changes.date &&
        item.time === changes.time && item.status !== 'cancelled'
      );
      if (conflict) throw new Error('That doctor and time is already booked.');
      Object.assign(booking, {
        phone: changes.phone.trim(),
        date: changes.date,
        time: changes.time,
        reason: changes.reason.trim()
      });
    }
    write(localStorage, BOOKINGS_KEY, list);
    notifyBookingsChanged();
    return booking;
  }

  function updateDoctorBooking(id, doctorName, status) {
    const list = bookings();
    const booking = list.find(item => item.id === id && item.doctor === doctorName);
    if (!booking) throw new Error('Appointment not found for this doctor.');
    booking.status = status;
    write(localStorage, BOOKINGS_KEY, list);
    notifyBookingsChanged();
    return booking;
  }

  function notifyBookingsChanged() {
    window.dispatchEvent(new Event('carespot:bookings-changed'));
  }

  function onBookingsChange(callback) {
    const handleStorage = event => {
      if (event.key === BOOKINGS_KEY) callback();
    };
    window.addEventListener('carespot:bookings-changed', callback);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('carespot:bookings-changed', callback);
      window.removeEventListener('storage', handleStorage);
    };
  }

  return {
    bookingStorageKey: BOOKINGS_KEY,
    createBooking,
    createPatient,
    doctorBookings,
    patientBookings,
    session,
    signInDoctor,
    signInPatient,
    signOut,
    onBookingsChange,
    updateDoctorBooking,
    updatePatientBooking
  };
})();
