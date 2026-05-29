// src/api/request.ts
import baseAxios from "./BaseAxios";
import tokenAxios from "./BaseAxios"

export async function apiRequest<T = any>(
  endpoint: string,
  payload?: any,
  method: "GET" | "POST" | "PUT" | "DELETE"| "PATCH"  = "POST"
): Promise<T> {
  try {
    const res = await baseAxios({
      url: endpoint,
      method,
      data: payload,
    });

    return res.data; // <– this will be the object you commented out in LoginForm
  } catch (err: any) {
    // optionally refine
    throw err.response?.data || err;
  }
}

export async function apiGetAll<T = any>(
  endpoint: string,
  method = "GET" 
): Promise<T> {
  try {
    const res = await baseAxios({
      url: endpoint,
      method,
    });

    return res.data; // <– this will be the object you commented out in LoginForm
  } catch (err: any) {
    // optionally refine
    throw err.response?.data || err;
  }
}
export async function apiTokenRequest<T = any>(
  endpoint: string,
  payload?: any,
  method: "GET" | "POST" | "PUT" | "DELETE"| "PATCH"  = "POST"
): Promise<T> {
  try {
    const res = await tokenAxios({
      url: endpoint,
      method,
      data: payload,
    });

    return res.data; // <– this will be the object you commented out in LoginForm
  } catch (err: any) {
    // optionally refine
    throw err.response?.data || err;
  }
}

