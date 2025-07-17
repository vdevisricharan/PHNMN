import axios from "axios";
import { loginStart, loginSuccess, loginFailure } from "./slices/userSlice";
import type { AppDispatch } from "./store";

export const login = async (dispatch: AppDispatch, user: { username: string; password: string }) => {
  dispatch(loginStart());
  try {
    // Adjust the API URL as needed, here using relative path
    const res = await axios.post("/api/auth/login", user);
    dispatch(loginSuccess(res.data));
  } catch (_error){
    dispatch(loginFailure());
  }
};
