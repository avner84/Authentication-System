import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "./useAuthContext"; 
import config from "../../config/default";
const { REACT_APP_API_URL } = config;

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const navigate = useNavigate();
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${REACT_APP_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
        }),
        credentials: "include",
      });
      const data = await response.json();

      // update loading state
      setIsLoading(false);

      if (!response.ok) {
        const errorMessage = data.message || "An error occurred";
        setError(errorMessage);
        console.error("Error:", errorMessage);
      } else {
        const user = data.user;

        // save the user to local storage
        localStorage.setItem("user", JSON.stringify(user));

        // update the auth context
        dispatch({ type: "LOGIN", payload: user });

        console.info("The login was successful");
        navigate("/");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to fetch");
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};
