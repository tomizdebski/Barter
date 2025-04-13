"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

export type User = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

function getCookie(name: string): string | undefined {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match?.[2];
}

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = getCookie("token");
    if (token) {
      try {
        const decoded = jwtDecode<User>(token);
        setUser(decoded);
        //console.log("Zdekodowany token", decoded);
      } catch (error) {
        console.error("Błąd dekodowania tokena", error);
      }
    }
  }, []);

  const logout = () => {
    document.cookie = "token=; Max-Age=0; path=/";
    setUser(null);
    window.location.href = "/";
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser musi być użyty wewnątrz UserProvidera");
  return context;
};
