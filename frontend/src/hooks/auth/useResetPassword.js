import { useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../../config/default";
import Cookies from "js-cookie";

const { REACT_APP_API_URL } = config;

export const useResetPassword = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const navigate = useNavigate();

  const resetPassword = async (email, password, confirmPassword) => {
    const token = Cookies.get("passwordResetToken");    
    if (!token) {
      navigate("/error?type=password_reset_link_expired");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${REACT_APP_API_URL}/auth/reset-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, password, confirmPassword }),
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
        // navigate(`/${data.status === 'success' ? 'success' : 'error'}?type=${data.message}`);
        navigate("/auth/success?type=password_reset");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to fetch");
      setIsLoading(false);
    }
  };

  return { resetPassword, isLoading, error };
};
