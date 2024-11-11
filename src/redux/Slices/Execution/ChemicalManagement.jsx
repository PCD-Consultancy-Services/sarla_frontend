import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axios";
import { generateErrorPayload } from "../../../utils/reduxErrorUtil";

const initialState = {
  parentChemicals: [],
  loading: false,
  error: null,
};

export const fetchTemplateById = createAsyncThunk(
  "recipes/fetchTemplateById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/recipe/get/template/${id}`);
      console.log(response, "--")
      return response.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

const templateManagement = createSlice({
  name: "templateManagement",
  initialState,
  reducers: {
    // parent crud
    // addParentChemical: (state, action) => {
    //   state.parentChemicals.push(action.payload);
    // },

    // updateParentChemical: (state, action) => {
    //   const { index, updatedData } = action.payload;
    //   console.log(index, updatedData, "updatechek");
    //   if (state.parentChemicals[index]) {
    //     state.parentChemicals[index] = {
    //       ...state.parentChemicals[index],
    //       ...updatedData,
    //     };
    //   }
    // },

    deleteParentChemical: (state, action) => {
      const index = action.payload;
      if (state.parentChemicals[index]) {
        state.parentChemicals.splice(index, 1);
      }
    },

    // child crud
    addChildChemical: (state, action) => {
      const { parentIndex, childChemical } = action.payload;
      console.log(childChemical, "--chikl");
      if (state.parentChemicals[parentIndex]) {
        if (!state.parentChemicals[parentIndex].childChemicals) {
          state.parentChemicals[parentIndex].childChemicals = [];
        }
        state.parentChemicals[parentIndex].childChemicals.push(childChemical);
      }
    },

    // sub child
    addSubChildChemical: (state, action) => {
      const { parentIndex, childIndex, subChildChemical } = action.payload;
      console.log(parentIndex, childIndex, subChildChemical, "yyyyy");
      if (state.parentChemicals[parentIndex]?.childChemicals) {
        // Insert the subChildChemical after the specified childIndex
        state.parentChemicals[parentIndex].childChemicals.splice(childIndex + 1, 0, subChildChemical);
      }
    },

    updateChildChemical: (state, action) => {
      const { parentIndex, childIndex, updatedChild } = action.payload;
      if (state.parentChemicals[parentIndex]?.childChemicals[childIndex]) {
        state.parentChemicals[parentIndex].childChemicals[childIndex] = {
          ...state.parentChemicals[parentIndex].childChemicals[childIndex],
          ...updatedChild,
        };
      }
    },

    deleteChildChemical: (state, action) => {
      const { parentIndex, childIndex } = action.payload;
      if (state.parentChemicals[parentIndex]?.childChemicals[childIndex]) {
        state.parentChemicals[parentIndex].childChemicals.splice(childIndex, 1);
      }
    },

    clearChemicalData: (state) => {
      state.parentChemicals = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTemplateById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // .addCase(fetchTemplateById.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.parentChemicals = action.payload.data.chemicals.map(
      //     (chemical) => ({
      //       ...chemical,
      //       childChemicals: [],
      //     })
      //   );
      // })
      .addCase(fetchTemplateById.fulfilled, (state, action) => {
        state.loading = false;
        
        // Merge the new parent chemical with the existing ones
        state.parentChemicals.push({
          _id: action.payload.data._id,
          name: action.payload.data.name,
          key: action.payload.data.key,
          childChemicals: action.payload.data.chemicals.map(chemical => ({
            ...chemical,
            chemicalId: chemical.chemicalId._id,
            name: chemical.chemicalId.name,
          }))
        });
      })
      
      
      .addCase(fetchTemplateById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  addChildChemical,
  addSubChildChemical,
  updateChildChemical,
  deleteParentChemical,
  deleteChildChemical,
  clearChemicalData
} = templateManagement.actions;
export default templateManagement.reducer;
