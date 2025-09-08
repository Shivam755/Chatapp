"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import Navbar from "@/components/NavBar";

export function withGuest(Component: React.ComponentType) {
  return function GuestOnlyPage(props: any) {
    const router = useRouter();
    const { loginId, isSignedIn } = useAuthStore();

    useEffect(() => {
      if (loginId || isSignedIn) {
        router.replace("/listChat");
      }
    }, [isSignedIn]);

    return (
      <>
        <Navbar/>
        <Component {...props} />
      </>
    );
  };
}
