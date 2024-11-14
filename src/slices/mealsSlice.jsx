import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export const fetchMeals = createAsyncThunk("meals/fetchMeals", async () => {
  const res = await axios.get(
    "https://www.themealdb.com/api/json/v1/1/search.php?s="
  );
  return res.data.meals.map((meal) => ({
    ...meal,
    price: Math.floor(Math.random() * 50000),
  }));
});

const mealsSlice = createSlice({
  name: "meals",
  initialState: {
    items: [],
    loading: false,
    error: null,
    filteredItems: [],
    searchTerm: "",
    selectedCategory: "all",
    categories: [],
  },
  reducers: {
    setSearchTerm: (state, action) => {
      console.log(action.payload);

      state.filteredItems = state.items.filter(
        (item) =>
          item.strMeal.toLowerCase().includes(action.payload.toLowerCase()) &&
          (state.selectedCategory === "all" ||
            item.strCategory === state.selectedCategory)
      );
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
      state.filteredItems = state.items.filter(
        (item) =>
          (action.payload === "all" || action.payload === item.strCategory) &&
          item.strMeal.toLowerCase().includes(state.searchTerm.toLowerCase())
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMeals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMeals.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
        state.items = action.payload;
        state.filteredItems = state.items;

        state.categories = [
          "all",
          ...new Set(state.items.map((item) => item.strCategory)),
        ];
      })
      .addCase(fetchMeals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default mealsSlice.reducer;
export const { setSearchTerm, setSelectedCategory } = mealsSlice.actions;
