"use client";
import React from "react";
import { protectedOnly } from "@/wrappers/protectedOnly";

const ListChat = () => {

  return (
    <div className="flex flex-row justify-between w-full h-full p-1">
      <div className="neumorphic rounded-[12px] w-[25dvw] h-full flex items-center justify-center text-center">
        You don't have any friends yet
      </div>
      <div className="neumorphic-pressed rounded-[12px] h-full w-[70dvw]"></div>
    </div>
  );
};

// export default ListChat;
export default protectedOnly(ListChat);
