import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axios";
import { generateErrorPayload } from "../../../utils/reduxErrorUtil";

const initialState = {
  recipeTypes: [],
  loading: false,
  error: null,
};
// fetch recipes
export const fetchRecipesUnits = createAsyncThunk(
  "recipes/fetchRecipeUnits",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/recipe/units`);
      console.log(response,"response")
      return response.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

const recipeUnitsSlice = createSlice({
  name: "recipeUnits",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipesUnits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipesUnits.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.recipeTypes = action.payload.data.recipeTypes;
      })
      .addCase(fetchRecipesUnits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default recipeUnitsSlice.reducer;
