import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn, signUp } from "../api/auth";

// Create the AuthContext
const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user"))
  );
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  // Save the user and token to localStorage whenever they change
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    }
  }, [user, token]);

  const login = async (email, password) => {
    try {
      const data = await signIn(email, password);

      setUser(data.user);
      setToken(data.token);

      navigate("/");
    } catch (error) {
      console.error("Error during login:", error);
      throw new Error("Login failed");
    }
  };

  const signup = async (name, email, password) => {
    try {
      const data = await signUp(name, email, password);

      setUser(data.user);
      setToken(data.token);

      navigate("/");
      return data;
    } catch (error) {
      console.error("Error during signup:", error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Context provider that shares the user state and methods
  return (
    <AuthContext.Provider value={{ user, token, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
}
