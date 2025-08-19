let debounceTimers: Record<string, NodeJS.Timeout> = {};

const debounceFetch = (
  key: string,
  fetchFn: () => Promise<Response>,
  delay: number = 500
): Promise<Response> => {
  return new Promise((resolve, reject) => {
    if (debounceTimers[key]) clearTimeout(debounceTimers[key]);
    debounceTimers[key] = setTimeout(async () => {
      try {
        const response = await fetchFn();
        resolve(response);
      } catch (err) {
        reject(err);
      }
    }, delay);
  });
};

export const getBaseUrl = () => {
  let baseurl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseurl) {
    console.log(
      "Base api url is not set! Please set an environment variable with name NEXT_PUBLIC_API_URL"
    );
  }
  return baseurl;
};

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  confirmPassword: string
) => {
  const result = { success: true, error: "", data: {} };
  const fetchfn = () =>fetch(`${getBaseUrl()}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password, confirmPassword }),
  });
  const response = await debounceFetch("registerUser", fetchfn, 500);

  if (!response.ok) {
    console.log(response);
    result.success = false;
    if (response.status === 400) {
      const errorData = await response.json();
      result.error = errorData.error;
    } else if (response.status === 500) {
      result.error = "Internal server error. Please try again later.";
    } else {
      result.error =
        "There was an error registering the user. Please try again later.";
    }
  } else {
    result.data = await response.json();
  }
  return result;
};

export const loginUser = async (email: string, password: string) => {
  const result = { success: true, error: "", data: {} };
  const fetchfn = () => fetch(`${getBaseUrl()}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  const response = await debounceFetch("registerUser", fetchfn, 500);
  if (!response.ok) {
    result.success = false;
    console.log(response)
    if (response.status === 400) {
      const errorData = await response.json();
      result.error = errorData.error;
    } else if (response.status === 500) {
      result.error = "Internal server error. Please try again later.";
    } else {
      result.error = "There was an error logging in. Please try again later.";
    }
  } else {
    result.data = await response.json();
  }

  return result;
};
