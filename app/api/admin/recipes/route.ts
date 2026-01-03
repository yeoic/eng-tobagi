import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { validateAdminKeyFromRequest } from "@/lib/admin-auth";
import { recipeSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  if (!validateAdminKeyFromRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
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

    return NextResponse.json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return NextResponse.json(
      { error: "레시피 목록을 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!validateAdminKeyFromRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validated = recipeSchema.parse(body);

    const recipe = await db.recipe.create({
      data: {
        title: validated.title,
        description: validated.description || null,
        steps: validated.steps,
        time: validated.time,
        difficulty: validated.difficulty,
        tips: validated.tips || null,
        imageUrl: validated.imageUrl || null,
        ingredients: {
          create: validated.ingredients.map((ing) => ({
            ingredientId: ing.ingredientId,
            quantity: ing.quantity,
            unit: ing.unit,
          })),
        },
      },
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });

    return NextResponse.json(recipe, { status: 201 });
  } catch (error) {
    console.error("Error creating recipe:", error);
    return NextResponse.json(
      { error: "레시피를 생성하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
