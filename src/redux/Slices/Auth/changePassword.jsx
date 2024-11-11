import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosInstance from '../../../utils/axios';
import { generateErrorPayload } from '../../../utils/reduxErrorUtil';

const initialState = {
    loading: false,
    error: null,
    success: null,
}


export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (payload, { rejectWithValue }) => {
    console.log(payload ,"payload")
    try {
      const response = await axiosInstance.put('/auth/change-password', payload);
      console.log(response?.data)
      return response.data;
    } catch (error) {
        const errorPayload = generateErrorPayload(error);
        return rejectWithValue(errorPayload);
    }
  }
);

const changePasswordSlice = createSlice({
  name: 'change-password',
  initialState,
  reducers: {
    clearState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearState } = changePasswordSlice.actions;

export default changePasswordSlice.reducer;
