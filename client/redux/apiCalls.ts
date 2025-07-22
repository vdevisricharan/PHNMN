import axios from "axios";
import { loginStart, loginSuccess, loginFailure, logout as logoutAction } from "./slices/userSlice";
import type { AppDispatch } from "./store";
import Cookies from "js-cookie";

export const login = async (dispatch: AppDispatch, user: { username: string; password: string }) => {
  dispatch(loginStart());
  try {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, user);
    // Store accessToken in cookies
    if (res.data.accessToken) {
      Cookies.set("accessToken", res.data.accessToken, { expires: 7 });
    }
    dispatch(loginSuccess(res.data));
  } catch (_error){
    dispatch(loginFailure());
  }
};

export const register = async (data: { username: string; email: string; password: string }) => {
  const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, data);
  // Optionally store token if returned on register (if your backend does this)
  if (res.data.accessToken) {
    Cookies.set("accessToken", res.data.accessToken, { expires: 7 });
  }
  return res.data;
};

// Utility to get accessToken from cookies
export const getAccessToken = () => Cookies.get("accessToken");

// Authenticated axios request helper
export const authRequest = async (config: any) => {
  const token = getAccessToken();
  const safeConfig = typeof config === 'object' && config !== null ? config : {};
  return axios({
    ...safeConfig,
    headers: {
      ...(safeConfig.headers || {}),
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });
};

export const logout = (dispatch: AppDispatch) => {
  Cookies.remove("accessToken");
  dispatch(logoutAction());
};
