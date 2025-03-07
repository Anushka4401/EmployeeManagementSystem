import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = AuthService.getAccessToken();
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          setUser(decoded);
        } else {
          AuthService.refreshToken()
            .then((data) => {
              setUser(jwtDecode(data.access_token));
            })
            .catch(() => {
              AuthService.logout();
              setUser(null);
            });
        }
      } catch {
        AuthService.logout();
        setUser(null);
      }
    }
  }, []);
  const register = async (name, email, password) => {
    try {
      const data = await AuthService.register({ name, email, password });
      return data; // Successful registration
    } catch (error) {
      throw new Error("Registration failed");
    }
  };

  const login = async (email, password) => {
    try {
      const data = await AuthService.login({ email, password });
      const decoded = jwtDecode(data.access_token);
      setUser(decoded);

      if (
        decoded.role === "ROLE_ADMIN" ||
        decoded.role === "ROLE_SUPER_ADMIN"
      ) {
        navigate("/admin");
      } else {
        navigate("/user");
      }

      return data;
    } catch (error) {
      throw new Error("Invalid login credentials");
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
