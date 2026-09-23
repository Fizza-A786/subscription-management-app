import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { signup } from "../pages/services/authApi";

const Signup = () => {
  const navigate = useNavigate();

  // =========================================
  // FORM STATE
  // =========================================

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    });

  // =========================================
  // UI STATE
  // =========================================

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // =========================================
  // HANDLE INPUT CHANGE
  // =========================================

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  };

  // =========================================
  // SIGNUP
  // =========================================

  const handleSignup = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    // Clear old messages
    setError("");
    setSuccess("");

    const {
      name,
      email,
      phone,
      password,
      confirmPassword,
    } = formData;

    // =========================================
    // VALIDATION
    // =========================================

    if (
      !name ||
      !email ||
      !phone ||
      !password ||
      !confirmPassword
    ) {
      setError(
        "Please fill in all fields."
      );
      return;
    }

    if (
      password !== confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    if (
      password.length < 6
    ) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    // =========================================
    // API REQUEST
    // =========================================

    try {
      setLoading(true);

      const response = await signup({
        name,
        email,
        phone,
        password,
        confirmPassword,
      });

      // =========================================
      // SUCCESS MESSAGE
      // =========================================

      setSuccess(
        response.message ||
          "Account created successfully!"
      );

      // Clear form
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });

      // =========================================
      // GO TO LOGIN
      // =========================================

      setTimeout(() => {
        navigate("/login");
      }, 1200);

    } catch (error: any) {
      console.error(
        "Signup error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Signup failed. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // UI
  // =========================================

  return (
    <div className="auth-page">

      <div className="auth-card">

        {/* =====================================
            HEADER
        ====================================== */}

        <div className="auth-header">

          <div className="auth-logo">
            ✦
          </div>

          <h1>
            Create Account
          </h1>

          <p>
            Create your UserFlow account
          </p>

        </div>

        {/* =====================================
            ERROR
        ====================================== */}

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        {/* =====================================
            SUCCESS
        ====================================== */}

        {success && (
          <div className="auth-success">
            {success}
          </div>
        )}

        {/* =====================================
            SIGNUP FORM
        ====================================== */}

        <form
          onSubmit={handleSignup}
        >

          {/* NAME */}

          <div className="auth-group">

            <label htmlFor="name">
              Full Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              autoComplete="name"
            />

          </div>

          {/* EMAIL */}

          <div className="auth-group">

            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              autoComplete="email"
            />

          </div>

          {/* PHONE */}

          <div className="auth-group">

            <label htmlFor="phone">
              Phone
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              disabled={loading}
              autoComplete="tel"
            />

          </div>

          {/* PASSWORD */}

          <div className="auth-group">

            <label htmlFor="password">
              Password
            </label>

            <div className="password-input-wrapper">

              <input
                id="password"
                name="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                autoComplete="new-password"
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(
                    (previous) =>
                      !previous
                  )
                }
                disabled={loading}
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword
                  ? "◉"
                  : "◌"}
              </button>

            </div>

          </div>

          {/* CONFIRM PASSWORD */}

          <div className="auth-group">

            <label htmlFor="confirmPassword">
              Confirm Password
            </label>

            <div className="password-input-wrapper">

              <input
                id="confirmPassword"
                name="confirmPassword"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                placeholder="Confirm your password"
                value={
                  formData.confirmPassword
                }
                onChange={handleChange}
                disabled={loading}
                autoComplete="new-password"
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowConfirmPassword(
                    (previous) =>
                      !previous
                  )
                }
                disabled={loading}
                aria-label={
                  showConfirmPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showConfirmPassword
                  ? "◉"
                  : "◌"}
              </button>

            </div>

          </div>

          {/* =====================================
              SIGNUP BUTTON
          ====================================== */}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>

        {/* =====================================
            LOGIN LINK
        ====================================== */}

        <div className="auth-footer">

          <p>

            Already have an account?{" "}

            <button
              type="button"
              onClick={() =>
                navigate("/login")
              }
              disabled={loading}
            >
              Login
            </button>

          </p>

        </div>

      </div>

    </div>
  );
};

export default Signup;