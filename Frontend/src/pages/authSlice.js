import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "../utils/axiosClient";


// ======================================================
// REGISTER USER
// ======================================================

export const registerUserAPI = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      const response = await axiosClient.post(
        "/user/register",
        userData
      );

      return response.data.user;

    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "Registration failed"
      );
    }
  }
);


// ======================================================
// LOGIN USER
// ======================================================

export const loginUserAPI = createAsyncThunk(
  "auth/login",
  async (credential, thunkAPI) => {
    try {
      const response = await axiosClient.post(
        "/user/login",
        credential
      );

      return response.data.user;

    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "Login failed"
      );
    }
  }
);


// ======================================================
// CHECK AUTH / RESTORE USER AFTER REFRESH
// ======================================================

export const checkAuthAPI = createAsyncThunk(
  "auth/check",
  async (_, thunkAPI) => {
    try {
      const response = await axiosClient.get(
        "/user/getProfile",
        {
          withCredentials: true,
        }
      );

      return response.data.user;

    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "Not authenticated"
      );
    }
  }
);


// ======================================================
// LOGOUT USER
// ======================================================

export const logoutUserAPI = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      await axiosClient.post(
        "/user/logout",
        {},
        {
          withCredentials: true,
        }
      );

      delete axiosClient.defaults.headers.common["Authorization"];

      localStorage.clear();
      sessionStorage.clear();

      return null;

    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "Logout failed"
      );
    }
  }
);


// ======================================================
// FORGOT PASSWORD
// ======================================================

export const forgotPasswordAPI = createAsyncThunk(
  "auth/forget",
  async (data, thunkAPI) => {
    try {
      const response = await axiosClient.post(
        "/user/forgetPassword",
        data,
        {
          withCredentials: true,
        }
      );

      return response.data;

    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "Something went wrong"
      );
    }
  }
);


// ======================================================
// INITIAL STATE
// ======================================================

const initialState = {

  user: null,

  isAuthenticated: false,

  // App start hote hi getProfile check hoga
  loading: true,

  error: null,


  // Forgot Password State

  forgotLoading: false,

  forgotSuccess: false,

  forgotError: null,

  forgotMessage: null,
};


// ======================================================
// AUTH SLICE
// ======================================================

const authSlice = createSlice({

  name: "auth",

  initialState,

  reducers: {},

  extraReducers: (builder) => {

    builder


      // ==================================================
      // REGISTER
      // ==================================================

      .addCase(registerUserAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(registerUserAPI.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
        state.loading = false;
        state.error = null;
      })

      .addCase(registerUserAPI.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })


      // ==================================================
      // LOGIN
      // ==================================================

      .addCase(loginUserAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(loginUserAPI.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
        state.loading = false;
        state.error = null;
      })

      .addCase(loginUserAPI.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })


      // ==================================================
      // CHECK AUTH
      // ==================================================

      .addCase(checkAuthAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(checkAuthAPI.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
        state.loading = false;
        state.error = null;
      })

      .addCase(checkAuthAPI.rejected, (state) => {

        // User logged in nahi hai — normal condition
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;

      })


      // ==================================================
      // LOGOUT
      // ==================================================

      .addCase(logoutUserAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(logoutUserAPI.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      })

      .addCase(logoutUserAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })


      // ==================================================
      // FORGOT PASSWORD
      // ==================================================

      .addCase(forgotPasswordAPI.pending, (state) => {
        state.forgotLoading = true;
        state.forgotError = null;
        state.forgotSuccess = false;
        state.forgotMessage = null;
      })

      .addCase(forgotPasswordAPI.fulfilled, (state, action) => {
        state.forgotLoading = false;
        state.forgotSuccess = true;
        state.forgotError = null;
        state.forgotMessage = action.payload?.message;
      })

      .addCase(forgotPasswordAPI.rejected, (state, action) => {
        state.forgotLoading = false;
        state.forgotSuccess = false;
        state.forgotError =
          action.payload || "Something went wrong";
      });

  },

});


export default authSlice.reducer;