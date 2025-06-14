"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type User = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
};

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          credentials: "include", // 💡 kluczowe – wyślij ciasteczko z tokenem
        });

        if (!res.ok) throw new Error("Not authenticated");

        const data = await res.json();
        setUser(data);
      } catch (err) {
        setUser(null);
        console.warn("Nie udało się pobrać użytkownika:", err);
      }
    };

    fetchUser();
  }, []);

  const logout = () => {
    // usuwamy ciastko lokalnie – ale backend też powinien mieć /auth/logout
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
  if (!context)
    throw new Error("useUser musi być użyty wewnątrz UserProvidera");
  return context;
};
