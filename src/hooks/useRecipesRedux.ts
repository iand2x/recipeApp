import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  initializeRecipes,
  saveRecipe,
  deleteRecipe,
  setFilter,
  clearFilter,
  clearError,
} from '../store/slices/recipesSlice';
import {
  selectFilteredRecipes,
  selectRecipesLoading,
  selectRecipesError,
  selectRecipesInitialized,
  selectRecipesFilter,
  selectRecipeTypeCounts,
} from '../store/selectors/recipesSelectors';
import { Recipe } from '../models/Recipe';

export const useRecipesRedux = () => {
  const dispatch = useAppDispatch();

  // Selectors
  const recipes = useAppSelector(selectFilteredRecipes);
  const loading = useAppSelector(selectRecipesLoading);
  const error = useAppSelector(selectRecipesError);
  const initialized = useAppSelector(selectRecipesInitialized);
  const filter = useAppSelector(selectRecipesFilter);
  const typeCounts = useAppSelector(selectRecipeTypeCounts);

  // Initialize recipes on first load
  useEffect(() => {
    if (!initialized) {
      dispatch(initializeRecipes());
    }
  }, [dispatch, initialized]);

  // Actions
  const addNewRecipe = useCallback(
    async (recipe: Recipe) => {
      const result = await dispatch(saveRecipe(recipe));
      if (saveRecipe.fulfilled.match(result)) {
        return result.payload.recipe;
      }
      throw new Error(result.payload as string);
    },
    [dispatch],
  );

  const updateRecipe = useCallback(
    async (recipe: Recipe) => {
      const result = await dispatch(saveRecipe(recipe));
      if (saveRecipe.fulfilled.match(result)) {
        return result.payload.recipe;
      }
      throw new Error(result.payload as string);
    },
    [dispatch],
  );

  const removeRecipe = useCallback(
    async (recipeId: string) => {
      const result = await dispatch(deleteRecipe(recipeId));
      if (deleteRecipe.fulfilled.match(result)) {
        return result.payload;
      }
      throw new Error(result.payload as string);
    },
    [dispatch],
  );

  const setTypeFilter = useCallback(
    (typeId: string | null) => {
      dispatch(setFilter({ typeId }));
    },
    [dispatch],
  );

  const clearFilters = useCallback(() => {
    dispatch(clearFilter());
  }, [dispatch]);

  const clearErrorState = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    // Data
    recipes,
    loading,
    error,
    initialized,
    filter,
    typeCounts,

    // Actions
    addNewRecipe,
    updateRecipe,
    removeRecipe,
    setTypeFilter,
    clearFilters,
    clearErrorState,

    // For backward compatibility with existing code
    addRecipe: addNewRecipe,
    deleteRecipe: removeRecipe,
  };
};
