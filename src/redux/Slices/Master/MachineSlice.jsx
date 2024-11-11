import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axios";
import { generateErrorPayload } from "../../../utils/reduxErrorUtil";

const initialState = {
  allMachine: [],
  machine: [],
  loading: false,
  error: null,
  // handling pagination through this values (initial value) --
  currentPage: 1,
  totalPages: 1,
  totalResults: 0,
  hasNextPage: null,
  hasPrevPage: null,
  pageSize: 5,
};

// fetch Machine
export const fetchMachine = createAsyncThunk(
  "machine/fetchMachine",
  async ({ pageSize, page }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/machine/?pageSize=${pageSize}&page=${page}`
      );
      return response?.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

// create Machine
export const addMachine = createAsyncThunk(
  "machine/addMachine",
  async (machineData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/Machine`, machineData);
      return response.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

// Delete machine
export const deleteMachine = createAsyncThunk(
  "machine/deleteMachine",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/machine/${id}`);
      return response.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

//update machine
export const updateMachine = createAsyncThunk(
  "Machine/updateMachine",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/machine/${id}`, payload);
      return response.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

// get machine
export const getMachineById = createAsyncThunk(
  "machine/getMachine",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/machine/${id}`);
      return response.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

const machineSlice = createSlice({
  name: "machine",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch machine
      .addCase(fetchMachine.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMachine.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allMachine = action.payload.data.results;

        //pagination
        state.totalResults = action.payload.data.totalResults;
        state.currentPage = action.payload.data.currentPage;
        state.totalPages = action.payload.data.totalPages;
        state.pageSize = action.payload.data.pageSize;
        state.hasNextPage = action.payload.data.hasNextPage;
        state.hasPrevPage = action.payload.data.hasPrevPage;
      })
      .addCase(fetchMachine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // create machine
      .addCase(addMachine.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMachine.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(addMachine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete machine
      .addCase(deleteMachine.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMachine.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteMachine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // update machine
      .addCase(updateMachine.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMachine.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateMachine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // get machine
      .addCase(getMachineById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMachineById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.machine = action.payload.data;
      })
      .addCase(getMachineById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default machineSlice.reducer;
