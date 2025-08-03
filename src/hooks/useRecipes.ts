import { useState, useEffect, useCallback } from 'react';
import { Recipe } from '../models/Recipe';
import {
  getRecipes,
  addRecipe,
  updateRecipe,
  deleteRecipe,
} from '../storage/storage';

export const useRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRecipes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRecipes();
      setRecipes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load recipes');
      console.error('Error loading recipes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addNewRecipe = useCallback(
    async (recipe: Recipe) => {
      try {
        setError(null);
        await addRecipe(recipe);
        await loadRecipes(); // Refresh the list
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to add recipe');
        throw err; // Re-throw so UI can handle it
      }
    },
    [loadRecipes],
  );

  const updateExistingRecipe = useCallback(async (recipe: Recipe) => {
    try {
      setError(null);
      await updateRecipe(recipe);
      setRecipes(prevRecipes =>
        prevRecipes.map(r => (r.id === recipe.id ? recipe : r)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update recipe');
      throw err;
    }
  }, []);

  const removeRecipe = useCallback(async (id: string) => {
    try {
      setError(null);
      await deleteRecipe(id);
      setRecipes(prevRecipes => prevRecipes.filter(r => r.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete recipe');
      throw err;
    }
  }, []);

  const getRecipeById = useCallback(
    (id: string): Recipe | undefined => {
      return recipes.find(recipe => recipe.id === id);
    },
    [recipes],
  );

  useEffect(() => {
    loadRecipes();
  }, [loadRecipes]);

  return {
    recipes,
    loading,
    error,
    loadRecipes,
    addNewRecipe,
    updateExistingRecipe,
    removeRecipe,
    getRecipeById,
  };
};
