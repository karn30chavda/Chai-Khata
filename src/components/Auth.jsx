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
  const { login, signup, resetPassword, loginWithGoogle } = useAuth();

  async function handleGoogleLogin() {
    setError("");
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      setError(err.message.replace("Firebase:", ""));
    }
    setLoading(false);
  }

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
        minHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        paddingTop: "60px",
        maxWidth: "95%",
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
                    placeholder="Your Password"
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

        {!isForgotPassword && (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                margin: "25px 0",
                color: "#cbd5e1",
                fontSize: "0.8rem",
                fontWeight: 700,
              }}
            >
              <div
                style={{ flex: 1, height: "1px", background: "#f1f5f9" }}
              ></div>
              <span style={{ margin: "0 15px" }}>OR</span>
              <div
                style={{ flex: 1, height: "1px", background: "#f1f5f9" }}
              ></div>
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              type="button"
              style={{
                width: "100%",
                height: "55px",
                borderRadius: "14px",
                background: "white",
                border: "2px solid #f1f5f9",
                color: "#1e293b",
                fontWeight: 800,
                fontSize: "1rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#f8fafc")
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Login with Google
            </button>
          </>
        )}

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
