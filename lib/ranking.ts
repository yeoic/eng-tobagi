import { Recipe, RecipeIngredient, Ingredient } from "@prisma/client";

export type RecipeWithIngredients = Recipe & {
  ingredients: (RecipeIngredient & {
    ingredient: Ingredient;
  })[];
};

export interface RankedRecipe extends RecipeWithIngredients {
  utilizationScore: number;
  matchedIngredients: string[];
  matchedCount: number;
}

/**
 * Calculates utilization score for recipes based on selected ingredients.
 * Score = (# of selected ingredients used in recipe) / (total # of selected ingredients)
 * Recipes are sorted by score (desc), then by time (asc) as tie-breaker.
 */
export function rankRecipesByUtilization(
  recipes: RecipeWithIngredients[],
  selectedIngredientIds: string[]
): RankedRecipe[] {
  if (selectedIngredientIds.length === 0) {
    // If no ingredients selected, return all recipes sorted by time
    return recipes.map((recipe) => ({
      ...recipe,
      utilizationScore: 0,
      matchedIngredients: [],
      matchedCount: 0,
    })).sort((a, b) => a.time - b.time);
  }

  const selectedSet = new Set(selectedIngredientIds);

  const rankedRecipes = recipes.map((recipe) => {
    const matchedIngredients = recipe.ingredients
      .filter((ri) => selectedSet.has(ri.ingredientId))
      .map((ri) => ri.ingredient.name);

    const matchedCount = matchedIngredients.length;
    const utilizationScore = matchedCount / selectedIngredientIds.length;

    return {
      ...recipe,
      utilizationScore,
      matchedIngredients,
      matchedCount,
    };
  });

  // Sort by score (desc), then by time (asc)
  return rankedRecipes.sort((a, b) => {
    if (b.utilizationScore !== a.utilizationScore) {
      return b.utilizationScore - a.utilizationScore;
    }
    return a.time - b.time;
  });
}

/**
 * Filters recipes by difficulty
 */
export function filterByDifficulty(
  recipes: RankedRecipe[],
  difficulty?: string
): RankedRecipe[] {
  if (!difficulty) return recipes;
  return recipes.filter((r) => r.difficulty === difficulty);
}

/**
 * Filters recipes by max time
 */
export function filterByMaxTime(
  recipes: RankedRecipe[],
  maxTime?: number
): RankedRecipe[] {
  if (!maxTime) return recipes;
  return recipes.filter((r) => r.time <= maxTime);
}
