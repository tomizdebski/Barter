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
        credentials: "include",
      });

      if (!res.ok) {
        console.warn("Not authenticated");
        return setUser(null);
      }

      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.warn("Błąd pobierania użytkownika:", err);
      setUser(null);
    }
  };
  //document.cookie = "token=; path=/; max-age=0"; //działa lokalnie
  
  const timeout = setTimeout(fetchUser, 200);
  return () => clearTimeout(timeout);
}, []);


  const logout = async () => {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signout`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch (err) {
    console.error("Logout failed:", err);
  } finally {
    setUser(null);

    // Daj chwilę na reset tokena zanim przelogujesz
    setTimeout(() => {
      window.location.href = "/";
    }, 100);
  }
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
