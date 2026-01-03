import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { validateAdminKeyFromRequest } from "@/lib/admin-auth";
import { recipeUpdateSchema } from "@/lib/validations";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!validateAdminKeyFromRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    const recipe = await db.recipe.findUnique({
      where: { id },
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });

    if (!recipe) {
      return NextResponse.json(
        { error: "레시피를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json(recipe);
  } catch (error) {
    console.error("Error fetching recipe:", error);
    return NextResponse.json(
      { error: "레시피를 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!validateAdminKeyFromRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const validated = recipeUpdateSchema.parse(body);

    // If ingredients are being updated, delete existing and recreate
    const updateData: Parameters<typeof db.recipe.update>[0]["data"] = {};

    if (validated.title !== undefined) updateData.title = validated.title;
    if (validated.description !== undefined) updateData.description = validated.description;
    if (validated.steps !== undefined) updateData.steps = validated.steps;
    if (validated.time !== undefined) updateData.time = validated.time;
    if (validated.difficulty !== undefined) updateData.difficulty = validated.difficulty;
    if (validated.tips !== undefined) updateData.tips = validated.tips;
    if (validated.imageUrl !== undefined) updateData.imageUrl = validated.imageUrl;

    if (validated.ingredients) {
      // Delete existing recipe ingredients
      await db.recipeIngredient.deleteMany({
        where: { recipeId: id },
      });

      updateData.ingredients = {
        create: validated.ingredients.map((ing) => ({
          ingredientId: ing.ingredientId,
          quantity: ing.quantity,
          unit: ing.unit,
        })),
      };
    }

    const recipe = await db.recipe.update({
      where: { id },
      data: updateData,
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });

    return NextResponse.json(recipe);
  } catch (error) {
    console.error("Error updating recipe:", error);
    if (error instanceof Error && error.message.includes("Record to update not found")) {
      return NextResponse.json(
        { error: "레시피를 찾을 수 없습니다." },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "레시피를 수정하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!validateAdminKeyFromRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    await db.recipe.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    if (error instanceof Error && error.message.includes("Record to delete does not exist")) {
      return NextResponse.json(
        { error: "레시피를 찾을 수 없습니다." },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "레시피를 삭제하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
