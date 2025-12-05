import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = (import.meta.env.VITE_API_URL ?? "https://devfest-api.cloudbandung.id/").replace(/\/?$/, "/");

const AuthGoogleCallback = () => {
  const [message, setMessage] = useState("Authenticating...");

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.replace("#", ""));
    const idToken = hashParams.get("id_token");

    if (!idToken) {
      setMessage("Google login failed. Missing token.");
      setTimeout(() => (window.location.hash = "/auth"), 1500);
      return;
    }

    axios
      .post(`${API_URL}api/v1/auth/google`, { id_token: idToken })
      .then((res) => {
        const userRoles = res.data?.user?.roles || [];
        
        // Store all roles
        localStorage.setItem("token", res.data.access_token);
        localStorage.setItem("user_roles", JSON.stringify(userRoles));
        
        // Determine initial role
        const initialRole = userRoles.includes("organizer") ? "organizer" : 
                           userRoles.includes("booth_staff") ? "booth_staff" : 
                           "participant";
        localStorage.setItem("role", initialRole);
        // Redirect based on role via HashRouter
        if (initialRole === "organizer") {
          window.location.hash = "/organizer";
        } else if (initialRole === "booth_staff") {
          window.location.hash = "/booth-staff";
        } else {
          window.location.hash = "/dashboard";
        }
      })
      .catch(() => {
        setMessage("Google login failed. Redirecting...");
        setTimeout(() => (window.location.hash = "/auth"), 1500);
      });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f8fa] text-[#222]">
      {message}
    </div>
  );
};

export default AuthGoogleCallback;
