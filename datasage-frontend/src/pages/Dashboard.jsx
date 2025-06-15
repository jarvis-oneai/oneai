import React from "react";

export default function Dashboard() {
  return (
    <div style={{ maxWidth: 820, margin: "5rem auto 2rem auto", background: "#fafbfc", borderRadius: 24, padding: "3rem 2rem" }}>
      <h2 style={{ fontSize: 30, fontWeight: 700, marginBottom: 16 }}>Dashboard</h2>
      <p style={{ fontSize: 18, color: "#4d4d4d", lineHeight: 1.7 }}>
        Welcome to your DataSage dashboard.<br />
        Your analytics, workflows, and AI-powered insights will appear here.
      </p>
    </div>
  );
}
