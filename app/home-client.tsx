"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IngredientPicker } from "@/components/ingredient-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Lightbulb } from "lucide-react";

interface Ingredient {
  id: string;
  name: string;
  category: string | null;
}

interface HomeClientProps {
  ingredients: Ingredient[];
}

export function HomeClient({ ingredients }: HomeClientProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const router = useRouter();

  const handleFindRecipes = () => {
    if (selectedIds.length === 0) return;
    const params = new URLSearchParams();
    params.set("ingredients", selectedIds.join(","));
    router.push(`/recipes?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>재료 선택</span>
            {selectedIds.length > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                ({selectedIds.length}개 선택됨)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <IngredientPicker
            ingredients={ingredients}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
          />
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={handleFindRecipes}
          disabled={selectedIds.length === 0}
          className="w-full sm:w-auto"
        >
          레시피 찾기
          <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
        </Button>
      </div>

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Lightbulb
              className="h-5 w-5 shrink-0 text-primary"
              aria-hidden="true"
            />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground">
                재료 활용도가 높은 순서로 추천해요
              </p>
              <p className="mt-1">
                선택한 재료를 많이 사용하는 레시피일수록 상위에 표시됩니다.
                음식물 쓰레기를 줄이고, 남은 재료를 알뜰하게 활용해보세요!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
