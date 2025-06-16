import React, { useState } from "react";
import "./AuthModal.css";
import { auth, googleProvider, facebookProvider } from "../firebase";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithPopup,
  sendPasswordResetEmail,
  signInWithEmailAndPassword
} from "firebase/auth";

// COUNTRY CODES
const COUNTRY_CODES = [
  { code: "+91", name: "IN" },
  { code: "+1", name: "US" },
  { code: "+44", name: "UK" },
  { code: "+61", name: "AUS" }
];


const CLIENT_KEY = "datasage_client_id";
const SESSION_KEY = "datasage_session";
function getClientId() {
  let id = localStorage.getItem(CLIENT_KEY);
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem(CLIENT_KEY, id);
  }
  return id;
}
function startSession() {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ id: getClientId(), ts: Date.now() }));
}

const sendAnalyticsEvent = (event, data) => {
  const payload = { clientId: getClientId(), ...data };
  if (window.gtag) window.gtag("event", event, payload);
  if (window.analytics) window.analytics.track(event, payload);
  // Send to backend if needed.
};

export default function AuthModal({ open, onClose, onLogin, defaultTab = "login" }) {
  // ---- STATE ----
  const [tab, setTab] = useState(defaultTab); // login | signup
  const [stage, setStage] = useState("login"); // login, loginOtp, phone, otp, profile, socialPhone, socialOtp, reset, resetOtp
  const [form, setForm] = useState({
    loginId: "",
    password: "",
    loginOtp: "",
    loginCountry: "+91",
    loginMode: "", // will be set to 'otp' or 'password' when valid
    phone: "",
    signupCountry: "+91",
    otp: "",
    name: "",
    email: "",
    address1: "",
    address2: "",
    address3: "",
    city: "",
    state: "",
    pincode: ""
  });
  const [confirmation, setConfirmation] = useState(null);
  const [socialPayload, setSocialPayload] = useState(null);
  const [errors, setErrors] = useState({});
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  // ---- MODAL RESET ----
  React.useEffect(() => {
    if (!open) {
      setTab(defaultTab);
      setStage("login");
      setForm({
        loginId: "",
        password: "",
        loginOtp: "",
        loginCountry: "+91",
        loginMode: "",
        phone: "",
        signupCountry: "+91",
        otp: "",
        name: "",
        email: "",
        address1: "",
        address2: "",
        address3: "",
        city: "",
        state: "",
        pincode: ""
      });
      setConfirmation(null);
      setErrors({});
      setInfo("");
      setSocialPayload(null);
    } else {
      if (tab === "signup") setStage("phone");
      if (tab === "login") setStage("login");
    }
  }, [open, tab, defaultTab]);

  // ---- HELPERS ----
  const isPhone = (v) => /^\d{10,}$/.test(v.replace(/\D/g, "")); // require full length
  const isEmail = (v) => /\S+@\S+\.\S+/.test(v);

  // ---- INPUT CHANGE ----
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => {
      const updated = { ...f, [name]: value };
      if (name === "loginId") {
        if (isPhone(value)) {
          updated.loginMode = "otp";
        } else if (isEmail(value)) {
          updated.loginMode = "password";
        } else {
          updated.loginMode = "";
        }
      }
      return updated;
    });
    setErrors((errs) => ({ ...errs, [name]: undefined }));
  }

  // ---- LOGIN FORM SUBMIT ----
  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    let loginId = form.loginId.trim();
    if (isPhone(loginId)) {
      let phoneFull = `${form.loginCountry}${loginId.replace(/\D/g, "")}`;
      try {
        if (!window.recaptchaVerifierLogin) {
          window.recaptchaVerifierLogin = new RecaptchaVerifier(
            'recaptcha-container-login',
            { size: 'invisible' },
            auth
          );
        }
        const confirmationResult = await signInWithPhoneNumber(auth, phoneFull, window.recaptchaVerifierLogin);
        setConfirmation(confirmationResult);
        setStage("loginOtp");
        setInfo("OTP sent to your phone");
        sendAnalyticsEvent("OTP Sent", { phone: phoneFull, authIntent: "Login" });
      } catch (err) {
        setErrors({ loginId: "Failed to send OTP. " + (err.message || "") });
      }
      setLoading(false);
      return;
    }
    // If email
    if (isEmail(loginId)) {
      try {
        await signInWithEmailAndPassword(auth, loginId, form.password);
        sendAnalyticsEvent("Login Submitted", { method: "Email", authIntent: "Login" });
        startSession();
        onLogin?.();
      } catch (_err) {
        console.error(_err);
        setErrors({ loginId: "Invalid email/password." });
      }
      setLoading(false);
      return;
    }
    setErrors({ loginId: "Enter valid email or phone." });
    setLoading(false);
  }

  // ---- OTP VERIFY (LOGIN) ----
  async function handleLoginOtp(e) {
    e.preventDefault();
    setLoading(true);
    if (!form.loginOtp || form.loginOtp.length < 4) {
      setErrors({ loginOtp: "Enter the OTP sent to your phone" });
      setLoading(false);
      return;
    }
    try {
      await confirmation.confirm(form.loginOtp);
      sendAnalyticsEvent("OTP Verified", { phone: form.loginCountry + form.loginId, authIntent: "Login" });
      startSession();
      onLogin?.();
    } catch (_err) {
      console.error(_err);
      setErrors({ loginOtp: "Incorrect OTP. Please try again." });
    }
    setLoading(false);
  }

  // ---- RESET PASSWORD OTP ----
  async function handleResetOtp(e) {
    e.preventDefault();
    setLoading(true);
    if (!form.loginOtp || form.loginOtp.length < 4) {
      setErrors({ loginOtp: 'Enter the OTP sent to your phone' });
      setLoading(false);
      return;
    }
    let phoneFull = `${form.loginCountry}${form.loginId.replace(/\D/g, '')}`;
    try {
      const resp = await fetch('/api/password-reset/send-reset-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneFull, otp: form.loginOtp })
      });
      if (resp.ok) {
        setInfo('Password reset link sent via SMS.');
        setStage('login');
      } else {
        const data = await resp.json().catch(() => ({}));
        setErrors({ loginOtp: data.error || 'Invalid or expired OTP.' });
      }
    } catch (_err) {
      console.error(_err);
      setErrors({ loginOtp: 'Failed to verify OTP.' });
    }
    setLoading(false);
  }

  // ---- SOCIAL LOGIN ----
  async function socialAuth(providerName) {
    setLoading(true);
    let prov = providerName === "google" ? googleProvider : facebookProvider;
    let intent = tab === "login" ? "Login" : "Signup";
    try {
      const result = await signInWithPopup(auth, prov);
      let user = result.user;
      setForm((f) => ({
        ...f,
        name: user.displayName || "",
        email: user.email || "",
        phone: "", // ask next
      }));
      setSocialPayload({ provider: providerName, ...user });
      sendAnalyticsEvent("Social Auth Success", { provider: providerName, email: user.email, authIntent: intent });
      setStage("socialPhone");
      setInfo("Authenticated. Now verify your phone to continue.");
    } catch (err) {
      setErrors({ general: "Failed social login: " + (err.message || "") });
    }
    setLoading(false);
  }

  // ---- SOCIAL PHONE SUBMIT ----
  async function handleSocialPhone(e) {
    e.preventDefault();
    setLoading(true);
    let phoneFull = `${form.signupCountry}${form.phone.replace(/\D/g, "")}`;
    if (!/^\+\d{10,15}$/.test(phoneFull)) {
      setErrors({ phone: "Enter a valid phone number (with country code)" });
      setLoading(false);
      return;
    }
    try {
      if (!window.recaptchaVerifierSocial) {
        window.recaptchaVerifierSocial = new RecaptchaVerifier(
          'recaptcha-container-social',
          { size: 'invisible' },
          auth
        );
      }
      const confirmationResult = await signInWithPhoneNumber(auth, phoneFull, window.recaptchaVerifierSocial);
      setConfirmation(confirmationResult);
      setStage("socialOtp");
      setInfo("OTP sent to your phone");
      sendAnalyticsEvent("OTP Sent", { phone: phoneFull, authIntent: "Signup" });
    } catch (err) {
      setErrors({ phone: "Failed to send OTP. " + (err.message || "") });
    }
    setLoading(false);
  }

  // ---- SOCIAL OTP SUBMIT ----
  async function handleSocialOtp(e) {
    e.preventDefault();
    setLoading(true);
    if (!form.otp || form.otp.length < 4) {
      setErrors({ otp: "Enter the OTP sent to your phone" });
      setLoading(false);
      return;
    }
    try {
      await confirmation.confirm(form.otp);
      setStage("profile");
      setInfo("");
      sendAnalyticsEvent("OTP Verified", { phone: form.signupCountry + form.phone, authIntent: "Signup" });
    } catch (_err) {
      console.error(_err);
      setErrors({ otp: "Incorrect OTP. Please try again." });
    }
    setLoading(false);
  }

  // ---- SIGNUP - STEP 1: PHONE ----
  async function handlePhoneSubmit(e) {
    e.preventDefault();
    setLoading(true);
    let phoneFull = `${form.signupCountry}${form.phone.replace(/\D/g, "")}`;
    if (!/^\+\d{10,15}$/.test(phoneFull)) {
      setErrors({ phone: "Enter a valid phone number (with country code)" });
      setLoading(false);
      return;
    }
    try {
      sendAnalyticsEvent("Phone Captured", { phone: phoneFull });
      if (!window.recaptchaVerifierSignup) {
        window.recaptchaVerifierSignup = new RecaptchaVerifier(
          'recaptcha-container-signup',
          { size: 'invisible' },
          auth
        );
      }
      const confirmationResult = await signInWithPhoneNumber(auth, phoneFull, window.recaptchaVerifierSignup);
      setConfirmation(confirmationResult);
      setStage("otp");
      setInfo("OTP sent to your phone");
      sendAnalyticsEvent("OTP Sent", { phone: phoneFull, authIntent: "Signup" });
    } catch (err) {
      setErrors({ phone: "Failed to send OTP. " + (err.message || "") });
    }
    setLoading(false);
  }

  // ---- SIGNUP - STEP 2: OTP ----
  async function handleOTPSubmit(e) {
    e.preventDefault();
    setLoading(true);
    if (!form.otp || form.otp.length < 4) {
      setErrors({ otp: "Enter the OTP sent to your phone" });
      setLoading(false);
      return;
    }
    try {
      await confirmation.confirm(form.otp);
      setStage("profile");
      setInfo("");
      sendAnalyticsEvent("OTP Verified", { phone: form.signupCountry + form.phone, authIntent: "Signup" });
    } catch (_err) {
      console.error(_err);
      setErrors({ otp: "Incorrect OTP. Please try again." });
    }
    setLoading(false);
  }

  // ---- SIGNUP - STEP 3: PROFILE ----
  function validateProfile() {
    const e = {};
    if (!form.name) e.name = "Enter your name";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter valid email";
    if (!form.address1) e.address1 = "Enter address line 1";
    if (!form.city) e.city = "Enter city";
    if (!form.state) e.state = "Enter state";
    if (!form.pincode || !/^\d{4,10}$/.test(form.pincode)) e.pincode = "Enter valid pincode";
    return e;
  }
  async function handleProfileSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const errs = validateProfile();
    if (Object.keys(errs).length) {
      setErrors(errs);
      setLoading(false);
      return;
    }
    try {
      sendAnalyticsEvent("User Profile Filled", { ...form });
      sendAnalyticsEvent("User Created", { ...form });
      sendAnalyticsEvent("Signup Successful", { phone: form.signupCountry + form.phone, email: form.email });
      // Persist to your backend/database/segment here.
      setInfo("Signup successful! Redirecting to dashboard...");
      startSession();
      setTimeout(() => {
        onLogin?.();
        setStage("login");
      }, 1200);
    } catch (_err) {
      console.error(_err);
      setErrors({ general: "Failed to create account. Try again." });
    }
    setLoading(false);
  }

  // ---- FORGOT PASSWORD ----
  // Show reset password form
  function startForgotPassword() {
    setStage("reset");
    setErrors({});
    setInfo("");
  }

  // ---- FORGOT PASSWORD ----
  async function handleForgotPassword(e) {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    let loginId = form.loginId.trim();
    if (isPhone(loginId)) {
      let phoneFull = `${form.loginCountry}${loginId.replace(/\D/g, "")}`;
      try {
        const resp = await fetch('/api/password-reset/request-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: phoneFull })
        });
        if (resp.ok) {
          setStage('resetOtp');
          setInfo('OTP sent to your phone');
          sendAnalyticsEvent('OTP Sent', { phone: phoneFull, authIntent: 'Reset' });
        } else {
          const data = await resp.json().catch(() => ({}));
          setErrors({ loginId: data.error || 'Failed to send OTP.' });
        }
      } catch (err) {
        setErrors({ loginId: 'Failed to send OTP. ' + (err.message || '') });
      }
      setLoading(false);
      return;
    }
    if (!isEmail(loginId)) {
      setErrors({ loginId: 'Enter your registered email or phone.' });
      setLoading(false);
      return;
    }
    try {
      await sendPasswordResetEmail(auth, loginId);
      setInfo('Password reset email sent. Check your inbox (link valid for 10 minutes).');
      sendAnalyticsEvent('Password Reset Email Sent', { email: loginId });
    } catch (err) {
      setErrors({ loginId: 'Failed to send reset email: ' + (err.message || '') });
    }
    setLoading(false);
  }

  // ---- RENDER ----
  if (!open) return null;
  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal">
        <div style={{ display: "flex", alignItems: "center", marginBottom: 18 }}>
          <div
            className={`auth-tab ${tab === "login" ? "active" : ""}`}
            onClick={() => { setTab("login"); setStage("login"); setErrors({}); }}
          >Login</div>
          <div
            className={`auth-tab ${tab === "signup" ? "active" : ""}`}
            onClick={() => { setTab("signup"); setStage("phone"); setErrors({}); }}
          >Sign Up</div>
          <span style={{ flex: 1 }} />
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <div id="recaptcha-container-login" />
        <div id="recaptcha-container-signup" />
        <div id="recaptcha-container-social" />
        <div id="recaptcha-container-reset" />

        {/* LOGIN - PHONE/EMAIL */}
        {tab === "login" && stage === "login" && (
          <form className="auth-form" onSubmit={handleLogin}>
            <div style={{ display: "flex", gap: 7 }}>
              <select
                name="loginCountry"
                value={form.loginCountry}
                onChange={handleChange}
                style={{ width: 78, borderRadius: 8, border: "1px solid #e5e7ef", fontWeight: 600 }}
              >
                {COUNTRY_CODES.map(({ code, name }) => (
                  <option key={code} value={code}>{name} {code}</option>
                ))}
              </select>
              <input
                name="loginId"
                placeholder={
                  form.loginMode === "otp"
                    ? "Phone Number"
                    : form.loginMode === "password"
                    ? "Email"
                    : "Phone Number or Email"
                }
                className="auth-input"
                value={form.loginId}
                onChange={handleChange}
                required
                style={{ flex: 1 }}
              />
            </div>
            {!form.loginMode && (
              <div className="auth-hint">Enter phone for OTP or email for password</div>
            )}
            {/* Password field only for email login */}
            {form.loginMode === "password" && (
              <input
                name="password"
                type="password"
                placeholder="Password"
                className="auth-input"
                value={form.password}
                onChange={handleChange}
              />
            )}
            {/* Forgot password */}
            {form.loginMode === "password" && (
              <button
                type="button"
                className="forgot-link"
                style={{ color: "#2976FF", background: "none", border: "none", fontWeight: 700, margin: "6px 0 0 0", textAlign: "left", fontSize: "1.06rem", cursor: "pointer" }}
                onClick={startForgotPassword}
                disabled={loading}
              >
                Forgot Password?
              </button>
            )}
            {errors.loginId && <div className="auth-error">{errors.loginId}</div>}
            <button className="auth-btn" type="submit" disabled={loading}>
              {form.loginMode === "otp"
                ? "Send OTP"
                : form.loginMode === "password"
                ? "Login"
                : "Continue"}
            </button>
            <div className="auth-divider">or continue with</div>
            <div className="auth-socials">
              <button type="button" className="google" onClick={() => socialAuth("google")}><img src="/assets/google.svg" alt="Google" />Google</button>
              <button type="button" className="facebook" onClick={() => socialAuth("facebook")}><img src="/assets/facebook.svg" alt="Facebook" />Facebook</button>
            </div>
            {info && <div className="auth-info">{info}</div>}
          </form>
        )}
        {/* LOGIN - OTP VERIFICATION */}
        {tab === "login" && stage === "loginOtp" && (
          <form className="auth-form" onSubmit={handleLoginOtp}>
            <input
              name="loginOtp"
              placeholder="Enter OTP"
              className="auth-input"
              value={form.loginOtp}
              onChange={handleChange}
              required
              disabled={loading}
            />
            {errors.loginOtp && <div className="auth-error">{errors.loginOtp}</div>}
            <button className="auth-btn" type="submit" disabled={loading}>{loading ? "Verifying..." : "Verify OTP"}</button>
            {info && <div className="auth-info">{info}</div>}
          </form>
        )}
        {/* LOGIN - RESET PASSWORD */}
        {tab === "login" && stage === "reset" && (
          <form className="auth-form" onSubmit={handleForgotPassword}>
            <input
              name="loginId"
              placeholder="Registered Phone or Email"
              className="auth-input"
              value={form.loginId}
              onChange={handleChange}
              required
              disabled={loading}
            />
            {errors.loginId && <div className="auth-error">{errors.loginId}</div>}
            <button className="auth-btn" type="submit" disabled={loading}>{loading ? "Sending..." : isPhone(form.loginId) ? "Send OTP" : "Send Reset Email"}</button>
            {info && <div className="auth-info">{info}</div>}
            <button
              type="button"
              className="mode-btn"
              onClick={() => { setStage("login"); setInfo(""); setErrors({}); }}
              style={{ marginTop: 8 }}
            >
              Back to Login
            </button>
          </form>
        )}

        {tab === "login" && stage === "resetOtp" && (
          <form className="auth-form" onSubmit={handleResetOtp}>
            <input
              name="loginOtp"
              placeholder="Enter OTP"
              className="auth-input"
              value={form.loginOtp}
              onChange={handleChange}
              required
              disabled={loading}
            />
            {errors.loginOtp && <div className="auth-error">{errors.loginOtp}</div>}
            <button className="auth-btn" type="submit" disabled={loading}>{loading ? "Verifying..." : "Verify OTP"}</button>
            {info && <div className="auth-info">{info}</div>}
          </form>
        )}

        {/* SIGNUP: PHONE */}
        {tab === "signup" && stage === "phone" && (
          <form className="auth-form" onSubmit={handlePhoneSubmit}>
            <div style={{ display: "flex", gap: 7 }}>
              <select
                name="signupCountry"
                value={form.signupCountry}
                onChange={handleChange}
                style={{ width: 78, borderRadius: 8, border: "1px solid #e5e7ef", fontWeight: 600 }}
              >
                {COUNTRY_CODES.map(({ code, name }) => (
                  <option key={code} value={code}>{name} {code}</option>
                ))}
              </select>
              <input
                name="phone"
                placeholder="Phone Number"
                className="auth-input"
                value={form.phone}
                onChange={handleChange}
                autoComplete="tel"
                required
                style={{ flex: 1 }}
              />
            </div>
            {errors.phone && <div className="auth-error">{errors.phone}</div>}
            <button className="auth-btn" type="submit" disabled={loading}>{loading ? "Sending..." : "Continue"}</button>
            <div className="auth-divider">or sign up with</div>
            <div className="auth-socials">
              <button type="button" className="google" onClick={() => socialAuth("google")}><img src="/assets/google.svg" alt="Google" />Google</button>
              <button type="button" className="facebook" onClick={() => socialAuth("facebook")}><img src="/assets/facebook.svg" alt="Facebook" />Facebook</button>
            </div>
            {info && <div className="auth-info">{info}</div>}
          </form>
        )}

        {/* SIGNUP: OTP */}
        {tab === "signup" && stage === "otp" && (
          <form className="auth-form" onSubmit={handleOTPSubmit}>
            <input
              name="otp"
              placeholder="Enter OTP"
              className="auth-input"
              value={form.otp}
              onChange={handleChange}
              required
              disabled={loading}
            />
            {errors.otp && <div className="auth-error">{errors.otp}</div>}
            <button className="auth-btn" type="submit" disabled={loading}>{loading ? "Verifying..." : "Verify OTP"}</button>
            {info && <div className="auth-info">{info}</div>}
          </form>
        )}

        {/* SIGNUP: PROFILE */}
        {tab === "signup" && stage === "profile" && (
          <form className="auth-form" onSubmit={handleProfileSubmit}>
            <input
              name="name"
              placeholder="Full Name"
              className="auth-input"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              name="email"
              placeholder="Email"
              className="auth-input"
              value={form.email}
              onChange={handleChange}
              required
              disabled={!!socialPayload}
            />
            <input
              name="address1"
              placeholder="Address Line 1"
              className="auth-input"
              value={form.address1}
              onChange={handleChange}
              required
            />
            <input
              name="address2"
              placeholder="Address Line 2"
              className="auth-input"
              value={form.address2}
              onChange={handleChange}
            />
            <input
              name="address3"
              placeholder="Address Line 3"
              className="auth-input"
              value={form.address3}
              onChange={handleChange}
            />
            <input
              name="city"
              placeholder="City"
              className="auth-input"
              value={form.city}
              onChange={handleChange}
              required
            />
            <input
              name="state"
              placeholder="State"
              className="auth-input"
              value={form.state}
              onChange={handleChange}
              required
            />
            <input
              name="pincode"
              placeholder="Pincode"
              className="auth-input"
              value={form.pincode}
              onChange={handleChange}
              required
            />
            {errors.general && <div className="auth-error">{errors.general}</div>}
            <button className="auth-btn" type="submit" disabled={loading}>{loading ? "Saving..." : "Go to Dashboard"}</button>
            {info && <div className="auth-info">{info}</div>}
          </form>
        )}

        {/* SOCIAL - ASK FOR PHONE */}
        {stage === "socialPhone" && (
          <form className="auth-form" onSubmit={handleSocialPhone}>
            <div style={{ display: "flex", gap: 7 }}>
              <select
                name="signupCountry"
                value={form.signupCountry}
                onChange={handleChange}
                style={{ width: 78, borderRadius: 8, border: "1px solid #e5e7ef", fontWeight: 600 }}
              >
                {COUNTRY_CODES.map(({ code, name }) => (
                  <option key={code} value={code}>{name} {code}</option>
                ))}
              </select>
              <input
                name="phone"
                placeholder="Phone Number"
                className="auth-input"
                value={form.phone}
                onChange={handleChange}
                autoComplete="tel"
                required
                style={{ flex: 1 }}
              />
            </div>
            {errors.phone && <div className="auth-error">{errors.phone}</div>}
            <button className="auth-btn" type="submit" disabled={loading}>{loading ? "Sending..." : "Continue"}</button>
            {info && <div className="auth-info">{info}</div>}
          </form>
        )}

        {/* SOCIAL - OTP */}
        {stage === "socialOtp" && (
          <form className="auth-form" onSubmit={handleSocialOtp}>
            <input
              name="otp"
              placeholder="Enter OTP"
              className="auth-input"
              value={form.otp}
              onChange={handleChange}
              required
              disabled={loading}
            />
            {errors.otp && <div className="auth-error">{errors.otp}</div>}
            <button className="auth-btn" type="submit" disabled={loading}>{loading ? "Verifying..." : "Verify OTP"}</button>
            {info && <div className="auth-info">{info}</div>}
          </form>
        )}

      </div>
    </div>
  );
}
