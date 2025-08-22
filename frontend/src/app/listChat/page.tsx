"use client";
import React from "react";
import NeumorphicButton from "@/components/NeumorphicButton";
import { useToast } from "@/components/Toast";
import { getAllFollowers, addRole } from "@/services/apiCalls";
import { protectedOnly } from "@/utils/protectedOnly";

const ListChat = () => {
  const { showToast } = useToast();
  const getRoles = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic her
    const response = await getAllFollowers();
    try {
      console.log(response);
      if (response.success) {
        console.log("Followers fetched successfully:", response);
        // Redirect or show success message
        showToast("Followers fetch successful!", "success");
      } else {
        showToast(response.error, "error");
      }
    } catch (error: any) {
      console.error("Error fetching followers user:", error.message);
    }
  };
  const addRoles = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic her
    const response = await addRole();
    try {
      console.log(response);
      if (response.success) {
        console.log("User registered successfully:", response);
        // Redirect or show success message
        showToast("Registration successful!", "success");
      } else {
        showToast(response.error, "error");
      }
    } catch (error: any) {
      console.error("Error registering user:", error.message);
    }
  };
  return (
    <div>
      <h1></h1>
      <NeumorphicButton onClick={getRoles}>
        Success
      </NeumorphicButton>
      <NeumorphicButton onClick={addRoles}>
        Failure
      </NeumorphicButton>
    </div>
  );
};

export default protectedOnly(ListChat);
