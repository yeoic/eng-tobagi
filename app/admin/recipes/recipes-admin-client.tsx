"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Clock, ChefHat } from "lucide-react";
import { formatTime, getDifficultyLabel, getDifficultyColor } from "@/lib/utils";
import { RecipeFormDialog } from "./recipe-form-dialog";

interface Ingredient {
  id: string;
  name: string;
  category: string | null;
}

interface RecipeIngredient {
  id: string;
  ingredientId: string;
  quantity: number;
  unit: string;
  ingredient: Ingredient;
}

interface Recipe {
  id: string;
  title: string;
  description: string | null;
  steps: string[];
  time: number;
  difficulty: string;
  tips: string | null;
  ingredients: RecipeIngredient[];
}

interface RecipesAdminClientProps {
  recipes: Recipe[];
  ingredients: Ingredient[];
}

export function RecipesAdminClient({ recipes, ingredients }: RecipesAdminClientProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    setDeletingId(id);

    try {
      const res = await fetch(`/api/admin/recipes/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      } else {
        const error = await res.json();
        alert(error.error || "레시피 삭제 실패");
      }
    } catch {
      alert("오류가 발생했습니다.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <Button onClick={() => setIsCreateOpen(true)}>
        <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
        새 레시피 추가
      </Button>

      {/* Create Dialog */}
      <RecipeFormDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        ingredients={ingredients}
        onSuccess={() => {
          setIsCreateOpen(false);
          router.refresh();
        }}
      />

      {/* Edit Dialog */}
      <RecipeFormDialog
        open={!!editingRecipe}
        onOpenChange={() => setEditingRecipe(null)}
        ingredients={ingredients}
        recipe={editingRecipe || undefined}
        onSuccess={() => {
          setEditingRecipe(null);
          router.refresh();
        }}
      />

      {/* Recipes list */}
      <div className="space-y-3">
        {recipes.map((recipe) => (
          <Card key={recipe.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Link
                    href={`/recipes/${recipe.id}`}
                    className="font-medium hover:underline truncate"
                    target="_blank"
                  >
                    {recipe.title}
                  </Link>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}
                  >
                    {getDifficultyLabel(recipe.difficulty)}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    {formatTime(recipe.time)}
                  </span>
                  <span className="flex items-center gap-1">
                    <ChefHat className="h-3.5 w-3.5" aria-hidden="true" />
                    재료 {recipe.ingredients.length}가지
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {recipe.ingredients.slice(0, 5).map((ri) => (
                    <Badge key={ri.id} variant="outline" className="text-xs">
                      {ri.ingredient.name}
                    </Badge>
                  ))}
                  {recipe.ingredients.length > 5 && (
                    <Badge variant="outline" className="text-xs">
                      +{recipe.ingredients.length - 5}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 ml-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditingRecipe(recipe)}
                  aria-label={`${recipe.title} 수정`}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(recipe.id)}
                  disabled={deletingId === recipe.id}
                  aria-label={`${recipe.title} 삭제`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {recipes.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          등록된 레시피가 없습니다. 새 레시피를 추가해주세요.
        </p>
      )}
    </div>
  );
}
