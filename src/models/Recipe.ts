export interface Recipe {
  id: string;
  name: string;
  typeId: string;
  image: string;
  ingredients: string[];
  steps: string[];
}