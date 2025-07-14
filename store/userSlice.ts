import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL, API_ENDPOINTS } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// User type matching backend
export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  image?: string | null;
  address: {
    area: string;
    ward: string;
    pinCode: string;
    city: string;
    state: string;
    country: string;
  };
  location: {
    latitude: number;
    longitude: number;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  fullAddress: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface SignupPayload {
  name: string;
  email: string;
  mobile: string;
  password: string;
  address: {
    area: string;
    ward: string;
    pinCode: string;
    city: string;
    state: string;
    country: string;
  };
  location: {
    latitude: number;
    longitude: number;
  };
}

interface UserState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export const restoreUser = createAsyncThunk<{ user: User; token: string } | null>(
  'user/restoreUser',
  async (_, thunkAPI) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const user = await AsyncStorage.getItem('userInfo');
      if (token && user) {
        return { token, user: JSON.parse(user) };
      }
      return null;
    } catch (error) {
      return null;
    }
  }
);

export const loginUser = createAsyncThunk<{ user: User; token: string }, LoginPayload>(
  'user/loginUser',
  async (payload, thunkAPI) => {
    try {
      const response = await axios.post(BASE_URL + API_ENDPOINTS.login, payload);
      // Persist to AsyncStorage
      await AsyncStorage.setItem('userToken', response.data.data.token);
      await AsyncStorage.setItem('userInfo', JSON.stringify(response.data.data.user));
      return {
        user: response.data.data.user,
        token: response.data.data.token,
      };
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const signupUser = createAsyncThunk<{ user: User; token: string }, SignupPayload>(
  'user/signupUser',
  async (payload, thunkAPI) => {
    try {
      // Convert payload to FormData
      const formData = new FormData();
      formData.append('email', payload.email);
      formData.append('mobile', payload.mobile);
      formData.append('ward', payload.address.ward);
      formData.append('name', payload.name);
      formData.append('password', payload.password);
      formData.append('pinCode', payload.address.pinCode);
      formData.append('area', payload.address.area);
      formData.append('city', payload.address.city);
      formData.append('state', payload.address.state);
      formData.append('country', payload.address.country);
      formData.append('latitude', String(payload.location.latitude));
      formData.append('longitude', String(payload.location.longitude));
      // If you want to support image upload, add here
      // if (payload.image) formData.append('image', payload.image);

      const response = await axios.post(BASE_URL + API_ENDPOINTS.signup, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // Persist to AsyncStorage
      await AsyncStorage.setItem('userToken', response.data.data.token);
      await AsyncStorage.setItem('userInfo', JSON.stringify(response.data.data.user));
      return {
        user: response.data.data.user,
        token: response.data.data.token,
      };
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Signup failed';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState: UserState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      AsyncStorage.removeItem('userToken');
      AsyncStorage.removeItem('userInfo');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => { state.loading = false; state.user = action.payload.user; state.token = action.payload.token; })
      .addCase(loginUser.rejected, (state, action) => { state.loading = false; state.error = (action.payload as string) || action.error.message || null; })
      .addCase(signupUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(signupUser.fulfilled, (state, action) => { state.loading = false; state.user = action.payload.user; state.token = action.payload.token; })
      .addCase(signupUser.rejected, (state, action) => { state.loading = false; state.error = (action.payload as string) || action.error.message || null; })
      .addCase(restoreUser.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
        }
      });
  }
});

export const { logout } = userSlice.actions;
export default userSlice.reducer; 