import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const GOOGLE_CLIENT_ID = "156370990724-4m89fb910oii6q72jn29vt994kcr9m6s.apps.googleusercontent.com";

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize?: (opts: any) => void;
          renderButton?: (element: HTMLElement | null, options?: any) => void;
        };
      };
    };
  }
}

const Auth = () => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [gsiReady, setGsiReady] = useState(false);
  const [hasDuplicateEmail, setHasDuplicateEmail] = useState(false);
  const gsiButtonRef = useRef<HTMLDivElement | null>(null);
  const gsiScriptInjected = useRef(false);

  // Helper to handle login success and redirect by role
  const handleAuthSuccess = (data: any) => {
    const userRoles = data?.user?.roles || [];
    
    // Store all roles
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("user_roles", JSON.stringify(userRoles));
    
    // Determine initial role (prioritize admin > organizer > booth_staff > participant)
    const initialRole = userRoles.includes("admin") ? "admin" :
                       userRoles.includes("organizer") ? "organizer" : 
                       userRoles.includes("booth_staff") ? "booth_staff" : 
                       "participant";
    localStorage.setItem("role", initialRole);
    // Redirect based on role using HashRouter
    if (initialRole === "admin") {
      window.location.hash = "/admin";
    } else if (initialRole === "organizer") {
      window.location.hash = "/organizer";
    } else if (initialRole === "booth_staff") {
      window.location.hash = "/booth-staff";
    } else {
      window.location.hash = "/dashboard";
    }
  };

  const handleGoogleCredential = useCallback(
    async (response: any) => {
      if (!response?.credential) {
        setError("Google login failed. Missing credential.");
        return;
      }
      setLoading(true);
      setError("");
      setHasDuplicateEmail(false);
      try {
        const res = await axios.post(`${API_URL}api/v1/auth/google`, {
          id_token: response.credential,
        });

        // Log the full response
        console.log("Google Login Response:", res.data);

        // If duplicate email, show only API message
        if (res.data.user?.has_duplicate_email) {
          const msg = typeof res.data?.message === "string"
            ? res.data.message
            : "Duplicate email detected. Please resolve duplicates first.";
          setHasDuplicateEmail(true);
          setError(msg);
          setLoading(false);
          return;
        }

        handleAuthSuccess(res.data);
      } catch (err: any) {
        // Log error response
        console.error("Google Login Error:", err?.response?.data || err);
        
        // Extract detailed error message from various possible locations
        const errorData = err?.response?.data;
        let msg = "Google login failed.";
        
        if (errorData) {
          // Check for detail field (string or array)
          if (typeof errorData.detail === "string") {
            msg = errorData.detail;
          } else if (Array.isArray(errorData.detail) && errorData.detail.length > 0) {
            msg = errorData.detail[0]?.msg || errorData.detail[0] || msg;
          }
          // Check for message field as fallback
          else if (typeof errorData.message === "string") {
            msg = errorData.message;
          }
        }
        
        setError(msg);
      }
      setLoading(false);
    },
    []
  );

  useEffect(() => {
    const initializeGSI = () => {
      if (!window.google?.accounts?.id || !gsiButtonRef.current) return;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCredential,
        ux_mode: "popup",
        auto_select: false,
        context: "signin",
      });
      gsiButtonRef.current.innerHTML = "";
      window.google.accounts.id.renderButton(gsiButtonRef.current, {
        type: "standard",
        theme: "filled_blue",
        size: "large",
        text: "signin_with",
        shape: "pill",
        logo_alignment: "left",
        width: "100%",
      });
      setGsiReady(true);
    };

    if (window.google?.accounts?.id) {
      initializeGSI();
      return;
    }
    if (gsiScriptInjected.current) return;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initializeGSI;
    script.onerror = () => setError("Gagal memuat Google Sign-In. Coba refresh.");
    document.head.appendChild(script);
    gsiScriptInjected.current = true;

    return () => {
      script.onload = null;
    };
  }, [handleGoogleCredential]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setHasDuplicateEmail(false);
    setLoading(true);
    try {
      if (mode === "login") {
        const res = await axios.post(`${API_URL}api/v1/auth/login`, {
          email: form.email,
          password: form.password,
        });
        
        // Check if user has duplicate email
        if (res.data.user?.has_duplicate_email) {
          setHasDuplicateEmail(true);
          setError("Your email has duplicate accounts. Please use email/password login or contact support to change your email.");
        }
        
        handleAuthSuccess(res.data);
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
      // Extract detailed error message from various possible locations
      const errorData = err?.response?.data;
      let msg = "Auth failed.";
      
      if (errorData) {
        // Check for detail field (string or array)
        if (typeof errorData.detail === "string") {
          msg = errorData.detail;
        } else if (Array.isArray(errorData.detail) && errorData.detail.length > 0) {
          msg = errorData.detail[0]?.msg || errorData.detail[0] || msg;
        }
        // Check for message field as fallback
        else if (typeof errorData.message === "string") {
          msg = errorData.message;
        }
      }
      
      setError(msg);
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
              Password or Ticket Code
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter password or ticket code"
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
          {error && <div className="text-red-500 mb-4 text-center text-sm">{error}</div>}
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
          
          {/* Only show Google Sign-In if no duplicate email detected */}
          {!hasDuplicateEmail && (
            <>
              <div className="mt-2 flex justify-center">
                <div ref={gsiButtonRef} className="w-full flex justify-center" />
              </div>
              {!gsiReady && (
                <button
                  type="button"
                  className="w-full mt-4 flex items-center justify-center gap-3 bg-white border border-[#e0e0e0] text-[#888] font-bold py-3 rounded-xl text-base shadow"
                  disabled
                >
                  Loading Google Sign-In...
                </button>
              )}
            </>
          )}
          
          {hasDuplicateEmail && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 text-center">
                <strong>Note:</strong> Google Sign-In is disabled for accounts with duplicate emails. Please use email/password login.
              </p>
            </div>
          )}
          
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
