import { Suspense } from "react";
import { Metadata } from "next";
import { db } from "@/lib/db";
import {
  rankRecipesByUtilization,
  filterByDifficulty,
  filterByMaxTime,
} from "@/lib/ranking";
import { RecipesClient } from "./recipes-client";
import { RecipeListSkeleton } from "@/components/loading-skeleton";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "레시피 검색 결과",
  description: "선택한 재료로 만들 수 있는 레시피 목록입니다.",
};

interface RecipesPageProps {
  searchParams: Promise<{
    ingredients?: string;
    difficulty?: string;
    maxTime?: string;
  }>;
}

async function getRecipes(
  ingredientIds: string[],
  difficulty?: string,
  maxTime?: number
) {
  const recipes = await db.recipe.findMany({
    include: {
      ingredients: {
        include: {
          ingredient: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  let rankedRecipes = rankRecipesByUtilization(recipes, ingredientIds);
  rankedRecipes = filterByDifficulty(rankedRecipes, difficulty);
  rankedRecipes = filterByMaxTime(rankedRecipes, maxTime);

  return rankedRecipes;
}

async function getIngredients() {
  return db.ingredient.findMany({
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });
}

export default async function RecipesPage({ searchParams }: RecipesPageProps) {
  const params = await searchParams;
  const ingredientIds = params.ingredients?.split(",").filter(Boolean) || [];
  const difficulty = params.difficulty;
  const maxTime = params.maxTime ? parseInt(params.maxTime) : undefined;

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">레시피 검색 결과</h1>
        {ingredientIds.length > 0 && (
          <p className="mt-1 text-muted-foreground">
            선택한 재료를 활용한 레시피를 활용도 순으로 보여드립니다.
          </p>
        )}
      </div>

      <Suspense fallback={<RecipeListSkeleton />}>
        <RecipesContent
          ingredientIds={ingredientIds}
          difficulty={difficulty}
          maxTime={maxTime}
        />
      </Suspense>
    </div>
  );
}

async function RecipesContent({
  ingredientIds,
  difficulty,
  maxTime,
}: {
  ingredientIds: string[];
  difficulty?: string;
  maxTime?: number;
}) {
  const [recipes, ingredients] = await Promise.all([
    getRecipes(ingredientIds, difficulty, maxTime),
    getIngredients(),
  ]);

  return (
    <RecipesClient
      recipes={recipes}
      ingredients={ingredients}
      selectedIngredientIds={ingredientIds}
      currentDifficulty={difficulty}
      currentMaxTime={maxTime}
    />
  );
}
