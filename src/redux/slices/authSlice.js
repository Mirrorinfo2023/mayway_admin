import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { login as loginApi, checkToken } from "@/api/apicall/auth";

// Async thunk to verify token
export const verifyToken = createAsyncThunk("auth/verifyToken", async (token, { rejectWithValue }) => {
  try {
    // Use the specific token provided
    const response = await checkToken();
    return response;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Token verification failed");
  }
});

// Async thunk to log in the user
export const loginUser = createAsyncThunk("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await loginApi(credentials);
    console.log("Login API Response:", response);
    return response;
  } catch (error) {
    console.error("Login Error:", error);
    return rejectWithValue(error.response?.data?.message || "Login failed");
  }
});

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.persistent = false;
      setStoredToken(null);
      setupAxiosInterceptors(null);
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      .addCase(verifyToken.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log(action.payload.valid);
        if (action.payload.valid) {
          state.isAuthenticated = true;
        }
      })
      .addCase(verifyToken.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        setStoredToken(null);
        setupAxiosInterceptors(null);
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthUser = (state) => state.auth.user;
export const selectAuthToken = (state) => state.auth.token;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;
