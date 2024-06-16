import { useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../../config/default";
import Cookies from "js-cookie";
import { useRefreshToken } from "../auth/useRefreshToken";
import { useLogout } from '../../hooks/auth/useLogout';

const { REACT_APP_API_URL } = config;

export const useDeleteAccount = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const navigate = useNavigate();
  const { refreshToken } = useRefreshToken();
  const { logout } = useLogout();

  const deleteAccount = async (password) => {
    let token = Cookies.get("accessToken");
    if (!token) {
      navigate("/auth/login");
      return;
    }

    setIsLoading(true);
    setError(null);

    const sendRequest = async (token) => {
      try {
        const response = await fetch(`${REACT_APP_API_URL}/user/delete-user`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ password }),
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
              return { error: "Failed to refresh token, please login again." };
            }
          } else {
            const errorMessage = data.message || "An error occurred";
            setError(errorMessage);
            console.error("Error:", errorMessage);
            return { error: errorMessage };
          }
        } else {
          console.info(data.message);
          logout();
          navigate("/auth/success?type=account_deleted");
          return {};
        }
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to fetch");
        setIsLoading(false);
        return { error: "Failed to fetch" };
      }
    };

    return await sendRequest(token);
  };

  return { deleteAccount, isLoading, error };
};
