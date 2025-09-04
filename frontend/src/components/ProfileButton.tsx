"use client";
import UserIcon from "@/svg/userIcon";
import React, { useState } from "react";

interface ProfileButtonProps {
  photoUrl?: string;
  className?: string;
  onClick?: (e:React.MouseEvent) => Promise<void>;
  onClickSync?: (e:React.MouseEvent) => void;
}

const ProfileButton = ({ photoUrl, className = "", onClick, onClickSync }: ProfileButtonProps) => {
  const [pressed, setPressed] = useState(false);

  const handleClick = async(e:React.MouseEvent) => {
    console.log("profile button clicked");
    if ((onClick !== null) && (onClick !== undefined)){
      await onClick(e);
    }
    if ((onClickSync !== null) && (onClickSync !== undefined)){
      console.log("onclicksync processing");
      onClickSync(e);
    }
    setPressed(true);
    setPressed(false);
  };

  return (
    <div
        className={`px-2 py-2 rounded-full font-semibold transition-transform duration-150 neumorphic h-10 w-10 ${
          pressed ? "neumorphic-pressed scale-95" : "neumorphic hover:scale-105"
        } ${className}`}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onMouseLeave={() => setPressed(false)}
        onClick={handleClick}
      >
        {(photoUrl === null || photoUrl === undefined || photoUrl === "") ? ( <UserIcon />) : (<img src={photoUrl} />)}
      </div>
  );
};

export default ProfileButton;
