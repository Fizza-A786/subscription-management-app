import {
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  FaRegEye,
  FaRegEyeSlash,
} from "react-icons/fa";

import { signup } from "../pages/services/authApi";

import type { Gender } from "../types/user";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "male" as Gender,
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const name = formData.name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();

    if (
      !name ||
      !email ||
      !phone ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError(
        "Please complete all required fields."
      );
      return;
    }

    if (formData.password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await signup({
        name,
        email,
        phone,
        gender: formData.gender,
        password: formData.password,
        confirmPassword:
          formData.confirmPassword,
      });

      setSuccess(
        response.message ||
          "Account created successfully."
      );

      setFormData({
        name: "",
        email: "",
        phone: "",
        gender: "male",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        navigate("/login", {
          replace: true,
        });
      }, 1200);

    } catch (error: any) {
      console.error(
        "Signup error:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Signup failed. Please try again."
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
              GET STARTED
            </span>

            <h1>
              Create your
              <br />
              UserFlow account.
            </h1>

            <p>
              Set up your account and get access
              to a clean workspace for managing
              your users and accounts.
            </p>

            <div className="auth-features">

              <div className="auth-feature">
                <span>✓</span>
                Quick account setup
              </div>

              <div className="auth-feature">
                <span>✓</span>
                Professional dashboard
              </div>

              <div className="auth-feature">
                <span>✓</span>
                Secure account access
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
                CREATE ACCOUNT
              </span>

              <h1>
                Create your account
              </h1>

              <p>
                Fill in your details to get
                started with UserFlow.
              </p>

            </div>

            {error && (
              <div className="auth-message auth-error">
                {error}
              </div>
            )}

            {success && (
              <div className="auth-message auth-success">
                {success}
              </div>
            )}

            <form
              className="auth-form signup-form"
              onSubmit={handleSubmit}
            >

              {/* NAME */}
              <div className="auth-field">

                <label htmlFor="name">
                  Full name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                  autoComplete="name"
                />

              </div>

              {/* EMAIL */}
              <div className="auth-field">

                <label htmlFor="email">
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  autoComplete="email"
                />

              </div>

              {/* PHONE */}
              <div className="auth-field">

                <label htmlFor="phone">
                  Phone number
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+92 300 1234567"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={loading}
                  autoComplete="tel"
                />

              </div>

              {/* GENDER */}
              <div className="auth-field">

                <label htmlFor="gender">
                  Gender
                </label>

                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="male">
                    Male
                  </option>

                  <option value="female">
                    Female
                  </option>

                  <option value="other">
                    Other
                  </option>
                </select>

              </div>

              {/* PASSWORD */}
              <div className="auth-field">

                <label htmlFor="password">
                  Password
                </label>

                <div className="auth-password">

                  <input
                    id="password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="At least 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className="auth-eye"
                    onClick={() =>
                      setShowPassword(
                        (previous) =>
                          !previous
                      )
                    }
                    disabled={loading}
                  >
                    {showPassword ? (
                      <FaRegEyeSlash />
                    ) : (
                      <FaRegEye />
                    )}
                  </button>

                </div>

              </div>

              {/* CONFIRM PASSWORD */}
              <div className="auth-field">

                <label htmlFor="confirmPassword">
                  Confirm password
                </label>

                <div className="auth-password">

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Repeat your password"
                    value={
                      formData.confirmPassword
                    }
                    onChange={handleChange}
                    disabled={loading}
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className="auth-eye"
                    onClick={() =>
                      setShowConfirmPassword(
                        (previous) =>
                          !previous
                      )
                    }
                    disabled={loading}
                  >
                    {showConfirmPassword ? (
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
                  ? "Creating account..."
                  : "Create account"}
              </button>

            </form>

            <div className="auth-divider">
              <span />
              <small>OR</small>
              <span />
            </div>

            <div className="auth-switch">

              <span>
                Already have an account?
              </span>

              <Link to="/login">
                Sign in
              </Link>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Signup;