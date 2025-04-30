import axios from 'axios';

const API_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth Services
export const registerUser = async (userData) => {
  const response = await api.post('/user/register', userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await api.post('/user/login', userData);
  return response.data;
};

export const updateUserProfile = async (userData) => {
  const response = await api.put('/user', userData);
  return response.data;
};

export const topupBalance = async (topupData) => {
  const response = await api.post('/user/topup', topupData);
  return response.data;
};

// Store Services
export const getAllStores = async () => {
  const response = await api.get('/store/getAll');
  return response.data;
};

// Product Services
export const getAllItems = async () => {
  const response = await api.get('/item');
  return response.data.payload; // Menyesuaikan dengan struktur respons backend
};

export const getItemById = async (id) => {
  const response = await api.get(`/item/${id}`);
  return response.data.payload; // Menyesuaikan dengan struktur respons backend
};

export const getItemsByStoreId = async (storeId) => {
  const response = await api.get(`/item/byStoreId/${storeId}`);
  return response.data.payload; // Menyesuaikan dengan struktur respons backend
};

export const createItem = async (itemData, imageFile) => {
  const formData = new FormData();
  formData.append('name', itemData.name);
  formData.append('price', itemData.price);
  formData.append('store_id', itemData.store_id);
  formData.append('stock', itemData.stock);
  formData.append('image', imageFile);

  const response = await api.post('/item/create', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateItem = async (itemData, imageFile) => {
  const formData = new FormData();
  formData.append('id', itemData.id);
  formData.append('name', itemData.name);
  formData.append('price', itemData.price);
  formData.append('store_id', itemData.store_id);
  formData.append('stock', itemData.stock);
  if (imageFile) {
    formData.append('image', imageFile);
  }

  const response = await api.put('/item', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteItem = async (id) => {
  const response = await api.delete(`/item/${id}`);
  return response.data;
};

// Transaction Services
export const createTransaction = async (transactionData) => {
  const response = await api.post('/transaction/create', transactionData);
  return response.data;
};

export const payTransaction = async (transactionId) => {
  const response = await api.post(`/transaction/pay/${transactionId}`);
  return response.data;
};

export default api;