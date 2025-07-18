import axios from "axios";
import { loginStart, loginSuccess, loginFailure } from "./slices/userSlice";
import type { AppDispatch } from "./store";

export const login = async (dispatch: AppDispatch, user: { username: string; password: string }) => {
  dispatch(loginStart());
  try {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, user);
    dispatch(loginSuccess(res.data));
  } catch (_error){
    dispatch(loginFailure());
  }
};

export const register = async (data: { username: string; email: string; password: string }) => {
  // You can add more fields as needed
  const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, data);
  return res.data;
};
