import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axios";

// fetch quality units
export const fetchQualityUnits = createAsyncThunk(
  "quality/fetchQualityUnits",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/quality/units`);
      return response.data.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.message);
    }
  }
);

const qualityUnitsSlice = createSlice({
  name: "qualityUnits",
  initialState: {
    // process: [],
    // lustre: [],
    productCategories: [],
    processes: [],
    lustres: [],
    qualities: [],
    shadePrefixes: [],
    denierPrefix: "D",
    filamentPrefix: "F",
    plyPrefix: "P",
    lubricated: "LUB",

    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQualityUnits.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchQualityUnits.fulfilled, (state, action) => {
        state.loading = false;

        state.productCategories = action.payload.productCategories;
        state.processes = action.payload.processes;
        state.lustres = action.payload.lustres;
        state.qualities = action.payload.qualities;
        state.shadePrefixes = action.payload.shadePrefixes;
        state.denierPrefix = action.payload.denierPrefix;
        state.filamentPrefix = action.payload.filamentPrefix;
        state.plyPrefix = action.payload.plyPrefix;
        state.lubricated = action.payload.lubricated;
      })

      .addCase(fetchQualityUnits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  },
});

export default qualityUnitsSlice.reducer;
