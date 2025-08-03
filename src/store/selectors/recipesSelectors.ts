import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';
import recipeTypes from '../../data/recipetypes.json';

// Base selectors
export const selectRecipes = (state: RootState) => state.recipes.recipes;
export const selectRecipesLoading = (state: RootState) => state.recipes.loading;
export const selectRecipesError = (state: RootState) => state.recipes.error;
export const selectRecipesInitialized = (state: RootState) =>
  state.recipes.initialized;
export const selectRecipesFilter = (state: RootState) => state.recipes.filter;

// Memoized selectors
export const selectFilteredRecipes = createSelector(
  [selectRecipes, selectRecipesFilter],
  (recipes, filter) => {
    let filtered = recipes;

    // Filter by type
    if (filter.typeId && filter.typeId !== 'all') {
      filtered = filtered.filter(recipe => recipe.typeId === filter.typeId);
    }

    return filtered;
  },
);

export const selectRecipeById = createSelector(
  [selectRecipes, (state: RootState, recipeId: string) => recipeId],
  (recipes, recipeId) => recipes.find(recipe => recipe.id === recipeId),
);

export const selectRecipesByType = createSelector([selectRecipes], recipes => {
  const recipesByType: Record<string, typeof recipes> = {};

  recipeTypes.forEach(type => {
    recipesByType[type.id] = recipes.filter(
      recipe => recipe.typeId === type.id,
    );
  });

  return recipesByType;
});

export const selectRecipeTypeCounts = createSelector(
  [selectRecipes],
  recipes => {
    const counts: Record<string, number> = {};

    recipeTypes.forEach(type => {
      counts[type.id] = recipes.filter(
        recipe => recipe.typeId === type.id,
      ).length;
    });

    // Add total count
    counts.all = recipes.length;

    return counts;
  },
);

export const selectRecipeStats = createSelector([selectRecipes], recipes => ({
  total: recipes.length,
  averageIngredients:
    recipes.length > 0
      ? Math.round(
          recipes.reduce((sum, recipe) => sum + recipe.ingredients.length, 0) /
            recipes.length,
        )
      : 0,
  averageSteps:
    recipes.length > 0
      ? Math.round(
          recipes.reduce((sum, recipe) => sum + recipe.steps.length, 0) /
            recipes.length,
        )
      : 0,
  mostCommonType:
    recipes.length > 0
      ? Object.entries(
          recipes.reduce((acc, recipe) => {
            acc[recipe.typeId] = (acc[recipe.typeId] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
        ).sort(([, a], [, b]) => b - a)[0]?.[0] || null
      : null,
}));
