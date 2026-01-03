import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const ingredients = await db.ingredient.findMany({
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
