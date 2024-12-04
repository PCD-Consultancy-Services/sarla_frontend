import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axios";
import { generateErrorPayload } from "../../../utils/reduxErrorUtil";

const initialState = {
  allTanks: [],
  tank: [],
  loading: false,
  error: null,
  //pagination
  currentPage: 1,
  totalPages: 1,
  totalResults: 0,
  hasNextPage: null,
  hasPrevPage: null,
  pageSize: 10,
};

// fetch tanks
export const fetchTanks = createAsyncThunk(
  "users/fetchTanks",
  async ({ pageSize, page }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/tank/?pageSize=${pageSize}&page=${page}`
      );
      return response.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

// create tank
export const createTank = createAsyncThunk(
  "users/createTank",
  async (tankData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/tank`, tankData);
      return response.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

// get tank
export const getTankById = createAsyncThunk(
  "users/getTank",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/tank/${id}`);
      return response.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

// delete tank
export const deleteTank = createAsyncThunk(
  "tank/deleteTank",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/tank/${id}`);
      return response.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

// update tank
export const updateTank = createAsyncThunk(
  "users/updateTank",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/tank/${id}`, data);
      return response.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

// search tank
export const searchTank = createAsyncThunk(
  "services/searchTank",
  async ({ pageSize = 10, name }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/chemical/tank/search`,{
        params : {
          q : name,
          pageSize
        }
      });
      return response.data
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

const tankSlice = createSlice({
  name: "tanks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTanks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTanks.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allTanks = action.payload?.data?.results;
        // handling pagination
        state.totalResults = action.payload.data.totalResults;
        state.currentPage = action.payload.data.currentPage;
        state.totalPages = action.payload.data.totalPages;
        state.pageSize = action.payload.data.pageSize;
        state.hasNextPage = action.payload.data.hasNextPage;
        state.hasPrevPage = action.payload.data.hasPrevPage;
      })
      .addCase(fetchTanks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // create tank
      .addCase(createTank.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTank.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createTank.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //  get tank
      .addCase(getTankById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTankById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.tank = action.payload.data;
      })
      .addCase(getTankById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // delete tank
      .addCase(deleteTank.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTank.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteTank.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // update tank
      .addCase(updateTank.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTank.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateTank.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

       // search tank
       .addCase(searchTank.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchTank.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allTanks = action.payload.data.results;
      })
      .addCase(searchTank.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default tankSlice.reducer;
