import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
const getStoredUsers = () => {
  const users = localStorage.getItem("users");
  return users ? JSON.parse(users) : [];
};

const storeUser = (user) => {
  const users = getStoredUsers();
  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));
};

export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    const users = getStoredUsers();
    if (users.find((user) => user.username === userData.username)) {
      return rejectWithValue("این نام کاربری قبلا ثبت نام کرده است!");
    }
    const newUser = {
      id: Date.now(),
      username: userData.username,
      password: userData.password,
    };
    users.push(newUser);
    storeUser(newUser);
    return newUser;
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (credential, { rejectByValue }) => {
    const users = getStoredUsers();
    const isExistUser = users.find(
      (user) =>
        user.username === credential.username &&
        user.password === credential.password
    );
    if (isExistUser) {
      return isExistUser;
    } else {
      return rejectByValue("نام کاربری یا رمز عبور اشتباه هست!");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
    isLoggedIn: false,
  },
  reducers: {
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
        state.isLoggedIn = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.isLoggedIn = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default authSlice.reducer;
export const { logout } = authSlice.actions;
