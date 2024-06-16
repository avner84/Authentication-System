import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogout } from './useLogout'
import config from "../../config/default";


const { REACT_APP_API_URL } = config;

export const useRefreshToken = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { logout } = useLogout()

  const refreshToken = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${REACT_APP_API_URL}/auth/refresh-token`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      setIsLoading(false);

      if (!response.ok) {
        const errorMessage = data.message || "An error occurred";
        setError(errorMessage);
        console.error("Error:", errorMessage);
        logout()
        navigate(`/auth/error?type=refresh_token_failed`);
      } else {
        console.info("Tokens refreshed successfully");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to fetch");
      setIsLoading(false);
      logout();
      navigate(`/uth/error?type=refresh_token_failed`);
    }
  };

  return { refreshToken, isLoading, error };
};
