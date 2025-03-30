"use client";

import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext(undefined);

export function UserProvider({ children, initialUser = null }) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [isLoading, setIsLoading] = useState<boolean>(!initialUser);

  useEffect(() => {
    if (!initialUser && typeof window !== "undefined") {
      setIsLoading(false);
    }
  }, [initialUser]);

  return (
    <UserContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
