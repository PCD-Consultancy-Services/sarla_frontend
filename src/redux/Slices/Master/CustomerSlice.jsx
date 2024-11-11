import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axios";
import { generateErrorPayload } from "../../../utils/reduxErrorUtil";

const initialState = {
  allCustomers: [],
  customer: [],
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

// fetch Customer
export const fetchCustomers = createAsyncThunk(
  "customer/fetchCustomer",
  async ({ pageSize, page }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/customer/?pageSize=${pageSize}&page=${page}`
      );
      return response.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

// create Customer
export const createCustomer = createAsyncThunk(
  "users/createCustomer",
  async (customerData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/customer`, customerData);
      return response.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

// get Customer
export const getCustomerById = createAsyncThunk(
  "users/getCustomerById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/customer/${id}`);
      return response.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

// delete Customer
export const deleteCustomer = createAsyncThunk(
  "users/deleteCustomer",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/customer/${id}`);
      return response.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

// update Customer
export const updateCustomer = createAsyncThunk(
  "users/updateCustomer",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/customer/${id}`, data);
      return response.data;
    } catch (error) {
      const errorPayload = generateErrorPayload(error);
      return rejectWithValue(errorPayload);
    }
  }
);

// search Customer
export const searchCustomer = createAsyncThunk(
  "customer/searchCustomer",
  async (params, { rejectWithValue }) => {
    const { name, custCode ,page , pageSize } = params;
    try {
      const response = await axiosInstance.get("/customer/search", {
        params: {
          name,
          custCode,
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


const customerSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    clearCustomers : (state) => {
      state.allCustomers = []
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allCustomers = action.payload.data.results;
        //pagination
        state.totalResults = action.payload.data.totalResults;
        state.currentPage = action.payload.data.currentPage;
        state.totalPages = action.payload.data.totalPages;
        state.pageSize = action.payload.data.pageSize;
        state.hasNextPage = action.payload.data.hasNextPage;
        state.hasPrevPage = action.payload.data.hasPrevPage;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // create customer
      .addCase(createCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCustomer.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //  get customer
      .addCase(getCustomerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCustomerById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.customer = action.payload.data;
      })
      .addCase(getCustomerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // delete customer
      .addCase(deleteCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCustomer.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // update customer
      .addCase(updateCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCustomer.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

          // search customer
    builder
    .addCase(searchCustomer.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(searchCustomer.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.allCustomers = action.payload.data.results;
    })
    .addCase(searchCustomer.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

  },
});

export const { clearCustomers} = customerSlice.actions
export default customerSlice.reducer;
