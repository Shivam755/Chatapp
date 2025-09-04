"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { isLoggedIn, getUserInfo } from "@/services/user.api";
import { useToast } from "@/components/Toast";

export function protectedOnly(Component: React.ComponentType) {
  return function protectedPage(props: any) {
    const router = useRouter();
    const { showToast } = useToast();
    const { loginId, data, isSignedIn,signOut, setData } = useAuthStore();

    useEffect(() => {
      if (!(loginId || isSignedIn)) {
        router.replace("/login");
      }else{
        isLoggedIn()
        .then((response) => {
          if (!response.success){
            showToast("User session was not found or expired. Please login again")
            signOut();
            router.replace('/login');
          }
          else{
            if (data === null || data === undefined){
              getUserInfo().then((response)=>{
                setData(response.data ?? null);
              })
            }
          }
        })
      }
    }, [isSignedIn]);

    return <Component {...props} />;
  };
}
