import { Suspense } from "react";
import { db } from "@/lib/db";
import { IngredientsClient } from "./ingredients-client";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = "force-dynamic";

async function getIngredients() {
  return db.ingredient.findMany({
    include: {
      _count: {
        select: { recipes: true },
      },
    },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });
}

export default async function AdminIngredientsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">재료 관리</h1>
        <p className="text-muted-foreground">레시피에 사용할 재료를 관리합니다.</p>
      </div>

      <Suspense
        fallback={
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        }
      >
        <IngredientsContent />
      </Suspense>
    </div>
  );
}

async function IngredientsContent() {
  const ingredients = await getIngredients();
  return <IngredientsClient ingredients={ingredients} />;
}
