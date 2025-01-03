import { RootState } from '@/store';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import { User } from '@/types/User';
import { Api } from '@/services/Api';

type UserState = {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
};

const initialState: UserState = {
  token: null,
  user: null,
  loading: false,
  error: null,
};

// Async thunk for fetching user profile
export const findUser = createAsyncThunk(
  'user/login',
  async ({username, password}: {username: string; password: string}, { rejectWithValue }) => {
    try {
      const client = new Api({ baseURL: 'http://localhost:3000' });
      const reponse = await client.api.loginCreate({ username, password });
      const { token, user } = reponse.data; 
      return { token, user };

    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user profile');
    }
  }
);

export const logout = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      const client = new Api({ baseURL: 'http://localhost:3000' });
      await client.api.logoutList();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to logout');
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/update',
  async (user: User, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.user.token!;

      const client = new Api({ baseURL: 'http://localhost:3000' });
      await client.api.usersUpdate(user);

      return { ...user, token };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user profile');
    }
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(findUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(findUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token!;
        state.user = action.payload.user! as User;
      })
      .addCase(findUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.token = null;
        state.user = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const {  } = userSlice.actions;
export default userSlice.reducer;
