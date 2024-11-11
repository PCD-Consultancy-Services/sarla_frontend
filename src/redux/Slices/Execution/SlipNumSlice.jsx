import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axios";
import { generateErrorPayload } from "../../../utils/reduxErrorUtil";

const initialState = {
  loading: false,
  slipNumber: "",
  error: null,
};

export const getSlipNumByCardBatch = createAsyncThunk(
  "schedule/getSlipNumByCardBatch",
  async (cardbatch, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/schedule/get/slipNumber/${cardbatch}`
      );
      // console.log(response);
      return response.data.data.slipNumber;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

const slipNumSlice = createSlice({
  name: "slipNum",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSlipNumByCardBatch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSlipNumByCardBatch.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.slipNumber = action.payload;
      })
      .addCase(getSlipNumByCardBatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default slipNumSlice.reducer;