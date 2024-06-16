import { useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../../config/default";
const { REACT_APP_API_URL } = config;

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const navigate = useNavigate();

  const signup = async (
    firstName,
    lastName,
    email,
    password,
    confirmPassword
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${REACT_APP_API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          confirmPassword,
        }),
      });
      const data = await response.json();

      // update loading state
      setIsLoading(false);

      if (!response.ok) {
        const errorMessage = data.message || "An error occurred";
        setError(errorMessage);
        console.error("Error:", errorMessage);
      } else {
        console.info("Success:", data.message);
        navigate("/auth/success?type=verification_email_sent");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to fetch");
      setIsLoading(false);
    }
  };

  return { signup, isLoading, error };
};
