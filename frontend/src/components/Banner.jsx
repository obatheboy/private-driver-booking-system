


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/banner.css";

const captions = [
  {
    title: "Private Drivers You Can Trust",
    text: "Enjoy safe, comfortable, and reliable private drivers across all counties — anytime you need to move."
  },
  {
    title: "Travel Comfortably, Stress-Free",
    text: "From daily errands to long-distance trips, our professional drivers are always ready."
  },
  {
    title: "Professional Drivers, Clean Cars",
    text: "Well-trained drivers, clean vehicles, and smooth journeys every time."
  },
  {
    title: "Book a Driver in Seconds",
    text: "Choose your pickup point, destination, and time — we handle the rest."
  },
  {
    title: "Reliable Rides Across Kenya",
    text: "Serving all 47 counties with trusted private drivers near you."
  },
  {
    title: "Your Journey, Our Priority",
    text: "On-demand drivers designed around your schedule and comfort."
  }
];

/* 🔥 ALL BANNERS — FULL SCREEN */
const images = [
  "https://images.pexels.com/photos/1213294/pexels-photo-1213294.jpeg",
  "https://images.pexels.com/photos/7144185/pexels-photo-7144185.jpeg",
  "https://images.pexels.com/photos/977213/pexels-photo-977213.jpeg",
  "https://images.pexels.com/photos/593172/pexels-photo-593172.jpeg",
  "/mini-banners/mini1.jpeg",
  "/mini-banners/mini2.jpeg",

  "/mini-banners/mini4.jpeg"
];

export default function Banner() {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="banner">
      <img
        src={`${images[index]}?auto=compress&cs=tinysrgb&w=1600`}
        className="banner-img"
        alt="Private driver"
      />

      <div className="banner-overlay">
        <h1 className="brand-title animate-title">
          HESSY <span>URBAN</span> TAXI
        </h1>

        <div className="banner-content">
          {/* LEFT ADVANTAGES */}
          <div className="banner-left animate-list">
            <h3 className="advantages-title">
              Why Choose <span>Hessy Urban Taxi?</span>
            </h3>

            <ul className="advantages-list">
              <li>🚕 Affordable & transparent pricing</li>
              <li>💰 Pay after ride (no upfront payment)</li>
              <li>📍 Door-step pickup & drop-off</li>
              <li>🚘 Comfortable, clean & modern cars</li>
              <li>🧑‍✈️ Experienced & verified drivers</li>
              <li>⏰ Available 24/7 across all counties</li>
              <li>⚡ Fast booking & quick response</li>
              <li>🛡 Safe rides for families & ladies</li>
              <li>🛣 Reliable for long & short trips</li>
            </ul>
          </div>

          {/* RIGHT TEXT + CTA */}
          <div className="banner-right">
            <h2>{captions[index % captions.length].title}</h2>
            <p>{captions[index % captions.length].text}</p>

            <div className="hero-buttons">
              <button className="btn primary" onClick={() => navigate("/book")}>
                BOOK NOW
              </button>

              <button
                className="btn whatsapp"
                onClick={() =>
                  window.open(
                    "https://wa.me/254713130931?text=Hello%20Hessy%20Urban%20Taxi,%20I%20would%20like%20to%20book%20a%20ride.",
                    "_blank"
                  )
                }
              >
                WhatsApp
              </button>

              <button
                className="btn call"
                onClick={() => (window.location.href = "tel:+254713130931")}
              >
                CALL
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
