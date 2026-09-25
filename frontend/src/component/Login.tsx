import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaRegEye,
  FaRegEyeSlash,
} from "react-icons/fa";

import { login } from "../pages/services/authApi";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      setError(
        "Please enter your email and password."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await login({
        email: cleanEmail,
        password,
      });

      const { token, user } = response;

      if (!token) {
        setError(
          "Login failed. Authentication token was not received."
        );
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      navigate("/", {
        replace: true,
      });
    } catch (error: any) {
      console.error("Login error:", error);

      setError(
        error?.response?.data?.message ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">

        {/* LEFT SIDE */}
        <div className="auth-brand-panel">

          <div className="auth-brand">
            <div className="auth-brand-icon">
              ✦
            </div>

            <div>
              <h2>UserFlow</h2>
              <span>SAAS PLATFORM</span>
            </div>
          </div>

          <div className="auth-brand-content">
            <span className="auth-label">
              USER MANAGEMENT
            </span>

            <h1>
              Manage your users
              <br />
              from one workspace.
            </h1>

            <p>
              A simple and professional workspace for
              managing accounts, roles and user
              information.
            </p>

            <div className="auth-features">

              <div className="auth-feature">
                <span>✓</span>
                Secure authentication
              </div>

              <div className="auth-feature">
                <span>✓</span>
                Centralized user management
              </div>

              <div className="auth-feature">
                <span>✓</span>
                Role-based access
              </div>

            </div>
          </div>

          <div className="auth-system-status">
            <span className="status-dot" />
            System operational
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="auth-form-panel">

          <div className="auth-form-container">

            <div className="auth-heading">

              <span className="auth-small-title">
                WELCOME BACK
              </span>

              <h1>
                Sign in to your account
              </h1>

              <p>
                Enter your details to continue to
                your dashboard.
              </p>

            </div>

            {error && (
              <div className="auth-message auth-error">
                {error}
              </div>
            )}

            <form
              className="auth-form"
              onSubmit={handleLogin}
            >

              <div className="auth-field">

                <label htmlFor="email">
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError("");
                  }}
                  disabled={loading}
                  autoComplete="email"
                />

              </div>

              <div className="auth-field">

                <label htmlFor="password">
                  Password
                </label>

                <div className="auth-password">

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => {
                      setPassword(
                        event.target.value
                      );
                      setError("");
                    }}
                    disabled={loading}
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (previous) =>
                          !previous
                      )
                    }
                    disabled={loading}
                    className="auth-eye"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <FaRegEyeSlash />
                    ) : (
                      <FaRegEye />
                    )}
                  </button>

                </div>

              </div>

              <button
                type="submit"
                className="auth-submit"
                disabled={loading}
              >
                {loading
                  ? "Signing in..."
                  : "Sign in"}
              </button>

            </form>

            <div className="auth-divider">
              <span />
              <small>OR</small>
              <span />
            </div>

            <div className="auth-switch">
              <span>
                Don't have an account?
              </span>

              <Link to="/signup">
                Create account
              </Link>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Login;