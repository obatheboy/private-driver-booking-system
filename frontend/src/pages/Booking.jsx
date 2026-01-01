import { useState } from "react";
import "../styles/booking.css";

/* =========================
   KENYA COUNTIES & AREAS
========================= */
/* =========================
   ALL 47 KENYAN COUNTIES
========================= */
const counties = {
  Nairobi: [
    "CBD", "Westlands", "Kilimani", "Kasarani", "Embakasi",
    "Lang'ata", "Roysambu", "Ruaka", "Karen", "South B"
  ],

  Kiambu: [
    "Thika", "Ruiru", "Juja", "Kiambu Town",
    "Githunguri", "Limuru", "Kabete", "Kikuyu"
  ],

  Mombasa: [
    "Nyali", "Kizingo", "Likoni", "Changamwe",
    "Bamburi", "Mtwapa", "Tudor"
  ],

  Nakuru: [
    "Nakuru Town", "Naivasha", "Gilgil",
    "Molo", "Bahati", "Njoro"
  ],

  Kisumu: [
    "Kisumu CBD", "Milimani", "Nyalenda",
    "Manyatta", "Nyamasaria"
  ],

  UasinGishu: [
    "Eldoret Town", "Kapseret", "Turbo",
    "Moiben", "Burnt Forest"
  ],

  Machakos: [
    "Machakos Town", "Athi River",
    "Mlolongo", "Syokimau", "Kangundo"
  ],

  Kajiado: [
    "Kajiado Town", "Ongata Rongai",
    "Kitengela", "Ngong", "Isinya"
  ],

  Meru: [
    "Meru Town", "Nkubu",
    "Maua", "Timau"
  ],

  Nyeri: [
    "Nyeri Town", "Karatina",
    "Othaya", "Mathira"
  ],

  Muranga: [
    "Murang'a Town", "Kangema",
    "Kiharu", "Kigumo"
  ],

  Kirinyaga: [
    "Kerugoya", "Kutus",
    "Sagana", "Wang'uru"
  ],

  Embu: [
    "Embu Town", "Runyenjes",
    "Manyatta", "Siakago"
  ],

  Laikipia: [
    "Nanyuki", "Nyahururu",
    "Rumuruti"
  ],

  Nyandarua: [
    "Ol Kalou", "Engineer",
    "Njabini", "Kinangop"
  ],

  Bomet: [
    "Bomet Town", "Sotik",
    "Longisa"
  ],

  Kericho: [
    "Kericho Town", "Litein",
    "Ainamoi"
  ],

  Narok: [
    "Narok Town", "Mai Mahiu",
    "Suswa"
  ],

  TransNzoia: [
    "Kitale Town", "Endebess",
    "Kiminini"
  ],

  Bungoma: [
    "Bungoma Town", "Webuye",
    "Kimilili"
  ],

  Kakamega: [
    "Kakamega Town", "Lurambi",
    "Mumias", "Malava"
  ],

  Vihiga: [
    "Mbale", "Luanda",
    "Chavakali"
  ],

  Busia: [
    "Busia Town", "Malaba",
    "Nambale"
  ],

  Siaya: [
    "Siaya Town", "Bondo",
    "Ugunja"
  ],

  HomaBay: [
    "Homa Bay Town", "Mbita",
    "Oyugis"
  ],

  Migori: [
    "Migori Town", "Awendo",
    "Rongo"
  ],

  Kisii: [
    "Kisii Town", "Suneka",
    "Ogembo"
  ],

  Nyamira: [
    "Nyamira Town", "Keroka"
  ],

  Turkana: [
    "Lodwar", "Lokichoggio",
    "Kakuma"
  ],

  WestPokot: [
    "Kapenguria", "Makutano"
  ],

  Samburu: [
    "Maralal", "Baragoi"
  ],

  Marsabit: [
    "Marsabit Town", "Moyale"
  ],

  Isiolo: [
    "Isiolo Town", "Garbatulla"
  ],

  Mandera: [
    "Mandera Town", "Elwak"
  ],

  Wajir: [
    "Wajir Town", "Buna"
  ],

  Garissa: [
    "Garissa Town", "Dadaab"
  ],

  TanaRiver: [
    "Hola", "Garsen"
  ],

  Lamu: [
    "Lamu Town", "Mpeketoni"
  ],

  Kilifi: [
    "Kilifi Town", "Malindi",
    "Watamu"
  ],

  Kwale: [
    "Ukunda", "Msambweni"
  ],

  TaitaTaveta: [
    "Voi", "Wundanyi", "Taveta"
  ],

  ElgeyoMarakwet: [
    "Iten", "Kapsowar"
  ],

  Nandi: [
    "Kapsabet", "Nandi Hills"
  ],

  TharakaNithi: [
    "Chuka", "Kathwana"
  ],

  Makueni: [
    "Wote", "Mtito Andei",
    "Makindu"
  ]
};


