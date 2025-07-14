import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL, API_ENDPOINTS } from './api';
import { RootState } from './index';

// API response type
interface ApiCategory {
  _id: string;
  name: string;
  nameGujarati?: string;
  icon?: string;
}

// Redux state type
interface Category {
  key: string;
  english: string;
  gujarati: string;
  icon?: string;
}

export const fetchCategories = createAsyncThunk<ApiCategory[], void, { state: RootState }>(
  'categories/fetchCategories',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.user.token;
    const response = await axios.get(BASE_URL + API_ENDPOINTS.categories, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data.data as ApiCategory[];
  }
);

const initialState = {
  categories: [] as Category[],
  loading: false,
  error: null as string | null,
};

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        // Map API categories to expected structure and prepend 'All'
        const apiCategories = (action.payload || []).map((cat) => ({
          key: cat._id,
          english: cat.name,
          gujarati: cat.nameGujarati || cat.name,
          icon: cat.icon,
        }));
        state.categories = [
          { key: 'All', english: 'All', gujarati: 'બધા' },
          ...apiCategories
        ];
      })
      .addCase(fetchCategories.rejected, (state, action) => { state.loading = false; state.error = action.error.message || null; });
  }
});

export default categorySlice.reducer; 