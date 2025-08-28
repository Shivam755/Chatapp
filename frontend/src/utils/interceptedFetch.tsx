import { useAuthStore } from "@/store/auth.store";

export async function interceptedFetch(fetchFn: () => Promise<Response>) {
  const { signOut } = useAuthStore.getState();

  const res = await fetchFn();

  if (res.status === 401) {
    signOut();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }
  else if (res.status === 403){
    
  }

  return res;
}
