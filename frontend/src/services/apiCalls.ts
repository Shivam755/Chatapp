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

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
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
    if (response.status === 400 || response.status === 401) {
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


export const getAllRoles = async () => {
  const result = { success: true, error: "", data: [] };
  const fetchfn = () => fetch(`${getBaseUrl()}/role`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const response = await debounceFetch("gettAllRoles", fetchfn, 500);

  if (!response.ok) {
    result.success = false;
    if (response.status === 400 || response.status === 401 || response.status === 403) {
      const errorData = await response.json();
      result.error = errorData.error;
    }
    if (response.status === 500) {
      result.error = "Internal server error. Please try again later.";
    } else {
      result.error = "There was an error fetching roles. Please try again later.";
    }
  } else {
    result.data = await response.json();
  }

  return result;
}

export const addRole = async () => {
  const result = { success: true, error: "", data: [] };
  const fetchfn = () => fetch(`${getBaseUrl()}/role`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: "New Role", permission:[] }), // Example role name
  });
  const response = await debounceFetch("addRole", fetchfn, 500);

  if (!response.ok) {
    result.success = false;
    if (response.status === 400 || response.status === 401 || response.status === 403) {
      const errorData = await response.json();
      result.error = errorData.error;
    }
    if (response.status === 500) {
      result.error = "Internal server error. Please try again later.";
    } else {
      result.error = "There was an error fetching roles. Please try again later.";
    }
  } else {
    result.data = await response.json();
  }

  return result;
}

export const getAllFollowers = async () => {
  const result = { success: true, error: "", data: [] };
  const fetchfn = () => fetch(`${getBaseUrl()}/follow/followers`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const response = await debounceFetch("gettAllFollowers", fetchfn, 500);

  if (!response.ok) {
    result.success = false;
    if (response.status === 400 || response.status === 401 || response.status === 403) {
      const errorData = await response.json();
      result.error = errorData.error;
    }
    if (response.status === 500) {
      result.error = "Internal server error. Please try again later.";
    } else {
      result.error = "There was an error fetching followers. Please try again later.";
    }
  } else {
    result.data = await response.json();
  }

  return result;
}