import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const server = "http://localhost:3001";

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.get(`${server}/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data);
        } catch (err) {
          console.log(err);
        }
      }
      console.log("fetching...");
    };
    if (!user) fetchUser();
  }, [user]);

  const login = async (email, password) => {
    const response = await axios.post(`${server}/login`, {
      email,
      password,
    });
    localStorage.setItem("token", response.data.token);
    setUser(response.data.user);
    // window.location = "/";
  };

  const register = async (username, email, password) => {
    await axios.post(`${server}/register`, {
      username,
      email,
      password,
    });
    // window.location = "/login";
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
