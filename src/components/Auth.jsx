import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Coffee,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
} from "lucide-react";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, signup, resetPassword } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      if (isForgotPassword) {
        await resetPassword(email);
        setMessage("Check your inbox for further instructions.");
      } else if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password, name);
      }
    } catch (err) {
      setError(err.message.replace("Firebase:", ""));
    }
    setLoading(false);
  }

  return (
    <div
      className="fade-in"
      style={{
        padding: "10px",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        paddingTop: "60px",
        maxWidth: "420px",
        margin: "0 auto",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "35px" }}>
        <div
          style={{
            width: "70px",
            height: "70px",
            background: "var(--primary-gradient)",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            color: "white",
            boxShadow: "0 10px 25px rgba(99, 102, 241, 0.3)",
          }}
        >
          <Coffee size={35} />
        </div>
        <h1
          style={{
            fontSize: "2.2rem",
            fontWeight: 800,
            color: "#1e293b",
            marginBottom: "8px",
          }}
        >
          Chai Khata
        </h1>
        <p style={{ color: "#64748b", fontWeight: 600 }}>
          Simplify your office brew tracking
        </p>
      </div>

      <div
        className="form-card"
        style={{ padding: "30px", boxShadow: "0 15px 35px rgba(0,0,0,0.05)" }}
      >
        <h2
          className="form-title"
          style={{
            textAlign: "center",
            marginBottom: "30px",
            fontSize: "1.4rem",
          }}
        >
          {isForgotPassword
            ? "Reset Password"
            : isLogin
              ? "Welcome Back"
              : "Create Account"}
        </h2>

        {error && (
          <div
            style={{
              background: "#fef2f2",
              color: "#ef4444",
              padding: "14px",
              borderRadius: "12px",
              fontSize: "0.85rem",
              marginBottom: "20px",
              textAlign: "center",
              fontWeight: "700",
              border: "1px solid #fee2e2",
            }}
          >
            {error}
          </div>
        )}

        {message && (
          <div
            style={{
              background: "#ecfdf5",
              color: "#10b981",
              padding: "14px",
              borderRadius: "12px",
              fontSize: "0.85rem",
              marginBottom: "20px",
              textAlign: "center",
              fontWeight: "700",
              border: "1px solid #d1fae5",
            }}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isForgotPassword ? (
            <div className="field-group" style={{ marginBottom: "35px" }}>
              <label className="form-label">Email Address</label>
              <input
                className="time-input"
                type="email"
                placeholder="name@work.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ background: "#f8fafc", border: "2px solid #f1f5f9" }}
              />
            </div>
          ) : (
            <>
              {!isLogin && (
                <div className="field-group">
                  <label className="form-label">Full Name</label>
                  <input
                    className="time-input"
                    placeholder="Enter your name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      background: "#f8fafc",
                      border: "2px solid #f1f5f9",
                    }}
                  />
                </div>
              )}

              <div className="field-group">
                <label className="form-label">Email Address</label>
                <input
                  className="time-input"
                  type="email"
                  placeholder="name@work.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ background: "#f8fafc", border: "2px solid #f1f5f9" }}
                />
              </div>

              <div className="field-group" style={{ marginBottom: "10px" }}>
                <label className="form-label">Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    className="time-input"
                    type={showPassword ? "text" : "password"}
                    placeholder="Your secret code"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      background: "#f8fafc",
                      border: "2px solid #f1f5f9",
                      paddingRight: "45px",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "15px",
                      top: "18px",
                      background: "none",
                      border: "none",
                      color: "#64748b",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {isLogin && (
                <div style={{ textAlign: "right", marginBottom: "25px" }}>
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(true)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#6366f1",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Forgot Password?
                  </button>
                </div>
              )}
            </>
          )}

          <button
            className="submit-btn"
            disabled={loading}
            style={{ height: "55px", fontSize: "1.1rem", fontWeight: 800 }}
          >
            {loading ? (
              <Loader2 size={24} className="spin" />
            ) : isForgotPassword ? (
              "Reset Password"
            ) : isLogin ? (
              "Sign In"
            ) : (
              "Sign Up"
            )}
            {!loading && (
              <ArrowRight size={22} style={{ marginLeft: "10px" }} />
            )}
          </button>
        </form>

        <div
          style={{
            marginTop: "30px",
            textAlign: "center",
            fontSize: "0.95rem",
            color: "#64748b",
            fontWeight: 500,
          }}
        >
          {isForgotPassword ? (
            <button
              onClick={() => setIsForgotPassword(false)}
              style={{
                background: "none",
                border: "none",
                color: "#6366f1",
                fontWeight: 800,
                cursor: "pointer",
                fontSize: "0.95rem",
                display: "flex",
                alignItems: "center",
                margin: "0 auto",
                gap: "5px",
              }}
            >
              <ArrowLeft size={18} /> Back to Login
            </button>
          ) : (
            <>
              {isLogin ? "New to Chai Khata?" : "Already joined?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#6366f1",
                  fontWeight: 800,
                  cursor: "pointer",
                  marginLeft: "8px",
                  fontSize: "0.95rem",
                }}
              >
                {isLogin ? "Register Now" : "Sign In instead"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Auth;
