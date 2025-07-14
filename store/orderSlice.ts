import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from './api';
import { RootState } from './index';

// Types
export interface OrderItem {
  item: string; // item/product id
  quantity: number;
  price: number;
}

export interface DeliveryAddress {
  area: string;
  ward: string;
  pinCode: string;
  city: string;
  state: string;
  country: string;
  contactPhone: string;
  contactName: string;
}

export interface Order {
  _id: string;
  paymentMethod: string | null;
  deliveryAddress: DeliveryAddress;
  items: OrderItem[];
  notes?: string;
  orderNumber: string;
  estimatedDelivery: string;
  user: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
};

export const createOrder = createAsyncThunk<any, Partial<Order>, { state: RootState }>(
  'orders/createOrder',
  async (order, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.user.token;
    const response = await axios.post(`${BASE_URL}/orders/create`, order, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data.data;
  }
);

export const fetchMyOrders = createAsyncThunk<Order[], void, { state: RootState }>(
  'orders/fetchMyOrders',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.user.token;
    const response = await axios.get(`${BASE_URL}/orders/my-orders`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data.orders; // use .orders, not .data
  }
);

export const fetchOrderById = createAsyncThunk<Order, string, { state: RootState }>(
  'orders/fetchOrderById',
  async (orderId, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.user.token;
    const response = await axios.get(`${BASE_URL}/orders/${orderId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data.data as Order;
  }
);

export const cancelOrder = createAsyncThunk<Order, string, { state: RootState }>(
  'orders/cancelOrder',
  async (orderId, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.user.token;
    const response = await axios.patch(`${BASE_URL}/orders/${orderId}/cancel`, {}, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data.data as Order;
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createOrder.fulfilled, (state, action) => { state.loading = false; state.currentOrder = action.payload; })
      .addCase(createOrder.rejected, (state, action) => { state.loading = false; state.error = action.error.message || null; })
      .addCase(fetchMyOrders.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchMyOrders.fulfilled, (state, action) => { state.loading = false; state.orders = action.payload; })
      .addCase(fetchMyOrders.rejected, (state, action) => { state.loading = false; state.error = action.error.message || null; })
      .addCase(fetchOrderById.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchOrderById.fulfilled, (state, action) => { state.loading = false; state.currentOrder = action.payload; })
      .addCase(fetchOrderById.rejected, (state, action) => { state.loading = false; state.error = action.error.message || null; })
      .addCase(cancelOrder.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(cancelOrder.fulfilled, (state, action) => { state.loading = false; state.currentOrder = action.payload; })
      .addCase(cancelOrder.rejected, (state, action) => { state.loading = false; state.error = action.error.message || null; });
  }
});

export default orderSlice.reducer; 