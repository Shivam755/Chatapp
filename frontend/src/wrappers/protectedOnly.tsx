"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { isLoggedIn, getUserInfo } from "@/services/user.api";
import { useToast } from "@/components/Toast";
import Navbar from "@/components/NavBar";

export function protectedOnly(Component: React.ComponentType) {
  return function protectedPage(props: any) {
    const router = useRouter();
    const { showToast } = useToast();
    const { loginId, data, isSignedIn, signOut, setData } = useAuthStore();

    useEffect(() => {
      if (!(loginId || isSignedIn)) {
        console.log("user not logged in");
        console.log(
          `loginid: ${loginId}, isSignedIn: ${isSignedIn}, data: ${data}`
        );
        router.replace("/login");
      } else {
        console.log("is signedin true");
        isLoggedIn().then((response) => {
          console.log("isloggedin complete");
          if (!response.success) {
            console.log("error recieved");
            showToast(
              "User session was not found or expired. Please login again"
            );
            signOut();
            router.replace("/login");
          } else {
            console.log("success recieved");
            if (data === null || data === undefined) {
              getUserInfo().then((response) => {
                console.log("");
                setData(response.data ?? null);
              });
            }
          }
        });
      }
    }, [isSignedIn]);

    return (
      <div className="flex flex-row h-full w-full">
        <Navbar />
        <Component {...props} />
      </div>
    );
  };
}