function Booking() {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    pickupCounty: "",
    pickupArea: "",
    pickupLandmark: "",
    destinationCounty: "",
    destinationArea: "",
    passengers: "1",
    date: "",
    hour: "7",
    minute: "00",
    period: "AM",
  });

  const [loading, setLoading] = useState(false);

  // Trip history
  const [historyPhone, setHistoryPhone] = useState("");
  const [trips, setTrips] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "pickupCounty") {
      setForm(p => ({
        ...p,
        pickupCounty: value,
        pickupArea: counties[value]?.[0] || ""
      }));
      return;
    }

    if (name === "destinationCounty") {
      setForm(p => ({
        ...p,
        destinationCounty: value,
        destinationArea: counties[value]?.[0] || ""
      }));
      return;
    }

    setForm(p => ({ ...p, [name]: value }));
  };

  const canSubmit =
    form.fullName &&
    form.phone &&
    form.pickupCounty &&
    form.pickupArea &&
    form.destinationCounty &&
    form.destinationArea &&
    form.date;

  const handleSubmit = async () => {
    if (!canSubmit || loading) return;
    if (!window.confirm("Confirm booking details?")) return;

    setLoading(true);
    try {
     const res = await fetch(
  `${import.meta.env.VITE_API_URL}/api/bookings`,
  {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          passengers: Number(form.passengers),
          pickupTime: `${form.hour}:${form.minute} ${form.period}`,
          status: "PENDING",
        }),
      });

      if (!res.ok) throw new Error();
      alert("✅ Booking sent successfully!");
    } catch {
      alert("❌ Failed to send booking");
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    if (!historyPhone) return;

    setHistoryLoading(true);
    setTrips([]);

    try {
    const res = await fetch(
  `${import.meta.env.VITE_API_URL}/api/bookings/by-phone/${historyPhone}`
);

      const data = await res.json();
      setTrips(data);
    } catch {
      alert("Failed to fetch trip history");
    } finally {
      setHistoryLoading(false);
    }
  };

  return (
    <div className="booking-page">
      <div className="booking-card">
        <h2>Book a Private Driver</h2>

        {/* PERSONAL */}
        <section>
          <h3>Personal Information</h3>
          <input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} />
          <input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} />
        </section>

        {/* PICKUP */}
        <section>
          <h3>Pickup Location</h3>
          <select name="pickupCounty" value={form.pickupCounty} onChange={handleChange}>
            <option value="">Select Pickup County</option>
            {Object.keys(counties).map(c => <option key={c}>{c}</option>)}
          </select>

          <select name="pickupArea" value={form.pickupArea} onChange={handleChange} disabled={!form.pickupCounty}>
            <option value="">Select Pickup Area</option>
            {form.pickupCounty && counties[form.pickupCounty].map(a => <option key={a}>{a}</option>)}
          </select>

          <input name="pickupLandmark" placeholder="Nearby Landmark (Optional)" value={form.pickupLandmark} onChange={handleChange} />
        </section>

        {/* DESTINATION */}
        <section>
          <h3>Destination</h3>
          <select name="destinationCounty" value={form.destinationCounty} onChange={handleChange}>
            <option value="">Select Destination County</option>
            {Object.keys(counties).map(c => <option key={c}>{c}</option>)}
          </select>

          <select name="destinationArea" value={form.destinationArea} onChange={handleChange} disabled={!form.destinationCounty}>
            <option value="">Select Destination Area</option>
            {form.destinationCounty && counties[form.destinationCounty].map(a => <option key={a}>{a}</option>)}
          </select>
        </section>

             {/* TRIP */}
        <section>
          <h3>Trip Details</h3>

          <label>Number of Passengers</label>
          <select name="passengers" value={form.passengers} onChange={handleChange}>
            {[1, 2, 3, 4, 5].map(n => <option key={n}>{n}</option>)}
          </select>

          <label>Pickup Date</label>
          <input type="date" name="date" value={form.date} onChange={handleChange} />

          <label>Pickup Time</label>
          <div className="time-row">
            <select name="hour" value={form.hour} onChange={handleChange}>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(h => <option key={h}>{h}</option>)}
            </select>
            <select name="minute" value={form.minute} onChange={handleChange}>
              {["00","15","30","45"].map(m => <option key={m}>{m}</option>)}
            </select>
            <select name="period" value={form.period} onChange={handleChange}>
              <option>AM</option>
              <option>PM</option>
            </select>
          </div>
        </section>

        <button disabled={!canSubmit || loading} onClick={handleSubmit}>
          {loading ? "SENDING..." : "BOOK NOW"}
        </button>

        {/* TRIP HISTORY */}
        <div className="trip-history-box">
          <h3>Check Trip History</h3>

          <input
            placeholder="Enter phone number"
            value={historyPhone}
            onChange={(e) => setHistoryPhone(e.target.value)}
          />

          <button onClick={fetchHistory} disabled={historyLoading}>
            {historyLoading ? "Checking..." : "View Trips"}
          </button>

          <div className="trip-history-list">
            {trips.map(t => (
              <div key={t.id} className="trip-card">
                <strong>{t.pickupArea}</strong> → <strong>{t.destinationArea}</strong>
                <p>{t.status}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Booking;