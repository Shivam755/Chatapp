"use client";
import React from "react";
import { protectedOnly } from "@/wrappers/protectedOnly";

const Profile = () => {
  return (
    <div className="w-[98dvw] h-[80dvh] neumorphic-pressed m-4 p-4">
      <h1>Profile page</h1>
    </div>
  );
};

export default protectedOnly(Profile);
