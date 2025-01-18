"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getUserByEmail } from "../../utils/db/action";

const UserContext = createContext();

export function UserProvider({ children }) {
  const { data: session } = useSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (session?.user) {
      const fetchUser = async () => {
        try {
          setLoading(true); // Set loading to true before fetching
          const fetchedUser = await getUserByEmail(session.user.email);
          setUser(fetchedUser);
        } catch (err) {
          setError(err.message); // Capture any error that occurs
        } finally {
          setLoading(false); // Set loading to false after fetching
        }
      };

      fetchUser();
    } else {
      setLoading(false); // If there's no session, stop loading
    }
  }, [session]);

  return (
    <UserContext.Provider value={{ user, loading, error }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
