import AsyncStorage from '@react-native-async-storage/async-storage';
import { Recipe } from '../models/Recipe';
import sampleRecipes from '../data/sampleRecipes.json';

const RECIPE_KEY = 'RECIPES';
const FIRST_RUN_KEY = 'FIRST_RUN_COMPLETED';

export const saveRecipes = async (recipes: Recipe[]) => {
  try {
    const jsonString = JSON.stringify(recipes);
    await AsyncStorage.setItem(RECIPE_KEY, jsonString);
  } catch (error) {
    throw error;
  }
};

export const getRecipes = async (): Promise<Recipe[]> => {
  try {
    // Check if this is the first run
    const isFirstRun = await AsyncStorage.getItem(FIRST_RUN_KEY);
    
    if (!isFirstRun) {
      console.log('🎉 First run detected, loading sample recipes...');
      await initializeSampleRecipes();
      await AsyncStorage.setItem(FIRST_RUN_KEY, 'true');
    }
    
    const json = await AsyncStorage.getItem(RECIPE_KEY);
    
    if (json) {
      const parsed = JSON.parse(json);
      return parsed;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
};

const initializeSampleRecipes = async () => {
  try {
    console.log('📥 Initializing sample recipes...');
    const typedSampleRecipes: Recipe[] = sampleRecipes as Recipe[];
    await saveRecipes(typedSampleRecipes);
    console.log('✅ Sample recipes loaded successfully:', typedSampleRecipes.length, 'recipes');
  } catch (error) {
    console.error('❌ Error loading sample recipes:', error);
  }
};

export const addRecipe = async (recipe: Recipe) => {
  try {
    const recipes = await getRecipes();
    recipes.push(recipe);
    await saveRecipes(recipes);
  } catch (error) {
    throw error;
  }
};

export const updateRecipe = async (updated: Recipe) => {
  let recipes = await getRecipes();
  recipes = recipes.map(r => r.id === updated.id ? updated : r);
  await saveRecipes(recipes);
};

export const deleteRecipe = async (id: string) => {
  let recipes = await getRecipes();
  recipes = recipes.filter(r => r.id !== id);
  await saveRecipes(recipes);
};


export const clearAllRecipes = async () => {
  try {
    await AsyncStorage.removeItem(RECIPE_KEY);
    console.log('All recipes cleared from storage');
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};