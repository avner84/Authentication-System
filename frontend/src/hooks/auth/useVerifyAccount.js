import { useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../../config/default";
const { REACT_APP_API_URL } = config;

export const useVerifyAccount = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const navigate = useNavigate();

  const verifyAccount = async (email) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${REACT_APP_API_URL}/auth/verify-for-password-reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      // update loading state
      setIsLoading(false);
      if (!response.ok) {       
        const errorMessage = data.message || "An error occurred";
        setError(errorMessage);
        console.error("Error:", errorMessage);
      } else {
        console.info(data.message);             
        navigate(`/auth/${data.status === 'success' ? 'success' : 'error'}?type=${data.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to fetch");
      setIsLoading(false);
    }
  };

  return { verifyAccount, isLoading, error };
};
