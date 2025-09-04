import { debounceFetch } from "@/utils/debounceFetch";
import { getBaseUrl } from "@/utils/getBaseUrl";
import ApiResponse from "@/models/apiResponse";

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  confirmPassword: string
) : Promise<ApiResponse<{}>> => {
  const result = new ApiResponse<{}>();
  const fetchfn = () =>
    fetch(`${getBaseUrl()}/user/signup`, {
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

export const loginUser = async (
  email: string,
  password: string
): Promise<ApiResponse<LoginResponse>> => {
  const result = new ApiResponse<LoginResponse>();
  const fetchfn = () =>
    fetch(`${getBaseUrl()}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
  const response = await debounceFetch("registerUser", fetchfn, 500);
  if (!response.ok) {
    result.success = false;
    console.log(response);
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

export const logoutUser = async () => {
  const result = { success: true, error: "", data: {} };
  const fetchfn = () =>
    fetch(`${getBaseUrl()}/user/logout`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  const response = await debounceFetch("Logout", fetchfn, 500);
  console.log(response);
  if (!response.ok) {
    result.success = false;
    console.log(response);
    if (response.status === 400 || response.status === 401) {
      const errorData = await response.json();
      result.error = errorData.error;
    } else if (response.status === 500) {
      result.error = "Internal server error. Please try again later.";
    } else {
      result.error = "There was an error logging out. Please try again later.";
    }
  } else {
    result.data = "Logout success!";
  }

  return result;
};

export const getUserInfo = async (): Promise<ApiResponse<UserData>> => {
  const result = new ApiResponse<UserData>();
  const fetchfn = () =>
    fetch(`${getBaseUrl()}/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  const response = await debounceFetch("getUserInfo", fetchfn, 500);
  console.log(response);
  if (!response.ok) {
    result.success = false;
    console.log(response);
    if (response.status === 400 || response.status === 401) {
      const errorData = await response.json();
      result.error = errorData.error;
    } else if (response.status === 500) {
      result.error = "Internal server error. Please try again later.";
    } else {
      result.error = "There was an error fetching data. Please try again later.";
    }
  } else {
    result.data = await response.json();
  }

  return result;
}

export const isLoggedIn = async () => {
    const result = { success: true, error: "", data: {} };
  const fetchfn = () =>
    fetch(`${getBaseUrl()}/user/isLoggedIn`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  const response = await debounceFetch("isLoggedIn", fetchfn, 500);
  if (!response.ok) {
    result.success = false;
  } else {
    result.success = true;
  }

  return result;
}