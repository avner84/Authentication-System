import { useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../../config/default";
import Cookies from "js-cookie";
import { useRefreshToken } from "../auth/useRefreshToken";

const { REACT_APP_API_URL } = config;

export const useChangePassword = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const navigate = useNavigate();
  const { refreshToken } = useRefreshToken();

  const changePassword = async (currentPassword, newPassword, confirmNewPassword) => {
    let token = Cookies.get("accessToken");
    
    if (!token) {
      // Try to refresh the token
      await refreshToken();
      // Get the new token from cookies
      token = Cookies.get("accessToken");
    }

    if (!token) {
      navigate("/auth/login");
      return;
    }

    setIsLoading(true);
    setError(null);

    const sendRequest = async (token) => {
      try {
        const response = await fetch(`${REACT_APP_API_URL}/user/change-password`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ currentPassword, newPassword, confirmNewPassword }),
        });

        const data = await response.json();
        setIsLoading(false);

        if (!response.ok) {
          if (response.status === 401 && data.message === 'Token verification failed. Please provide a valid token.') {
            // Try to refresh the token
            await refreshToken();
            // Get the new token from cookies
            token = Cookies.get("accessToken");
            if (token) {
              return await sendRequest(token); // Resend the request with the new token
            } else {
              navigate("/auth/login");
              return;
            }
          } else {
            const errorMessage = data.message || "An error occurred";
            setError(errorMessage);
            console.error("Error:", errorMessage);
          }
        } else {
          console.info(data.message);
          navigate("/user/success?type=password_changed");
        }
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to fetch");
        setIsLoading(false);
      }
    };

    await sendRequest(token);
  };

  return { changePassword, isLoading, error };
};
