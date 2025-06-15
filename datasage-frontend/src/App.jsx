import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import DotCursor from "./components/DotCursor";
import AuthModal from "./components/AuthModal";
// Home page contains all main sections; about/contact are sections not separate pages.
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

export default function App() {
  // Whether modal is open
  const [authOpen, setAuthOpen] = useState(false);
  // Which tab is open by default ("login" or "signup")
  const [authTab, setAuthTab] = useState("login");
  // User authentication status (for demo; you'd use real auth in production)
  const [authed, setAuthed] = useState(false);

  // Handler when login/signup succeeds
  const handleLogin = () => {
    setAuthed(true);
    setAuthOpen(false);
    window.location.href = "/dashboard"; // or use react-router navigation
  };

  return (
    <Router>
      <DotCursor />
      <Navbar
        authed={authed}
        onAuthOpen={() => setAuthOpen(true)}
        setAuthTab={setAuthTab}
      />
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onLogin={handleLogin}
        defaultTab={authTab}
      />
      <Routes>
        <Route
          path="/"
          element={<Home onSignup={() => { setAuthTab("signup"); setAuthOpen(true); }} />}
        />
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />
        <Route
          path="*"
          element={<Home onSignup={() => { setAuthTab("signup"); setAuthOpen(true); }} />}
        />
      </Routes>
      <Footer />
    </Router>
  );
}
