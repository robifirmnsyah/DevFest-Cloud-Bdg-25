import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const AuthGoogleCallback = () => {
  const [message, setMessage] = useState("Authenticating...");

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.replace("#", ""));
    const idToken = hashParams.get("id_token");

    if (!idToken) {
      setMessage("Google login failed. Missing token.");
      setTimeout(() => (window.location.href = "/auth"), 1500);
      return;
    }

    axios
      .post(`${API_URL}api/v1/auth/google`, { id_token: idToken })
      .then((res) => {
        localStorage.setItem("token", res.data.access_token);
        window.location.href = "/dashboard";
      })
      .catch(() => {
        setMessage("Google login failed. Redirecting...");
        setTimeout(() => (window.location.href = "/auth"), 1500);
      });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f8fa] text-[#222]">
      {message}
    </div>
  );
};

export default AuthGoogleCallback;
