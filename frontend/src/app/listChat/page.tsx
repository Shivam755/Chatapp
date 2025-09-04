"use client";
import React from "react";
import NeumorphicButton from "@/components/NeumorphicButton";
import { protectedOnly } from "@/wrappers/protectedOnly";

const ListChat = () => {

  return (
    <div className="w-[98dvw] h-[80dvh] neumorphic-pressed m-4 p-4">
      <h1>List chat page</h1>
      <NeumorphicButton>Success</NeumorphicButton>
      <NeumorphicButton>Failure</NeumorphicButton>
    </div>
  );
};

// export default ListChat;
export default protectedOnly(ListChat);
