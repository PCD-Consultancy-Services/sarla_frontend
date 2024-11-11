import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axios";
import { generateErrorPayload } from "../../../utils/reduxErrorUtil";

const initialState = {
  allschedule: [],
  schedule: null,
  machineNames: [],
  cardBatches: [],
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

// fetch schedule
export const fetchSchedule = createAsyncThunk(
  "schedule/fetchSchedule",
  async ({ pageSize, page }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/schedule/?pageSize=${pageSize}&page=${page}`
      );
      return response.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

// create schedule
export const createSchedule = createAsyncThunk(
  "schedule/createSchedule",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/schedule`, payload);
      return response.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

// get Customer
export const getScheduleById = createAsyncThunk(
  "schedule/getScheduleById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/schedule/${id}`);
      return response.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

// delete schedule
export const deleteSchedule = createAsyncThunk(
  "schedule/deleteSchedule",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/schedule/${id}`);
      return response.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

// update Customer
export const updateSchedule = createAsyncThunk(
  "schedule/updateSchedule",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/schedule/${id}`, data);
      return response.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

// searchSchedule action
export const searchSchedule = createAsyncThunk(
  "schedule/searchSchedule",
  async (params, { rejectWithValue }) => {
    const { shadeCode, color } = params;
    try {
      const response = await axiosInstance.get("/schedule/search", {
        params: {
          shadeCode,
          color,
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

// Get Machine
export const fetchMachines = createAsyncThunk(
  "schedule/fetchMachines",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/schedule/get/machines");
      console.log(response?.data, "this is data of machine");
      return response.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

// fetch card batches
export const fetchCardBatches = createAsyncThunk(
  "schedule/fetchCardBatches",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/schedule/get/cardbatches");
      return response.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSchedule.fulfilled, (state, action) => {
        state.loading = false
        state.error = null;
        state.allschedule = action.payload.data.results;
        //pagination
        state.totalResults = action.payload.data.totalResults;
        state.currentPage = action.payload.data.currentPage;
        state.totalPages = action.payload.data.totalPages;
        state.pageSize = action.payload.data.pageSize;
        state.hasNextPage = action.payload.data.hasNextPage;
        state.hasPrevPage = action.payload.data.hasPrevPage;
      })
      .addCase(fetchSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // create Schedule
      .addCase(createSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSchedule.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //  get Schedule
      .addCase(getScheduleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getScheduleById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.schedule = action.payload.data;
      })
      .addCase(getScheduleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // delete Schedule
      .addCase(deleteSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSchedule.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // update Schedule
      .addCase(updateSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSchedule.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // search Schedule
    builder
      .addCase(searchSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchSchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allschedule = action.payload.data.results;
      })
      .addCase(searchSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Machine
      .addCase(fetchMachines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMachines.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Assuming you want to store machine names in a new state property
        state.machineNames = action.payload.data.results;
      })
      .addCase(fetchMachines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchCardBatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCardBatches.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.cardBatches = action.payload.data.cardBatches;
      })
      .addCase(fetchCardBatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

  },
});

export default scheduleSlice.reducer;
