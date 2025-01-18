"use client";
import { useUser } from "@/hooks/user";
import React from "react";

const UserProfile = () => {
  const { user, loading, error } = useUser();

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!user) return <p>No user found.</p>;

  return (
    <div>
      <h1>User Profile</h1>
      <p>Email: {user.email}</p>
      <p>Name: {user.name}</p>
      {/* Add more user details as needed */}
    </div>
  );
};

export default UserProfile;
