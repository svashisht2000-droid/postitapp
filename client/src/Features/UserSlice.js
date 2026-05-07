/*This file manages user-related state in the Redux store using Redux Toolkit. */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const initialState = {
  user: {}, //logged in user object
  isLoading: false,
  isSuccess: false,
  isError: false,
};
export const registerUser = createAsyncThunk(
  "users/registerUser",
  async (userData) => {
    try {
      const response = await axios.post("http://localhost:3001/registerUser", {
        name: userData.name,
        email: userData.email,
        password: userData.password,
      });
      console.log(response);
      const user = response.data.user;
      return user;
    } catch (error) {
      console.log(error);
    }
  },
);
export const login = createAsyncThunk("users/login", async (userData) => {
  try {
    const response = await axios.post("http://localhost:3001/login", {
      email: userData.email,
      password: userData.password,
    });
    const user = response.data.user;
    console.log(response);
    return user;
  } catch (error) {
    const errorMessage = "Invalid credentials";
    alert(errorMessage);
    throw new Error(errorMessage);
  }
});
export const logout = createAsyncThunk("users/logout", async () => {
  try {
    await axios.post("http://localhost:3001/logout");
  } catch (error) {
    console.log(error);
    throw error;
  }
});
export const updateUserProfile = createAsyncThunk(
  "users/updateUserProfile",
  async (userData) => {
    try {
      const response = await axios.put(
        `http://localhost:3001/updateUserProfile/${userData.email}`,
        {
          email: userData.email,
          name: userData.name,
          password: userData.password,
        },
      );
      const user = response.data.user;
      return user;
    } catch (error) {
      console.log(error);
    }
  },
);
export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(registerUser.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
    });
    builder.addCase(registerUser.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
    });
    builder.addCase(login.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
    });
    builder.addCase(logout.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.user = {};
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
    });
    builder.addCase(logout.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
    });
    builder.addCase(updateUserProfile.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    });
    builder.addCase(updateUserProfile.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
    });
    builder.addCase(updateUserProfile.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
    });
  },
});
export default userSlice.reducer;
