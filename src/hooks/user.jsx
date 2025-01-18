"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getUserByEmail } from "../../utils/db/action";
const UserContext = createContext();

export function UserProvider({ children }) {
  const { data: session } = useSession();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (session?.user) {
      getUserByEmail(session.user.email).then((user) => setUser(user));
    }
  }, [session]);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}
