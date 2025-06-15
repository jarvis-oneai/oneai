import React from "react";
import "./Home.css"; // Make sure this exists!

export default function Home({ onSignup }) {
  return (
    <div className="home-root">
      {/* HERO Section */}
      <section id="home-section" className="home-hero">
        <h1>What is DataSage?</h1>
        <div style={{ fontSize: 20, marginBottom: 13, color: "#4D4D4D", fontWeight: 400 }}>
          DataSage unifies business data, AI workflows, and collaboration for creative teams and ambitious companies.
        </div>
        <ul>
          <li>Super-fast dashboard setup</li>
          <li>Bring your own LLM (ChatGPT, Gemini, etc.)</li>
          <li>Automate insights and reporting</li>
          <li>Collaborative workspace, real-time</li>
        </ul>
        <div style={{ marginTop: 30 }}>
          <button
            className="hero-cta-btn"
            onClick={onSignup}
            style={{
              background: "linear-gradient(90deg, #2976FF 80%, #00A7FA 100%)",
              color: "#fff",
              fontWeight: 700,
              border: "none",
              borderRadius: 18,
              padding: "15px 38px",
              fontSize: 21,
              fontFamily: "inherit",
              boxShadow: "0 4px 18px 0 rgba(41,118,255,0.13)",
              cursor: "pointer"
            }}
          >
            Get Started Free
          </button>
        </div>
      </section>

      {/* Features/Use Cases */}
      <div className="home-features-row">
        {/* Card 1 */}
        <div className="feature-card">
          <img src="/assets/sample1.svg" alt="Marketing OS" className="feature-img" />
          <div className="feature-title">Marketing OS</div>
          <div className="feature-desc">Automate campaigns, segment customers, and track ROI in real-time.</div>
        </div>
        {/* Card 2 */}
        <div className="feature-card">
          <img src="/assets/sample2.svg" alt="AI Finance" className="feature-img" />
          <div className="feature-title">AI Finance</div>
          <div className="feature-desc">Budgeting, forecasting, and spend analytics powered by next-gen LLMs.</div>
        </div>
      </div>

      {/* About Us Section */}
      <section id="about-section" className="home-section">
        <h2>About Us</h2>
        <p>
          We are a passionate team of data engineers, designers, and product makers with a mission to make data-driven collaboration seamless for every company.<br /><br />
          Our platform is built on top of the latest cloud and AI technology, with a focus on speed, privacy, and delightful UX.
        </p>
      </section>

      {/* About DataSage Section */}
      <section id="datasage-section" className="home-section">
        <h2>About DataSage</h2>
        <p>
          DataSage was founded to make enterprise-grade analytics and automation available to everyone.<br /><br />
          Trusted by startups and enterprises, DataSage is built for scale, privacy, and customization.
        </p>
      </section>

      {/* Contact Us Section */}
      <section id="contact-section" className="home-section">
        <h2>Contact Us</h2>
        <p>
          Interested in DataSage? Drop us a message or email <a href="mailto:team@datasage.ai">team@datasage.ai</a>.
        </p>
        <form
          action="mailto:one.a.i.jarvis.shinobi@gmail.com"
          method="POST"
          className="contact-form"
        >
          <input placeholder="Your Email" type="email" required />
          <textarea placeholder="How can we help you?" required rows={5} />
          <button
            type="submit"
            className="hero-cta-btn"
          >
            Send Message
          </button>
        </form>
      </section>
    </div>
  );
}
