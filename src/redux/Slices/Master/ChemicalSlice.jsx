import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axios";
import { generateErrorPayload } from "../../../utils/reduxErrorUtil";

const initialState = {
  allChemicals: [],
  chemical: [],
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

// search chemicals
export const searchChemicals = createAsyncThunk(
  "chemicals/searchChemicals",
  async (params, { rejectWithValue }) => {
    const { q ,page , pageSize } = params;
    console.log(q,page , pageSize, "0000000000000")
    try {
      const response = await axiosInstance.get("/chemical/search", {
        params: {
          q,
          page,
          pageSize
        },
      });
      return response.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

// fetch chemicals
export const fetchChemicals = createAsyncThunk(
  "chemicals/fetchChemicals",
  async ({ pageSize, page }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/recipe/get/chemical?pageSize=${pageSize}&page=${page}`
      );
      return response.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

// create chemicals
export const createChemical = createAsyncThunk(
  "chemicals/createChemical",
  async (chemicalData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/chemical`, chemicalData);
      return response.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

// get chemicals
export const getChemicalById = createAsyncThunk(
  "chemicals/getChemicalById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/chemical/${id}`);
      return response.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

// delete chemicals
export const deleteChemical = createAsyncThunk(
  "chemicals/deleteChemical",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/chemical/${id}`);
      return response.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

//update chemicals
export const updateChemical = createAsyncThunk(
  "chemicals/updateChemical",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/chemical/${id}`, data);
      return response.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

const chemicalSlice = createSlice({
  name: "chemical",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Search Chemicals
      .addCase(searchChemicals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchChemicals.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allChemicals = action.payload.data.results;

        //pagination
        state.totalResults = action.payload.data.totalResults;
        state.currentPage = action.payload.data.currentPage;
        state.totalPages = action.payload.data.totalPages;
        state.pageSize = action.payload.data.pageSize;
        state.hasNextPage = action.payload.data.hasNextPage;
        state.hasPrevPage = action.payload.data.hasPrevPage;
      })
      .addCase(searchChemicals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetch chemicals
      .addCase(fetchChemicals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChemicals.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allChemicals = action.payload.data.results;

        //pagination
        state.totalResults = action.payload.data.totalResults;
        state.currentPage = action.payload.data.currentPage;
        state.totalPages = action.payload.data.totalPages;
        state.pageSize = action.payload.data.pageSize;
        state.hasNextPage = action.payload.data.hasNextPage;
        state.hasPrevPage = action.payload.data.hasPrevPage;
      })
      .addCase(fetchChemicals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // create chemicals
      .addCase(createChemical.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createChemical.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createChemical.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // get chemicals
      .addCase(getChemicalById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getChemicalById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.chemical = action.payload.data;
      })
      .addCase(getChemicalById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // delete chemicals
      .addCase(deleteChemical.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteChemical.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteChemical.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //update chemicals
      .addCase(updateChemical.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateChemical.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateChemical.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default chemicalSlice.reducer;
