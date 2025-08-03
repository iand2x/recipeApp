import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Recipe } from '../../models/Recipe';
import sampleRecipes from '../../data/sampleRecipes.json';

const STORAGE_KEY = '@recipes';

interface RecipesState {
  recipes: Recipe[];
  loading: boolean;
  error: string | null;
  initialized: boolean;
  filter: {
    typeId: string | null;
  };
}

const initialState: RecipesState = {
  recipes: [],
  loading: false,
  error: null,
  initialized: false,
  filter: {
    typeId: 'all',
  },
};

// Async thunks
export const initializeRecipes = createAsyncThunk(
  'recipes/initialize',
  async () => {
    try {
      const recipesData = await AsyncStorage.getItem(STORAGE_KEY);
      const storedRecipes: Recipe[] = recipesData
        ? JSON.parse(recipesData)
        : [];

      // Always include sample recipes, but avoid duplicates by checking IDs
      const sampleRecipesList = sampleRecipes as Recipe[];
      const storedRecipeIds = new Set(storedRecipes.map(recipe => recipe.id));

      // Filter out sample recipes that already exist in storage
      const newSampleRecipes = sampleRecipesList.filter(
        sampleRecipe => !storedRecipeIds.has(sampleRecipe.id),
      );

      // Combine stored recipes with new sample recipes
      const allRecipes = [...storedRecipes, ...newSampleRecipes];

      // Save the combined list back to storage
      if (newSampleRecipes.length > 0) {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(allRecipes));
      }

      return allRecipes;
    } catch (error) {
      console.error('Error initializing recipes:', error);
      return [];
    }
  },
);

export const saveRecipe = createAsyncThunk(
  'recipes/save',
  async (recipe: Recipe, { getState }) => {
    try {
      const state = getState() as { recipes: RecipesState };
      const existingIndex = state.recipes.recipes.findIndex(
        r => r.id === recipe.id,
      );

      let updatedRecipes: Recipe[];
      if (existingIndex >= 0) {
        // Update existing recipe
        updatedRecipes = [...state.recipes.recipes];
        updatedRecipes[existingIndex] = recipe;
      } else {
        // Add new recipe
        updatedRecipes = [...state.recipes.recipes, recipe];
      }

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecipes));
      return { recipe, isNew: existingIndex < 0 };
    } catch (error) {
      console.error('Error saving recipe:', error);
      throw error;
    }
  },
);

export const deleteRecipe = createAsyncThunk(
  'recipes/delete',
  async (recipeId: string, { getState }) => {
    try {
      const state = getState() as { recipes: RecipesState };
      const updatedRecipes = state.recipes.recipes.filter(
        r => r.id !== recipeId,
      );

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecipes));
      return recipeId;
    } catch (error) {
      console.error('Error deleting recipe:', error);
      throw error;
    }
  },
);

const recipesSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<{ typeId?: string | null }>) => {
      if (action.payload.typeId !== undefined) {
        state.filter.typeId = action.payload.typeId;
      }
    },
    clearFilter: state => {
      state.filter.typeId = 'all';
    },
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      // Initialize recipes
      .addCase(initializeRecipes.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.recipes = action.payload;
        state.initialized = true;
      })
      .addCase(initializeRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to initialize recipes';
        state.initialized = true;
      })
      // Save recipe
      .addCase(saveRecipe.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveRecipe.fulfilled, (state, action) => {
        state.loading = false;
        const { recipe, isNew } = action.payload;

        if (isNew) {
          state.recipes.push(recipe);
        } else {
          const index = state.recipes.findIndex(r => r.id === recipe.id);
          if (index >= 0) {
            state.recipes[index] = recipe;
          }
        }
      })
      .addCase(saveRecipe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to save recipe';
      })
      // Delete recipe
      .addCase(deleteRecipe.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRecipe.fulfilled, (state, action) => {
        state.loading = false;
        state.recipes = state.recipes.filter(r => r.id !== action.payload);
      })
      .addCase(deleteRecipe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete recipe';
      });
  },
});

export const { setFilter, clearFilter, clearError } = recipesSlice.actions;
export default recipesSlice.reducer;
