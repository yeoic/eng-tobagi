import { Suspense } from "react";
import { db } from "@/lib/db";
import { RecipesAdminClient } from "./recipes-admin-client";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = "force-dynamic";

async function getRecipes() {
  return db.recipe.findMany({
    include: {
      ingredients: {
        include: {
          ingredient: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

async function getIngredients() {
  return db.ingredient.findMany({
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });
}

export default async function AdminRecipesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">레시피 관리</h1>
        <p className="text-muted-foreground">레시피를 추가, 수정, 삭제합니다.</p>
      </div>

      <Suspense
        fallback={
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        }
      >
        <RecipesContent />
      </Suspense>
    </div>
  );
}

async function RecipesContent() {
  const [recipes, ingredients] = await Promise.all([getRecipes(), getIngredients()]);
  return <RecipesAdminClient recipes={recipes} ingredients={ingredients} />;
}
