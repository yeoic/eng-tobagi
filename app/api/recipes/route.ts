import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  rankRecipesByUtilization,
  filterByDifficulty,
  filterByMaxTime,
} from "@/lib/ranking";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const ingredientIds = searchParams.get("ingredients")?.split(",").filter(Boolean) || [];
    const difficulty = searchParams.get("difficulty") || undefined;
    const maxTime = searchParams.get("maxTime")
      ? parseInt(searchParams.get("maxTime")!)
      : undefined;

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

    return NextResponse.json(rankedRecipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return NextResponse.json(
      { error: "레시피 목록을 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
