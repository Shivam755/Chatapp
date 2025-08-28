import { interceptedFetch } from "@/utils/interceptedFetch";

export let debounceTimers: Record<string, NodeJS.Timeout> = {};

export const debounceFetch = (
  key: string,
  fetchFn: () => Promise<Response>,
  delay: number = 500
): Promise<Response> => {
  return new Promise((resolve, reject) => {
    if (debounceTimers[key]) clearTimeout(debounceTimers[key]);
    debounceTimers[key] = setTimeout(async () => {
      try {
        const response = await interceptedFetch(fetchFn);
        resolve(response);
      } catch (err) {
        reject(err);
      }
    }, delay);
  });
};
