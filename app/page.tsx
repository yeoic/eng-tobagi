import { Suspense } from "react";
import { db } from "@/lib/db";
import { HomeClient } from "./home-client";
import { IngredientPickerSkeleton } from "@/components/loading-skeleton";

export const dynamic = "force-dynamic";

async function getIngredients() {
  const ingredients = await db.ingredient.findMany({
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });
  return ingredients;
}

export default async function HomePage() {
  return (
    <div className="container py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            재료 다:씀 레시피
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            냉장고에 남은 재료를 선택하세요. <br className="sm:hidden" />
            재료를 최대한 활용할 수 있는 레시피를 추천해드립니다.
          </p>
        </div>

        <Suspense fallback={<IngredientPickerSkeleton />}>
          <HomeContent />
        </Suspense>
      </div>
    </div>
  );
}

async function HomeContent() {
  const ingredients = await getIngredients();

  return <HomeClient ingredients={ingredients} />;
}
