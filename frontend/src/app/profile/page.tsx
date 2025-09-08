"use client";
import React from "react";
import { protectedOnly } from "@/wrappers/protectedOnly";
import { useAuthStore } from "@/store/auth.store";
import NeumorphicButton from "@/components/NeumorphicButton";


const Profile = () => {
  const {data} = useAuthStore();
  return (
    <div className="grid gap-2 grid-cols-2 grid-rows-6 w-full h-full justify-center items-center content-center neumorphic-pressed rounded-[12px] m-4 p-4">
      <h1 className="col-span-2 row-span-1 text-center w-full font-extrabold text-4xl">Profile page</h1>
      <img className="col-span-2 row-span-2 neumorphic p-3 rounded-full max-h-[20dvh] max-w-[20dvh]" src={data?.profileImage} alt="Profile Photo" />
      <NeumorphicButton className="col-span-2 row-span-1">Update Profile Photo</NeumorphicButton>
      <div className="neumorphic rounded-[12px] col-span-2 row-span-2 pl-13 justify-center items-center content-center">
        <div className="h-[3rem]">
          <span>UserName: </span> <span>{data?.name}</span>
        </div>
        <div className="h-[3rem]">
          <span>Email: </span> <span>{data?.email}</span>
        </div>
        <NeumorphicButton>
          Change Password
        </NeumorphicButton>
      </div>
      
    </div>
  );
};

export default protectedOnly(Profile);
