import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axios";

// fetch chemicals
export const fetchChemicalsUnits = createAsyncThunk(
  "chemicals/fetchChemicalsUnits",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`recipe/get/chemical/unit`);
      return response.data.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.message);
    }
  }
);

const chemicalUnitsSlice = createSlice({
  name: "chemicalUnits",
  initialState: {
    consumptionUnits: [],
    phUnits: [],
    densityUnits: [],
    conductivityUnits: [],
    viscosityUnits: [],
    ratioUnits: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChemicalsUnits.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchChemicalsUnits.fulfilled, (state, action) => {
        state.loading = false;

        state.consumptionUnits = action.payload.consumptionUnits;

        state.phUnits = action.payload.phUnits;

        state.densityUnits = action.payload.densityUnits;

        state.conductivityUnits = action.payload.conductivityUnits;

        state.viscosityUnits = action.payload.viscosityUnits;

        state.ratioUnits = action.payload.ratioUnits;


        


      })

      .addCase(fetchChemicalsUnits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  },
});

export default chemicalUnitsSlice.reducer;
