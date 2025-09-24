export interface Recipe {
  _id: string;
  title: string;
  description: string;
  recipeImage?: string;
  ingredients: string[];
  preparationSteps: string[];
  cookingTime: number;
  calories: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cuisine: string;
  diet: string;
  user?: {
    _id: string;
    username: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface RecipeResponse {
  _id: string;
  title: string;
  description: string;
  recipeImage?: string;
  ingredients: string[];
  preparationSteps: string[];
  cookingTime: number;
  calories: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cuisine: string;
  diet: string;
  user?: {
    _id: string;
    username: string;
  };
  createdAt?: string;
  updatedAt?: string;
}
