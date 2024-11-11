import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { generateErrorPayload } from "../../../utils/reduxErrorUtil";
import axiosInstance from "../../../utils/axios";

// Define the initial state
const initialState = {
  templates: [],
  allRecipes: [],
  receipe: null,
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalResults: 0,
  hasNextPage: null,
  hasPrevPage: null,
  pageSize: 5,
};

// initial state for updating the recipe

// Create an async thunk to fetch templates
export const fetchTemplates = createAsyncThunk(
  "recipes/fetchTemplates",
  async () => {
    try {
      const response = await axiosInstance.get("/recipe/get/template");
      // console.log(response, "templates+++++++++++++++++++++++++++++++++++++++");
      return response.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

// post receipe
export const createReceipe = createAsyncThunk(
  "recipes/createReceipe",
  async ({ formattedData }) => {
    try {
      const response = await axiosInstance.post("/recipe", formattedData);
      return response.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

// fetch receipe
export const fetchAllReceipe = createAsyncThunk(
  "recipes/fetchAllReceipe",
  async ({ pageSize, page }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/recipe/?pageSize=${pageSize}&page=${page}`
      );
      return response.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

// get receipe
export const getReceipe = createAsyncThunk("recipes/getReceipe", async (id) => {
  try {
    const response = await axiosInstance.get(`/recipe/${id}`);
    return response.data;
  } catch (error) {
    const errorPayload = generateErrorPayload(error);
    return rejectWithValue(errorPayload);
  }
});

//  deleteRecipe

export const deleteRecipe = createAsyncThunk(
  "recipe/deleteRecipe",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/recipe/${id}`);
      return response.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

// update receipe
export const updateReceipe = createAsyncThunk(
  "recipes/updateReceipe",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      console.log(id, payload, "i api call update");
      const response = await axiosInstance.put(`/recipe/${id}`, payload);
      return response.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

// update -- parent chemical managemnt --------------------------------------------------------------------------

export const addParentChemicalWhileUpdate = createAsyncThunk(
  "recipes/addParentChemicalWhileUpdate",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      console.log(id, payload, "i api call update");
      const response = await axiosInstance.post(
        `/recipe/${id}/parent-chemicals/`,
        payload
      );
      return response.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

export const updateParentChemicalWhileUpdate = createAsyncThunk(
  "recipes/updateParentChemicalWhileUpdate",
  async ({ id, parent_id, payload }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/recipe/${id}/parent-chemicals/${parent_id}`,
        payload
      );
      return response.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

export const deleteParentChemicalWhileUpdate = createAsyncThunk(
  "recipes/deleteParentChemicalWhileUpdate",
  async ({ id, parent_id }, { rejectWithValue }) => {
    try {
      console.log(id, parent_id);
      const response = await axiosInstance.delete(
        `/recipe/${id}/parent-chemicals/${parent_id}`
      );
      return response.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

// update - child chemical management ----------------------------------------------------------
export const addChildChemicalWhileUpdate = createAsyncThunk(
  "recipes/addChildChemicalWhileUpdate",
  async ({ id, parent_id, payload }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/recipe/${id}/parent-chemicals/${parent_id}/child-chemicals`,
        payload
      );
      return response.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

export const updateChildChemicalWhileUpdate = createAsyncThunk(
  "recipes/updateChildChemicalWhileUpdate",
  async ({ id, parent_id, child_id, payload }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/recipe/${id}/parent-chemicals/${parent_id}/child-chemicals/${child_id}`,
        payload
      );
      return response.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

export const deleteChildChemicalWhileUpdate = createAsyncThunk(
  "recipes/deleteChildChemicalWhileUpdate",
  async ({ id, parent_id, child_id, payload }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `/recipe/${id}/parent-chemicals/${parent_id}/child-chemicals/${child_id}`
      );
      return response.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

// Create the slice
const recipeSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch templates for recipe
      .addCase(fetchTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = action.payload.data.results;
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetch all receipe
      .addCase(fetchAllReceipe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllReceipe.fulfilled, (state, action) => {
        state.loading = false;
        state.allRecipes = action.payload.data.results;

        //pagination
        state.totalResults = action.payload.data.totalResults;
        state.currentPage = action.payload.data.currentPage;
        state.totalPages = action.payload.data.totalPages;
        state.pageSize = action.payload.data.pageSize;
        state.hasNextPage = action.payload.data.hasNextPage;
        state.hasPrevPage = action.payload.data.hasPrevPage;
      })
      .addCase(fetchAllReceipe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // create receipe
      .addCase(createReceipe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReceipe.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createReceipe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // delete shade
      .addCase(deleteRecipe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRecipe.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteRecipe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // update receipe
      .addCase(updateReceipe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReceipe.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateReceipe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // get receipe
      .addCase(getReceipe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReceipe.fulfilled, (state, action) => {
        state.loading = false;
        state.receipe = action.payload.data;
      })
      .addCase(getReceipe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // chemical management

      // ---( parent -> update / add)
      .addCase(addParentChemicalWhileUpdate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addParentChemicalWhileUpdate.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(addParentChemicalWhileUpdate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ---( parent -> update / update)
      .addCase(updateParentChemicalWhileUpdate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateParentChemicalWhileUpdate.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateParentChemicalWhileUpdate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ---( parent -> update / delete)
      .addCase(deleteParentChemicalWhileUpdate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteParentChemicalWhileUpdate.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteParentChemicalWhileUpdate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ---( child -> update / add)
      .addCase(addChildChemicalWhileUpdate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addChildChemicalWhileUpdate.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(addChildChemicalWhileUpdate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ---( child -> update / add)
      .addCase(updateChildChemicalWhileUpdate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateChildChemicalWhileUpdate.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateChildChemicalWhileUpdate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default recipeSlice.reducer;
