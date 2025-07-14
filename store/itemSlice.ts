import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL, API_ENDPOINTS } from './api';
import { Plant } from '../types';
import { RootState } from './index';

export const fetchItems = createAsyncThunk<Plant[], void, { state: RootState }>(
  'items/fetchItems',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.user.token;
    const response = await axios.get(BASE_URL + API_ENDPOINTS.items, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data.data as Plant[];
  }
);

interface ItemState {
  items: Plant[];
  loading: boolean;
  error: string | null;
}

const initialState: ItemState = {
  items: [],
  loading: false,
  error: null,
};

const itemSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        // Map _id to id for each plant
        state.items = (action.payload || []).map((plant: any) => ({
          ...plant,
          id: plant.id || plant._id, // ensure id is set
        }));
      })
      .addCase(fetchItems.rejected, (state, action) => { state.loading = false; state.error = action.error.message || null; });
  }
});

export default itemSlice.reducer; 