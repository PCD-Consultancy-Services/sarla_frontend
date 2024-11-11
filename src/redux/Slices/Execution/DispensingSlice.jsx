import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { generateErrorPayload } from "../../../utils/reduxErrorUtil";
import axiosInstance from "../../../utils/axios";

export const fetchSlipNumbers = createAsyncThunk(
  "dispensing/fetchSlipNumbers",
  async (params, { rejectWithValue }) => {
    const { q } = params;
    console.log(q, "q");
    try {
      const response = await axiosInstance.get("/dispensing/search", {
        params: { q },
      });
      console.log(response?.data, "----------------");
      return response.data;
    } catch (error) {
      console.log(error, "error");
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

// Fetching Detailed Dispensing Data by ID
export const fetchDispensingById = createAsyncThunk(
  "dispensing/fetchDispensingById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/dispensing/${id}`);
      return response.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

// Redux Slice
const dispensingSlice = createSlice({
  name: "dispensing",
  initialState: {
    slipNumbers: [],
    dispensingDetails: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
    clearDispensingDetails : (state) => {
      state.dispensingDetails = null
    }
  },
  extraReducers: (builder) => {
    // Handle fetchSlipNumbers
    builder.addCase(fetchSlipNumbers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchSlipNumbers.fulfilled, (state, action) => {
      state.loading = false;
      state.slipNumbers = action.payload.data.results;
    });
    builder.addCase(fetchSlipNumbers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Handle fetchDispensingById
    builder.addCase(fetchDispensingById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchDispensingById.fulfilled, (state, action) => {
      state.loading = false;
      state.dispensingDetails = action.payload;
    });
    builder.addCase(fetchDispensingById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { clearDispensingDetails } = dispensingSlice.actions
export default dispensingSlice.reducer;
