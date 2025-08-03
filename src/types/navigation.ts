import { Recipe } from '../models/Recipe';

export type RootStackParamList = {
  Recipes: undefined;
  AddRecipe: undefined;
  RecipeDetail: { recipe: Recipe };
};
