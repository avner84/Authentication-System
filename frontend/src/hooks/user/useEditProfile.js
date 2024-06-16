import { useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../../config/default";
import Cookies from "js-cookie";
import { useRefreshToken } from "../auth/useRefreshToken";
import { useAuthContext } from "../auth/useAuthContext";

const { REACT_APP_API_URL } = config;

export const useEditProfile = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();
  const { refreshToken } = useRefreshToken();

  const editProfile = async (firstName, lastName, password) => {
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
        const response = await fetch(`${REACT_APP_API_URL}/user/edit-user`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ firstName, lastName, password }),
        });

        const data = await response.json();
        setIsLoading(false);

        if (!response.ok) {
          if (
            response.status === 401 &&
            data.message ===
              "Token verification failed. Please provide a valid token."
          ) {
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
          const user = data.user;
          // save the user to local storage
          localStorage.setItem("user", JSON.stringify(user));
          // update the auth context
          dispatch({ type: "LOGIN", payload: user });
          navigate("/user/success?type=user_details_updated");
        }
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to fetch");
        setIsLoading(false);
      }
    };

    await sendRequest(token);
  };

  return { editProfile, isLoading, error };
};
