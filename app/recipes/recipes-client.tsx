"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { RecipeCard } from "@/components/recipe-card";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RankedRecipe } from "@/lib/ranking";
import { UtensilsCrossed, X, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Ingredient {
  id: string;
  name: string;
  category: string | null;
}

interface RecipesClientProps {
  recipes: RankedRecipe[];
  ingredients: Ingredient[];
  selectedIngredientIds: string[];
  currentDifficulty?: string;
  currentMaxTime?: number;
}

export function RecipesClient({
  recipes,
  ingredients,
  selectedIngredientIds,
  currentDifficulty,
  currentMaxTime,
}: RecipesClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedIngredients = ingredients.filter((ing) =>
    selectedIngredientIds.includes(ing.id)
  );

  const updateFilters = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    router.push(`/recipes?${params.toString()}`);
  };

  const removeIngredient = (id: string) => {
    const newIds = selectedIngredientIds.filter((i) => i !== id);
    updateFilters({
      ingredients: newIds.length > 0 ? newIds.join(",") : undefined,
    });
  };

  const hasFilters =
    selectedIngredientIds.length > 0 || currentDifficulty || currentMaxTime;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" size="sm" asChild className="mr-2">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-1" aria-hidden="true" />
              재료 다시 선택
            </Link>
          </Button>

          {selectedIngredients.map((ing) => (
            <Badge
              key={ing.id}
              variant="secondary"
              className="cursor-pointer pr-1"
              onClick={() => removeIngredient(ing.id)}
            >
              {ing.name}
              <X className="ml-1 h-3 w-3" aria-hidden="true" />
              <span className="sr-only">{ing.name} 필터 해제</span>
            </Badge>
          ))}
        </div>

        <div className="flex gap-2">
          <Select
            value={currentDifficulty || "all"}
            onValueChange={(value) =>
              updateFilters({
                difficulty: value === "all" ? undefined : value,
              })
            }
          >
            <SelectTrigger className="w-[120px]" aria-label="난이도 필터">
              <SelectValue placeholder="난이도" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 난이도</SelectItem>
              <SelectItem value="EASY">쉬움</SelectItem>
              <SelectItem value="MEDIUM">보통</SelectItem>
              <SelectItem value="HARD">어려움</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={currentMaxTime?.toString() || "all"}
            onValueChange={(value) =>
              updateFilters({
                maxTime: value === "all" ? undefined : value,
              })
            }
          >
            <SelectTrigger className="w-[120px]" aria-label="조리시간 필터">
              <SelectValue placeholder="조리시간" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 시간</SelectItem>
              <SelectItem value="15">15분 이내</SelectItem>
              <SelectItem value="30">30분 이내</SelectItem>
              <SelectItem value="60">1시간 이내</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        {recipes.length}개의 레시피를 찾았습니다.
      </div>

      {/* Recipe list */}
      {recipes.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              showScore={selectedIngredientIds.length > 0}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<UtensilsCrossed className="h-12 w-12" />}
          title="레시피가 없습니다"
          description={
            hasFilters
              ? "필터 조건을 변경해보세요."
              : "아직 등록된 레시피가 없습니다."
          }
          action={
            hasFilters && (
              <Button variant="outline" asChild>
                <Link href="/">재료 다시 선택하기</Link>
              </Button>
            )
          }
        />
      )}
    </div>
  );
}
