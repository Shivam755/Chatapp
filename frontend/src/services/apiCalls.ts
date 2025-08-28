import { debounceFetch } from "@/utils/debounceFetch";
import { getBaseUrl } from "@/utils/getBaseUrl";

export const getAllRoles = async () => {
  const result = { success: true, error: "", data: [] };
  const fetchfn = () =>
    fetch(`${getBaseUrl()}/role`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
  const response = await debounceFetch("gettAllRoles", fetchfn, 500);

  if (!response.ok) {
    result.success = false;
    if (
      response.status === 400 ||
      response.status === 401 ||
      response.status === 403
    ) {
      const errorData = await response.json();
      result.error = errorData.error;
    }
    if (response.status === 500) {
      result.error = "Internal server error. Please try again later.";
    } else {
      result.error =
        "There was an error fetching roles. Please try again later.";
    }
  } else {
    result.data = await response.json();
  }

  return result;
};

export const addRole = async () => {
  const result = { success: true, error: "", data: [] };
  const fetchfn = () =>
    fetch(`${getBaseUrl()}/role`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: "New Role", permission: [] }), // Example role name
    });
  const response = await debounceFetch("addRole", fetchfn, 500);

  if (!response.ok) {
    result.success = false;
    if (
      response.status === 400 ||
      response.status === 401 ||
      response.status === 403
    ) {
      const errorData = await response.json();
      result.error = errorData.error;
    }
    if (response.status === 500) {
      result.error = "Internal server error. Please try again later.";
    } else {
      result.error =
        "There was an error fetching roles. Please try again later.";
    }
  } else {
    result.data = await response.json();
  }

  return result;
};

export const getAllFollowers = async () => {
  const result = { success: true, error: "", data: [] };
  const fetchfn = () =>
    fetch(`${getBaseUrl()}/follow/followers`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
  const response = await debounceFetch("gettAllFollowers", fetchfn, 500);

  if (!response.ok) {
    result.success = false;
    if (
      response.status === 400 ||
      response.status === 401 ||
      response.status === 403
    ) {
      const errorData = await response.json();
      result.error = errorData.error;
    }
    if (response.status === 500) {
      result.error = "Internal server error. Please try again later.";
    } else {
      result.error =
        "There was an error fetching followers. Please try again later.";
    }
  } else {
    result.data = await response.json();
  }

  return result;
};
