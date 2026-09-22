import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
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
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSignup = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const {
      name,
      email,
      phone,
      password,
      confirmPassword,
    } = formData;

    if (
      !name ||
      !email ||
      !phone ||
      !password ||
      !confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "https://subscription-management-app-c1fa.onrender.com/api/auth/signup",
        {
          name,
          email,
          phone,
          password,
          confirmPassword,
        }
      );

      setSuccess(
        response.data.message ||
          "Account created successfully!"
      );

      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });

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

  return (
    <div className="auth-page">

      <div className="auth-card">

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

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        {success && (
          <div className="auth-success">
            {success}
          </div>
        )}

        <form onSubmit={handleSignup}>

          {/* Name */}

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

          {/* Email */}

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

          {/* Phone */}

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

          {/* Password */}

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
                    (previous) => !previous
                  )
                }
                disabled={loading}
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? "◉" : "◌"}
              </button>

            </div>

          </div>

          {/* Confirm Password */}

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
                    (previous) => !previous
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