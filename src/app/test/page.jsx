"use client";
import { useUser } from "@/hooks/user";
import React from "react";

const page = () => {
  const user = useUser();
  return <div>{JSON.stringify(user)}</div>;
};

export default page;
