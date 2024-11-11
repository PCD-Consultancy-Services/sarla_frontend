import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axios";
import { PAGE_SIZE } from "../../../constants";
import { generateErrorPayload } from "../../../utils/reduxErrorUtil";

const initialState =  {
  allClassification: [],
  classification:[],
  loading: false,
  error: null,
     // handling pagination 
  currentPage: 1,
  totalPages: 1,
  totalResults: 0,
  hasNextPage : null, 
  hasPrevPage : null,
  pageSize: 5, 
};

// fetch classification
export const fetchClassification = createAsyncThunk(
  "classifications/fetchClassification",
  async ({ pageSize , page }, { rejectWithValue }) => {
    try {
      console.log("hey")
      const response = await axiosInstance.get(`/classification/?pageSize=${pageSize}&page=${page}`);
      return response?.data;
    } catch (error) {
      console.log(error);
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);     
    }
  }
);

// create classification
export const addClassification = createAsyncThunk(
  "classifications/addClassification",
  async (classificationData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/classification`,
        classificationData
      );
      console.log(response?.data, "in slice");
      return response?.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);     
    }
  }
);

// Delete classification

export const deleteClassification = createAsyncThunk(
  "classifications/deleteClassification",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/classification/${id}`);

      return response?.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);     
    }
  }
);

//update classification
export const updateClassification = createAsyncThunk(
  "classifications/updateClassification",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      console.log(id, payload);
      const response = await axiosInstance.put(
        `/classification/${id}`,
        payload
      );
      return response?.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);     
    }
  }
);

// get classification
export const getClassificationById = createAsyncThunk(
  "classifications/getClassification",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/classification/${id}`);
      return response?.data;
    } catch (error) {
      console.log(error, "error from rtk ");
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);     
    }
  }
);

const classificationSlice = createSlice({
  name: "classification",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch classsfication
      .addCase(fetchClassification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClassification.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allClassification = action.payload.data.results;
        
        // handling pagination
        state.totalResults = action.payload.data.totalResults;
        state.currentPage = action.payload.data.currentPage;
        state.totalPages = action.payload.data.totalPages;
        state.pageSize = action.payload.data.pageSize;
        state.hasNextPage = action.payload.data.hasNextPage;
        state.hasPrevPage = action.payload.data.hasPrevPage;
      })
      .addCase(fetchClassification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // create classsfication
      .addCase(addClassification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addClassification.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(addClassification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete classsfication

      .addCase(deleteClassification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteClassification.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteClassification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // update classsfication
      .addCase(updateClassification.pending, (state) => {
        state.loading = true;
        state.error = null;
      
      })
      .addCase(updateClassification.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateClassification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // get classsfication
      .addCase(getClassificationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getClassificationById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.classification = action.payload.data;
      })
      .addCase(getClassificationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default classificationSlice.reducer;
