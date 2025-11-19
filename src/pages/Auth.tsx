import { useState } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const GOOGLE_CLIENT_ID = "156370990724-4m89fb910oii6q72jn29vt994kcr9m6s.apps.googleusercontent.com";
// Ganti redirect ke frontend, backend akan handle code dan redirect ke dashboard
const GOOGLE_REDIRECT_URI =
  import.meta.env.VITE_GOOGLE_REDIRECT_URI || `${window.location.origin}/auth/google/callback`;

const Auth = () => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Google OAuth handler dengan Redirect Flow
  const handleGoogleLogin = () => {
    setError("");
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: GOOGLE_REDIRECT_URI,
      response_type: "token id_token",
      scope: "openid email profile",
      prompt: "select_account",
      state: crypto.randomUUID(),
    });
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        const res = await axios.post(`${API_URL}api/v1/auth/login`, {
          email: form.email,
          password: form.password,
        });
        localStorage.setItem("token", res.data.access_token);
        window.location.href = "/dashboard";
      } else {
        await axios.post(`${API_URL}api/v1/auth/register`, {
          email: form.email,
          password: form.password,
          name: form.name,
          role: "participant",
        });
        setMode("login");
        setForm({ email: "", password: "", name: "" });
      }
    } catch (err: any) {
      if (err.response && err.response.data) {
        setError(
          err.response.data.detail?.[0]?.msg ||
          err.response.data.message ||
          "Auth failed"
        );
      } else {
        setError("Network error. Please try again.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f8fa]">
      <div className="w-full max-w-md mx-auto px-4 py-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src="/icon-bandung.jpg" alt="Cloud DevFest Bandung" className="w-32 h-auto" />
        </div>
        <form
          className="bg-white rounded-2xl shadow-xl p-8"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-[#222]">
            Welcome Back!
          </h2>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2 text-[#222]">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-[#e0e0e0] bg-[#f6f8fa] focus:outline-none focus:ring-2 focus:ring-primary text-base"
              required
              autoComplete="email"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-semibold mb-2 text-[#222]">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-[#e0e0e0] bg-[#f6f8fa] focus:outline-none focus:ring-2 focus:ring-primary text-base"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888] hover:text-primary"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg width="22" height="22" fill="none" stroke="currentColor"><path d="M1 11C3.5 5.5 8.5 2 11 2s7.5 3.5 10 9c-2.5 5.5-7.5 9-10 9s-7.5-3.5-10-9z"/><circle cx="11" cy="11" r="3"/></svg>
                ) : (
                  <svg width="22" height="22" fill="none" stroke="currentColor"><path d="M1 11C3.5 5.5 8.5 2 11 2s7.5 3.5 10 9c-2.5 5.5-7.5 9-10 9s-7.5-3.5-10-9z"/><line x1="4" y1="4" x2="18" y2="18"/></svg>
                )}
              </button>
            </div>
            <div className="flex justify-end mt-1">
              <a href="#" className="text-sm text-[#4285F4] hover:underline">Forgot Password?</a>
            </div>
          </div>
          {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
          <button
            type="submit"
            className="w-full bg-[#4285F4] hover:bg-[#1a73e8] text-white font-bold py-3 rounded-xl text-lg mt-6 transition-all disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Processing..." : "Login"}
          </button>
          <div className="flex items-center my-6">
            <hr className="flex-grow border-t border-[#e0e0e0]" />
            <span className="mx-4 text-[#888] font-semibold">OR</span>
            <hr className="flex-grow border-t border-[#e0e0e0]" />
          </div>
          {/* Google Login Button */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-white border border-[#e0e0e0] text-[#222] font-bold py-3 rounded-xl text-base shadow hover:bg-[#f6f8fa] transition-all disabled:opacity-50"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <img
              src="https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-webinar-optimizing-for-success-google-business-webinar-13.png"
              alt="Google"
              className="w-6 h-6"
            />
            <span>Login dengan Google</span>
          </button>
          <div className="mt-8 text-center text-[#222]">
            <span>No account yet? Register and buy your tickets at </span>
            <a
              href="https://devfest.cloudbandung.id"
              className="text-[#4285F4] font-bold hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              devfest.cloudbandung.id
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
