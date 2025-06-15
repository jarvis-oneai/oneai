import React from "react";
import AnimatedLogo from "./AnimatedLogo"; // Your animated/flip logo component

const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

// Optionally fire analytics for nav events
const trackNavEvent = (event, data = {}) => {
  if (window.gtag) window.gtag("event", event, data);
  if (window.analytics) window.analytics.track(event, data);
};

export default function Navbar({ authed, onAuthOpen, setAuthTab }) {
  return (
    <nav
      style={{
        background: "#fff",
        boxShadow: "0 2px 12px 0 rgba(0,0,0,0.03)",
        padding: "0 48px",
        display: "flex",
        alignItems: "center",
        height: 74,
        borderBottom: "1.2px solid #E5E5E5",
        zIndex: 50,
        position: "sticky",
        top: 0,
      }}
    >
      {/* Logo with flip/animation onClick (scroll to top) */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginRight: 36,
          cursor: "pointer",
          userSelect: "none",
        }}
        onClick={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
          trackNavEvent("Navbar Logo Click");
        }}
      >
        <AnimatedLogo style={{ marginRight: 12, height: 32, width: 32 }} />
        <div
          style={{
            fontWeight: 900,
            fontSize: 27,
            color: "#1A1A1A",
            letterSpacing: "1px",
            fontFamily: "inherit",
          }}
        >
          <span style={{ color: "#2976FF" }}>Data</span>
          Sage
        </div>
      </div>

      <div style={{ flex: 1 }} />

      {/* Navigation links (scroll to section) */}
      <div style={{ display: "flex", gap: 36, fontWeight: 500, fontSize: 17 }}>
        <button
          onClick={() => scrollToSection("home-section")}
          className="nav-btn"
          style={navBtnStyle}
        >
          Home
        </button>
        <button
          onClick={() => scrollToSection("about-section")}
          className="nav-btn"
          style={navBtnStyle}
        >
          About Us
        </button>
        <button
          onClick={() => scrollToSection("datasage-section")}
          className="nav-btn"
          style={navBtnStyle}
        >
          About DataSage
        </button>
        <button
          onClick={() => scrollToSection("contact-section")}
          className="nav-btn"
          style={navBtnStyle}
        >
          Contact Us
        </button>
      </div>

      <div style={{ flex: 1 }} />

      {/* Auth buttons */}
      {!authed && (
        <>
          <button
            style={{
              marginRight: 16,
              background: "linear-gradient(90deg, #2976FF 80%, #00A7FA 100%)",
              color: "#fff",
              fontWeight: 700,
              border: "none",
              borderRadius: 25,
              padding: "11px 34px",
              fontSize: 17,
              boxShadow: "0 2px 12px 0 rgba(41,118,255,0.16)",
              cursor: "pointer",
              transition: "filter 0.18s",
              outline: "none",
            }}
            onClick={() => {
              setAuthTab("signup");
              onAuthOpen();
              trackNavEvent("Get Started Click");
            }}
          >
            Get Started
          </button>
          <button
            style={{
              background: "#fff",
              color: "#1A1A1A",
              fontWeight: 600,
              border: "1.3px solid #2976FF",
              borderRadius: 25,
              padding: "10px 30px",
              fontSize: 16.5,
              marginRight: 7,
              cursor: "pointer",
              transition: "filter 0.18s",
            }}
            onClick={() => {
              setAuthTab("login");
              onAuthOpen();
              trackNavEvent("Login Click");
            }}
          >
            Login
          </button>
        </>
      )}
    </nav>
  );
}

// Optional: minimal nav-btn style for button reset
const navBtnStyle = {
  background: "none",
  border: "none",
  color: "#2976FF",
  cursor: "pointer",
  fontSize: "17px",
  padding: 0,
  fontWeight: 500,
  outline: "none",
  transition: "color .18s",
  borderRadius: 8,
};
