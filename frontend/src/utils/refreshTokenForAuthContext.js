import config from "../config/default";

const { REACT_APP_API_URL } = config;

export const refreshTokenForAuthContext = async (dispatch) => {
  try {
    const response = await fetch(`${REACT_APP_API_URL}/auth/refresh-token`, {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.message || "An error occurred";
      console.error("Error:", errorMessage);
      // Remove user from storage
      localStorage.removeItem("user");
      dispatch({ type: "LOGOUT" });
    } else {
      console.info("Tokens refreshed successfully");
    }
  } catch (error) {
    console.error("Error:", error);
    // Remove user from storage
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
  }
};
