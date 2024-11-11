// tempRecipeSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tempRecipe: {
    shadeId: "",
    qualityId: "",
    customerId: "",
    recipeType: "",
  },
  loading: false,
  error: null,
};

const tempRecipeSlice = createSlice({
  name: "tempRecipe",
  initialState,
  reducers: {
    setTempRecipe(state, action) {
      const { shadeId, qualityId, customerId, recipeType } = action.payload;
      state.error = null;
      state.loading = false;
      state.tempRecipe = {
        shadeId,
        qualityId,
        customerId,
        recipeType,
      };
    },
    // Add an action for updating shadeId only
    updateShadeId(state, action) {
      state.tempRecipe.shadeId = action.payload.shadeId;
    },
  },
});

export const { setTempRecipe, updateShadeId } = tempRecipeSlice.actions;
export default tempRecipeSlice.reducer;
