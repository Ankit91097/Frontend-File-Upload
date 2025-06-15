import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api"; // this should be your Axios instance

// 🔁 Async thunk to fetch documents (you can add more like uploadDocument, deleteDocument)
export const fetchDocuments = createAsyncThunk(
  "documents/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/documents");
      return res.data.documents;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || "Failed to load documents");
    }
  }
);

// 📦 Document slice
const documentSlice = createSlice({
  name: "documents",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearDocuments: (state) => {
      state.list = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDocuments } = documentSlice.actions;
export default documentSlice.reducer;
