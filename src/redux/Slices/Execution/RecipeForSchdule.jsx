import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axios";
import { generateErrorPayload } from "../../../utils/reduxErrorUtil";

const initialState = {
  shades: [],
  qualities: [],
  customers: [],
  recipeTypes: [],
  recipeId: null,

  loading: false,
  error: null,
};

export const fetchShadeForSchedule = createAsyncThunk(
  "schedule/fetchRecipeForSchedule",
  async (_, { rejectWithValue }) => {
    try {
      let url = `/schedule/get/recipes?`;
      const response = await axiosInstance.get(url);
      console.log(response, "fetch shade");
      return response.data;
    } catch (error) {
      console.log(error);
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

export const fetchQualityForSchedule = createAsyncThunk(
  "schedule/fetchQualityForSchedule",
  async ({ shadeId }, { rejectWithValue }) => {
    console.log("log");
    try {
      let url = `/schedule/get/recipes?`;

      if (shadeId) url += `shadeId=${shadeId}`;

      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

export const fetchCustomerForSchedule = createAsyncThunk(
  "schedule/fetchCustomerForSchedule",
  async ({ shadeId, qualityId }, { rejectWithValue }) => {
    try {
      let url = `/schedule/get/recipes?`;
      const params = new URLSearchParams();

      if (shadeId) params.append("shadeId", shadeId);
      if (qualityId) params.append("qualityId", qualityId);

      url += params.toString();

      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

export const fetchRecipeTypeForSchedule = createAsyncThunk(
  "schedule/fetchRecipeTypeForSchedule",
  async (
    { shadeId, qualityId, customerId, recipeType },
    { rejectWithValue }
  ) => {
    try {
      let url = `/schedule/get/recipes?`;
      const params = new URLSearchParams();

      if (shadeId) params.append("shadeId", shadeId);
      if (qualityId) params.append("qualityId", qualityId);
      if (customerId) params.append("customerId", customerId);
      // if (recipeType) params.append("recipeType", recipeType);

      url += params.toString();

      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

export const fetchRecipeIdForSchedule = createAsyncThunk(
  "schedule/fetchRecipeIdForSchedule",
  async (
    { shadeId, qualityId, customerId, recipeType },
    { rejectWithValue }
  ) => {
    try {
      let url = `/schedule/get/recipes?`;
      const params = new URLSearchParams();

      if (shadeId) params.append("shadeId", shadeId);
      if (qualityId) params.append("qualityId", qualityId);
      if (customerId) params.append("customerId", customerId);
      if (recipeType) params.append("recipeType", recipeType);

      url += params.toString();

      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

const recipeForScheduleSlice = createSlice({
  name: "recipeForScheduleSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // shade data for schdeule
      .addCase(fetchShadeForSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShadeForSchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.shades = action.payload.data.results;
      })
      .addCase(fetchShadeForSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Quality data for schedule
      .addCase(fetchQualityForSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQualityForSchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.qualities = action.payload.data.results;
      })
      .addCase(fetchQualityForSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Customer data for schedule
      .addCase(fetchCustomerForSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerForSchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.customers = action.payload.data.results;
      })
      .addCase(fetchCustomerForSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Recipe type for schedule
      .addCase(fetchRecipeTypeForSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipeTypeForSchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.recipeTypes= action.payload.data.results;
      })
      .addCase(fetchRecipeTypeForSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // get recipe id from recipe type for the schedule
      .addCase(fetchRecipeIdForSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipeIdForSchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.recipeId= action.payload.data.results;
      })
      .addCase(fetchRecipeIdForSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default recipeForScheduleSlice.reducer;
