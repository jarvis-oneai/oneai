import React from "react";

export default function Footer() {
  return (
    <footer style={{
      width: "100%",
      background: "#fff",
      borderTop: "1.3px solid #E5E5E5",
      marginTop: 44,
      padding: "28px 0 20px 0",
      textAlign: "center",
      color: "#444"
    }}>
      <div style={{ fontSize: 15, marginBottom: 7 }}>
        <a href="/privacy" style={{ color: "#2976FF", textDecoration: "none", marginRight: 17 }}>Privacy Policy</a>
        <a href="/terms" style={{ color: "#2976FF", textDecoration: "none", marginRight: 17 }}>Terms & Conditions</a>
      </div>
      <div style={{ fontSize: 16, color: "#555" }}>
        © {new Date().getFullYear()} DataSage. All rights reserved.
      </div>
    </footer>
  );
}
