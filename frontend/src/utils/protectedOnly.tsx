"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";

export function protectedOnly(Component: React.ComponentType) {
  return function protectedPage(props: any) {
    const router = useRouter();
    const { loginId, isSignedIn } = useAuthStore();

    useEffect(() => {
      if (!(loginId || isSignedIn)) {
        router.replace("/login");
      }
    }, []);

    return <Component {...props} />;
  };
}
