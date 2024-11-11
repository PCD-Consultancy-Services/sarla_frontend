import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axios";
import { generateErrorPayload } from "../../../utils/reduxErrorUtil";

const initialState = {
  allMasterTemplate: [],
  masterTemplate: [],
  loading: false,
  error: null,
  //pagination
  currentPage: 1,
  totalPages: 1,
  totalResults: 0,
  hasNextPage: null,
  hasPrevPage: null,
  pageSize: 5,
};

// fetch Master Template
export const fetchMasterTemplate = createAsyncThunk(
  "masterTemplate/fetchMasterTemplate",
  async ({ pageSize, page }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/master-template/?pageSize=${pageSize}&page=${page}`
      );
      return response?.data;
    } catch (error) {
      console.log(error);
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

// create masterTemplate
export const addMasterTemplate = createAsyncThunk(
  "masterTemplate/addMasterTemplate",
  async (masterTemplateData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/master-template`,
        masterTemplateData
      );
      return response.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

// Delete MasterTemplate

export const deleteMasterTemplate = createAsyncThunk(
  "MasterTemplate/deleteMasterTemplate",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/master-template/${id}`);
      console.log(response, "response");
      return response?.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

//update masterTemplate
export const updateMasterTemplate = createAsyncThunk(
  "MasterTemplate/updateMasterTemplate",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      console.log(id, payload);
      const response = await axiosInstance.put(
        `/master-template/${id}`,
        payload
      );
      return response?.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

// get masterTemplate
export const getMasterTemplateById = createAsyncThunk(
  "MasterTemplate/getMasterTemplate",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/master-template/${id}`);
      return response?.data;
    } catch (error) {
      console.log(error, "error from rtk ");
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

const masterTemplateSlice = createSlice({
  name: "masterTemplate",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch masterTemplate
      .addCase(fetchMasterTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMasterTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.allMasterTemplate = action.payload.data.results;

        state.totalResults = action.payload.data.totalResults;
        state.currentPage = action.payload.data.currentPage;
        state.totalPages = action.payload.data.totalPages;
        state.pageSize = action.payload.data.pageSize;
        state.hasNextPage = action.payload.data.hasNextPage;
        state.hasPrevPage = action.payload.data.hasPrevPage;
      })
      .addCase(fetchMasterTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // create masterTemplate
      .addCase(addMasterTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMasterTemplate.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(addMasterTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete masterTemplate

      .addCase(deleteMasterTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMasterTemplate.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteMasterTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // update masterTemplate
      .addCase(updateMasterTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMasterTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateMasterTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // get masterTemplate
      .addCase(getMasterTemplateById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMasterTemplateById.fulfilled, (state, action) => {
        state.loading = false;
        state.masterTemplate = action.payload.data;
      })
      .addCase(getMasterTemplateById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default masterTemplateSlice.reducer;
