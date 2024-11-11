import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axios";
import { generateErrorPayload } from "../../../utils/reduxErrorUtil";

const initialState = {
  allQualities: [],
  quality: [],
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

// fetch qualities
export const fetchQualities = createAsyncThunk(
  "quality/fetchQualities",
  async ({ pageSize, page }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/quality/`,
        {
          params:{
            pageSize,
            page
          }
        }
      );
      return response.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

// create quality
export const createQuality = createAsyncThunk(
  "quality/createQuality",
  async (qualityData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/quality`, qualityData);
      return response.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);


// get quality
export const getQualityById = createAsyncThunk(
  "quality/getQualityById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/quality/${id}`);
      return response.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

// delete quality
export const deleteQuality = createAsyncThunk(
  "quality/deleteQuality",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/quality/${id}`);
      return response;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

//update quality
export const updateQuality = createAsyncThunk(
  "quality/updateQuality",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/quality/${id}`, data);
      return response.data; // Return the actual data from the response
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);


// search quality
export const searchQuality = createAsyncThunk(
  "quality/searchQuality",
  async (params, { rejectWithValue }) => {
    const { qualityCode, qualityCodeManual , page , pageSize } = params;
    try {
      const response = await axiosInstance.get("/quality/search", {
        params: {
          qualityCode,
          qualityCodeManual,
          page,
          pageSize
        },
      });
      console.log(response, "get data");
      return response?.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

const qualitySlice = createSlice({
  name: "quality",
  initialState,
  reducers: {
    clearQualities: (state) => {
      state.allQualities = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQualities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQualities.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allQualities = action.payload.data.results;
        //pagination
        state.totalResults = action.payload.data.totalResults;
        state.currentPage = action.payload.data.currentPage;
        state.totalPages = action.payload.data.totalPages;
        state.pageSize = action.payload.data.pageSize;
        state.hasNextPage = action.payload.data.hasNextPage;
        state.hasPrevPage = action.payload.data.hasPrevPage;
      })
      .addCase(fetchQualities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // create qualities
      .addCase(createQuality.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createQuality.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createQuality.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // get qualities
      .addCase(getQualityById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getQualityById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.quality = action.payload.data;
      })
      .addCase(getQualityById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // delete qualities
      .addCase(deleteQuality.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteQuality.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteQuality.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //update qualities
      .addCase(updateQuality.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateQuality.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateQuality.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // search Qualities
    builder
      .addCase(searchQuality.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchQuality.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allQualities = action.payload.data.results;
      })
      .addCase(searchQuality.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

      
  },
});

export const { clearQualities } = qualitySlice.actions;
export default qualitySlice.reducer;
