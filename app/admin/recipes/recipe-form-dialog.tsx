"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

interface Ingredient {
  id: string;
  name: string;
  category: string | null;
}

interface RecipeIngredient {
  ingredientId: string;
  quantity: number;
  unit: string;
}

interface Recipe {
  id: string;
  title: string;
  description: string | null;
  steps: string[];
  time: number;
  difficulty: string;
  tips: string | null;
  ingredients: {
    id: string;
    ingredientId: string;
    quantity: number;
    unit: string;
    ingredient: Ingredient;
  }[];
}

interface RecipeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ingredients: Ingredient[];
  recipe?: Recipe;
  onSuccess: () => void;
}

export function RecipeFormDialog({
  open,
  onOpenChange,
  ingredients,
  recipe,
  onSuccess,
}: RecipeFormDialogProps) {
  const isEditing = !!recipe;

  const [title, setTitle] = useState(recipe?.title || "");
  const [description, setDescription] = useState(recipe?.description || "");
  const [steps, setSteps] = useState<string[]>(recipe?.steps || [""]);
  const [time, setTime] = useState(recipe?.time?.toString() || "");
  const [difficulty, setDifficulty] = useState(recipe?.difficulty || "EASY");
  const [tips, setTips] = useState(recipe?.tips || "");
  const [recipeIngredients, setRecipeIngredients] = useState<RecipeIngredient[]>(
    recipe?.ingredients.map((ri) => ({
      ingredientId: ri.ingredientId,
      quantity: ri.quantity,
      unit: ri.unit,
    })) || [{ ingredientId: "", quantity: 0, unit: "" }]
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const data = {
      title,
      description: description || null,
      steps: steps.filter((s) => s.trim()),
      time: parseInt(time),
      difficulty,
      tips: tips || null,
      ingredients: recipeIngredients.filter((ri) => ri.ingredientId),
    };

    try {
      const url = isEditing ? `/api/admin/recipes/${recipe.id}` : "/api/admin/recipes";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        onSuccess();
        // Reset form for create mode
        if (!isEditing) {
          setTitle("");
          setDescription("");
          setSteps([""]);
          setTime("");
          setDifficulty("EASY");
          setTips("");
          setRecipeIngredients([{ ingredientId: "", quantity: 0, unit: "" }]);
        }
      } else {
        const error = await res.json();
        alert(error.error || "레시피 저장 실패");
      }
    } catch {
      alert("오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const addStep = () => setSteps([...steps, ""]);
  const removeStep = (index: number) => setSteps(steps.filter((_, i) => i !== index));
  const updateStep = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const addIngredient = () =>
    setRecipeIngredients([...recipeIngredients, { ingredientId: "", quantity: 0, unit: "" }]);
  const removeIngredient = (index: number) =>
    setRecipeIngredients(recipeIngredients.filter((_, i) => i !== index));
  const updateIngredient = (index: number, field: keyof RecipeIngredient, value: string | number) => {
    const newIngredients = [...recipeIngredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setRecipeIngredients(newIngredients);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? "레시피 수정" : "새 레시피 추가"}</DialogTitle>
            <DialogDescription>
              레시피 정보를 입력하세요. * 표시는 필수 항목입니다.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">레시피 제목 *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">설명</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="time">조리 시간 (분) *</Label>
                  <Input
                    id="time"
                    type="number"
                    min="1"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">난이도 *</Label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger id="difficulty">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EASY">쉬움</SelectItem>
                      <SelectItem value="MEDIUM">보통</SelectItem>
                      <SelectItem value="HARD">어려움</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Ingredients */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>재료 *</Label>
                <Button type="button" variant="outline" size="sm" onClick={addIngredient}>
                  <Plus className="mr-1 h-3 w-3" />
                  재료 추가
                </Button>
              </div>
              <div className="space-y-2">
                {recipeIngredients.map((ri, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Select
                      value={ri.ingredientId}
                      onValueChange={(v) => updateIngredient(index, "ingredientId", v)}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="재료 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {ingredients.map((ing) => (
                          <SelectItem key={ing.id} value={ing.id}>
                            {ing.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="수량"
                      className="w-20"
                      value={ri.quantity || ""}
                      onChange={(e) =>
                        updateIngredient(index, "quantity", parseFloat(e.target.value) || 0)
                      }
                    />
                    <Input
                      placeholder="단위"
                      className="w-20"
                      value={ri.unit}
                      onChange={(e) => updateIngredient(index, "unit", e.target.value)}
                    />
                    {recipeIngredients.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeIngredient(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>조리 순서 *</Label>
                <Button type="button" variant="outline" size="sm" onClick={addStep}>
                  <Plus className="mr-1 h-3 w-3" />
                  단계 추가
                </Button>
              </div>
              <div className="space-y-2">
                {steps.map((step, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium">
                      {index + 1}
                    </span>
                    <Textarea
                      value={step}
                      onChange={(e) => updateStep(index, e.target.value)}
                      placeholder={`${index + 1}단계 설명`}
                      rows={2}
                      className="flex-1"
                    />
                    {steps.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeStep(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="space-y-2">
              <Label htmlFor="tips">재료 활용 팁</Label>
              <Textarea
                id="tips"
                value={tips}
                onChange={(e) => setTips(e.target.value)}
                placeholder="남은 재료를 활용하는 팁을 적어주세요"
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              취소
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "저장 중..." : "저장"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
