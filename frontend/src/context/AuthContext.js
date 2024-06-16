import { createContext, useReducer, useEffect, useState } from 'react';
import { refreshTokenForAuthContext } from '../utils/refreshTokenForAuthContext'; // Import the refreshTokenForAuthContext function

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload };
    case 'LOGOUT':
      return { user: null };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { user: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const user = JSON.parse(localStorage.getItem('user'));

      if (user) {
        dispatch({ type: 'LOGIN', payload: user });
        await refreshTokenForAuthContext(dispatch); // Call the refreshTokenForAuthContext function
      }
      setLoading(false);
    };

    fetchData();
  }, [dispatch]);

  console.log('AuthContext state:', state);

  return (
    <AuthContext.Provider value={{ ...state, dispatch, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
