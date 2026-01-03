"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Ingredient {
  id: string;
  name: string;
  category: string | null;
  _count: {
    recipes: number;
  };
}

interface IngredientsClientProps {
  ingredients: Ingredient[];
}

export function IngredientsClient({ ingredients }: IngredientsClientProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      category: (formData.get("category") as string) || null,
    };

    try {
      const res = await fetch("/api/admin/ingredients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setIsCreateOpen(false);
        router.refresh();
      } else {
        const error = await res.json();
        alert(error.error || "재료 생성 실패");
      }
    } catch {
      alert("오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingIngredient) return;
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      category: (formData.get("category") as string) || null,
    };

    try {
      const res = await fetch(`/api/admin/ingredients/${editingIngredient.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setEditingIngredient(null);
        router.refresh();
      } else {
        const error = await res.json();
        alert(error.error || "재료 수정 실패");
      }
    } catch {
      alert("오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까? 이 재료를 사용하는 레시피에서도 삭제됩니다.")) {
      return;
    }

    setDeletingId(id);

    try {
      const res = await fetch(`/api/admin/ingredients/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      } else {
        const error = await res.json();
        alert(error.error || "재료 삭제 실패");
      }
    } catch {
      alert("오류가 발생했습니다.");
    } finally {
      setDeletingId(null);
    }
  };

  // Group ingredients by category
  const groupedIngredients = ingredients.reduce(
    (acc, ing) => {
      const category = ing.category || "기타";
      if (!acc[category]) acc[category] = [];
      acc[category].push(ing);
      return acc;
    },
    {} as Record<string, Ingredient[]>
  );

  return (
    <div className="space-y-6">
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            새 재료 추가
          </Button>
        </DialogTrigger>
        <DialogContent>
          <form onSubmit={handleCreate}>
            <DialogHeader>
              <DialogTitle>새 재료 추가</DialogTitle>
              <DialogDescription>
                레시피에 사용할 새로운 재료를 추가합니다.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">재료 이름 *</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">카테고리</Label>
                <Input id="category" name="category" placeholder="예: 채소, 육류, 양념" />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                취소
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "저장 중..." : "저장"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingIngredient} onOpenChange={() => setEditingIngredient(null)}>
        <DialogContent>
          <form onSubmit={handleUpdate}>
            <DialogHeader>
              <DialogTitle>재료 수정</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">재료 이름 *</Label>
                <Input
                  id="edit-name"
                  name="name"
                  defaultValue={editingIngredient?.name}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">카테고리</Label>
                <Input
                  id="edit-category"
                  name="category"
                  defaultValue={editingIngredient?.category || ""}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditingIngredient(null)}>
                취소
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "저장 중..." : "저장"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Ingredients list */}
      <div className="space-y-4">
        {Object.entries(groupedIngredients).map(([category, ings]) => (
          <Card key={category}>
            <CardHeader className="py-3">
              <CardTitle className="text-base">{category}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {ings.map((ing) => (
                  <div
                    key={ing.id}
                    className="flex items-center justify-between rounded-md border px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <span>{ing.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {ing._count.recipes}개 레시피
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingIngredient(ing)}
                        aria-label={`${ing.name} 수정`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(ing.id)}
                        disabled={deletingId === ing.id}
                        aria-label={`${ing.name} 삭제`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {ingredients.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          등록된 재료가 없습니다. 새 재료를 추가해주세요.
        </p>
      )}
    </div>
  );
}
