import { useState, useMemo } from 'react';
import { Recipe } from '../models/Recipe';
import recipeTypesData from '../data/recipetypes.json';

export interface RecipeType {
  id: string;
  name: string;
}

export const useRecipeFilter = (recipes: Recipe[]) => {
  const [selectedType, setSelectedType] = useState<string>('all');

  const recipeTypes = useMemo((): RecipeType[] => {
    const typedRecipeTypes = recipeTypesData as RecipeType[];
    return [{ id: 'all', name: 'All Types' }, ...typedRecipeTypes];
  }, []);

  const filteredRecipes = useMemo((): Recipe[] => {
    if (selectedType === 'all') {
      return recipes;
    }
    return recipes.filter(recipe => recipe.typeId === selectedType);
  }, [recipes, selectedType]);

  const getRecipeTypeName = (typeId: string): string => {
    const type = recipeTypes.find(t => t.id === typeId);
    return type?.name || 'Unknown';
  };

  const recipeCountByType = useMemo(() => {
    const counts: Record<string, number> = {};

    recipeTypes.forEach(type => {
      if (type.id === 'all') {
        counts[type.id] = recipes.length;
      } else {
        counts[type.id] = recipes.filter(
          recipe => recipe.typeId === type.id,
        ).length;
      }
    });

    return counts;
  }, [recipes, recipeTypes]);

  return {
    selectedType,
    setSelectedType,
    recipeTypes,
    filteredRecipes,
    getRecipeTypeName,
    recipeCountByType,
  };
};
