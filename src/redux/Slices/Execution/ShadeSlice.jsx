import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axios";
import { generateErrorPayload } from "../../../utils/reduxErrorUtil";

const initialState = {
  allShade: [],
  shade: null,
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

// fetch Shade
export const fetchShade = createAsyncThunk(
  "shade/fetchShade",
  async ({ pageSize, page }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/shade/?pageSize=${pageSize}&page=${page}`
      );
      return response.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

// create Shade
export const createShade = createAsyncThunk(
  "shade/createShade",
  async (shadeData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/shade`, shadeData);
      return response.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

// get Customer
export const getShadeById = createAsyncThunk(
  "Shade/getShadeById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/shade/${id}`);
      return response.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

// delete Shade
export const deleteShade = createAsyncThunk(
  "users/deleteShade",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/shade/${id}`);
      return response.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

// update Customer
export const updateShade = createAsyncThunk(
  "Shade/updateShade",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/shade/${id}`, data);
      return response.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

// searchShade action
export const searchShade = createAsyncThunk(
  "shade/searchShade",
  async (params, { rejectWithValue }) => {
    const { shadeCode, color , page , pageSize } = params;
    try {
      const response = await axiosInstance.get("/shade/search", {
        params: {
          shadeCode,
          color,
          page,
          pageSize
        },
      });
      console.log(response, "get data");
      return response.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);
const shadeSlice = createSlice({
  name: "shade",
  initialState,
  reducers: {
    clearShades: (state) => {
      state.allShade = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShade.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShade.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allShade = action.payload.data.results;
        //pagination
        state.totalResults = action.payload.data.totalResults;
        state.currentPage = action.payload.data.currentPage;
        state.totalPages = action.payload.data.totalPages;
        state.pageSize = action.payload.data.pageSize;
        state.hasNextPage = action.payload.data.hasNextPage;
        state.hasPrevPage = action.payload.data.hasPrevPage;
      })
      .addCase(fetchShade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // create shade
      .addCase(createShade.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createShade.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createShade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //  get shade
      .addCase(getShadeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getShadeById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.shade = action.payload.data;
      })
      .addCase(getShadeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // delete shade
      .addCase(deleteShade.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteShade.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteShade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // update shade
      .addCase(updateShade.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateShade.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateShade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // search shade
    builder
      .addCase(searchShade.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchShade.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allShade = action.payload.data.results;
      })
      .addCase(searchShade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearShades } = shadeSlice.actions;
export default shadeSlice.reducer;
