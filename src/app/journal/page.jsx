"use client";
import React, { use } from "react";
import { getUserPods, getSharedPods } from "../../../utils/db/action";
import { useUser } from "@/hooks/user";

const Page = () => {
  const { error: userError, loading: userLoading, user } = useUser();
  const [pods, setPods] = React.useState([]);
  const [errorPods, setErrorPods] = React.useState(null);
  const [loadingPods, setLoadingPods] = React.useState(true);
  const [sharedPods, setSharedPods] = React.useState([]);

  React.useEffect(() => {
    const fetchPods = async () => {
      if (!user) return; // Exit if user is not available

      try {
        setLoadingPods(true);
        const fetchedPods = await getUserPods(user.user_id);
        setPods(fetchedPods);
      } catch (err) {
        setErrorPods(err.message);
      } finally {
        setLoadingPods(false);
      }
    };
  }, [user]); // Dependency on user

  React.useEffect(() => {
    const fetchPods = async () => {
      if (!user) return; // Exit if user is not available

      try {
        setLoadingPods(true);
        const fetchedPods = await getUserPods(user.user_id);
        setPods(fetchedPods);
      } catch (err) {
        setErrorPods(err.message);
      } finally {
        setLoadingPods(false);
      }
    };

    fetchPods();
  }, [user]); // Dependency on user

  return (
    <div>
      {userLoading && <p>Loading user data...</p>}
      {userError && <p style={{ color: "red" }}>{userError}</p>}
      {/* {user && <p>User: {JSON.stringify(user)}</p>} */}
      <p>Journal page content</p>
      {loadingPods && <p>Loading pods...</p>}
      {errorPods && <p style={{ color: "red" }}>{errorPods}</p>}
      {!loadingPods && !errorPods && pods.length > 0 && (
        <div>
          <h2>Your Pods</h2>
          {JSON.stringify(pods)}
          {JSON.stringify(sharedPods)}
        </div>
      )}
      {!loadingPods && !errorPods && pods.length === 0 && <p>No pods found.</p>}
    </div>
  );
};

export default Page;
