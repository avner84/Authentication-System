import { useAuthContext } from "./useAuthContext";
import config from "../../config/default";
import Cookies from "js-cookie";

const { REACT_APP_API_URL } = config;

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  
  const logout = async () => {
    // Remove user from storage
    localStorage.removeItem("user");

    // Dispatch logout action
    dispatch({ type: "LOGOUT" });

    // Get the accessToken from cookies
    const accessToken = Cookies.get("accessToken");

    if (!accessToken) {
      console.error("Access token not found in cookies");
      return;
    }

    try {
      // Make a fetch request to the logout endpoint
      const response = await fetch(`${REACT_APP_API_URL}/auth/logout`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Logout request failed");
      }
    } catch (error) {
      console.error("Failed to logout:", error);
    } finally {
      // Remove accessToken from cookies
      Cookies.remove("accessToken");      
    }
  };

  return { logout };
};
