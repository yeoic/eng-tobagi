import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { validateAdminKeyFromRequest } from "@/lib/admin-auth";
import { ingredientSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  if (!validateAdminKeyFromRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const ingredients = await db.ingredient.findMany({
      include: {
        _count: {
          select: { recipes: true },
        },
      },
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });

    return NextResponse.json(ingredients);
  } catch (error) {
    console.error("Error fetching ingredients:", error);
    return NextResponse.json(
      { error: "재료 목록을 불러오는 중 오류가 발생했습니다." },
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
    const validated = ingredientSchema.parse(body);

    const ingredient = await db.ingredient.create({
      data: {
        name: validated.name,
        category: validated.category || null,
      },
    });

    return NextResponse.json(ingredient, { status: 201 });
  } catch (error) {
    console.error("Error creating ingredient:", error);
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "이미 존재하는 재료 이름입니다." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "재료를 생성하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
