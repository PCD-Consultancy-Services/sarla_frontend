import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios from "axios";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import axiosInstance from "../../../utils/axios";
import { generateErrorPayload } from "../../../utils/reduxErrorUtil";

const initialState = {
  loading: false,
  error: null,
};

export const forgetPassword = createAsyncThunk(
  "auth/forgotPassword",
  async ( email , { rejectWithValue }) => {
    console.log( email, "emaill")
    try {
      const response = await axiosInstance.post(`/auth/forgot-password`, {
        email
      });
      console.log(response , "forgot pwd")
      return response?.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

const forgetPasswordSlice = createSlice({
  name: "forgotPassword",
  initialState,
  extraReducers: (builder) => {
    // auth-login
    builder

      .addCase(forgetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(forgetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })

      .addCase(forgetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      });
  },
});

export default forgetPasswordSlice.reducer;
