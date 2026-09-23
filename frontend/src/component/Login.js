import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../pages/services/authApi";
const Login = () => {
    const navigate = useNavigate();
    // =========================================
    // FORM STATE
    // =========================================
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // =========================================
    // UI STATE
    // =========================================
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    // =========================================
    // LOGIN
    // =========================================
    const handleLogin = async (event) => {
        event.preventDefault();
        // Clear previous error
        setError("");
        // Basic validation
        if (!email || !password) {
            setError("Email and password are required.");
            return;
        }
        try {
            setLoading(true);
            // Call our auth API service
            const response = await login({
                email,
                password,
            });
            // Get token and user from backend
            const { token, user } = response;
            // =========================================
            // SAVE AUTHENTICATION DATA
            // =========================================
            if (token) {
                localStorage.setItem("token", token);
            }
            localStorage.setItem("user", JSON.stringify(user));
            // =========================================
            // REDIRECT
            // =========================================
            navigate("/");
        }
        catch (error) {
            console.error("Login error:", error);
            setError(error.response?.data?.message ||
                "Login failed. Please try again.");
        }
        finally {
            setLoading(false);
        }
    };
    // =========================================
    // UI
    // =========================================
    return (<div className="auth-page">

      <div className="auth-card">

        {/* =====================================
            HEADER
        ====================================== */}

        <div className="auth-header">

          <div className="auth-logo">
            ✦
          </div>

          <h1>
            Welcome Back
          </h1>

          <p>
            Login to your account
          </p>

        </div>

        {/* =====================================
            ERROR
        ====================================== */}

        {error && (<div className="auth-error">
            {error}
          </div>)}

        {/* =====================================
            LOGIN FORM
        ====================================== */}

        <form onSubmit={handleLogin}>

          {/* EMAIL */}

          <div className="auth-group">

            <label htmlFor="email">
              Email
            </label>

            <input id="email" type="email" placeholder="Enter your email" value={email} onChange={(event) => setEmail(event.target.value)} disabled={loading} autoComplete="email"/>

          </div>

          {/* PASSWORD */}

          <div className="auth-group">

            <label htmlFor="password">
              Password
            </label>

            <div className="password-input-wrapper">

              <input id="password" type={showPassword
            ? "text"
            : "password"} placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} disabled={loading} autoComplete="current-password"/>

              <button type="button" className="password-toggle" onClick={() => setShowPassword((previous) => !previous)} disabled={loading} aria-label={showPassword
            ? "Hide password"
            : "Show password"}>
                {showPassword
            ? "◉"
            : "◌"}
              </button>

            </div>

          </div>

          {/* =====================================
            LOGIN BUTTON
        ====================================== */}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading
            ? "Logging in..."
            : "Login"}
          </button>

        </form>

        {/* =====================================
            SIGNUP LINK
        ====================================== */}

        <div className="auth-footer">

          <p>

            Don't have an account?{" "}

            <button type="button" onClick={() => navigate("/signup")} disabled={loading}>
              Sign Up
            </button>

          </p>

        </div>

      </div>

    </div>);
};
export default Login;
