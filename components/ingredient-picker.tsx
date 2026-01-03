"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Ingredient {
  id: string;
  name: string;
  category: string | null;
}

interface IngredientPickerProps {
  ingredients: Ingredient[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
}

export function IngredientPicker({
  ingredients,
  selectedIds,
  onSelectionChange,
}: IngredientPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Group ingredients by category
  const groupedIngredients = useMemo(() => {
    const groups: Record<string, Ingredient[]> = {};
    ingredients.forEach((ing) => {
      const category = ing.category || "기타";
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(ing);
    });
    return groups;
  }, [ingredients]);

  // Filter ingredients by search query
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return groupedIngredients;

    const filtered: Record<string, Ingredient[]> = {};
    Object.entries(groupedIngredients).forEach(([category, ings]) => {
      const matchedIngs = ings.filter((ing) =>
        ing.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (matchedIngs.length > 0) {
        filtered[category] = matchedIngs;
      }
    });
    return filtered;
  }, [groupedIngredients, searchQuery]);

  const toggleIngredient = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((i) => i !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const clearAll = () => {
    onSelectionChange([]);
    setSearchQuery("");
  };

  const selectedIngredients = ingredients.filter((ing) =>
    selectedIds.includes(ing.id)
  );

  return (
    <div className="space-y-4">
      {/* Search input */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="text"
          placeholder="재료 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
          aria-label="재료 검색"
        />
      </div>

      {/* Selected ingredients display */}
      {selectedIngredients.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              선택한 재료 ({selectedIngredients.length}개)
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="h-auto px-2 py-1 text-xs text-muted-foreground"
            >
              모두 지우기
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedIngredients.map((ing) => (
              <Badge
                key={ing.id}
                variant="default"
                className="cursor-pointer pr-1"
                onClick={() => toggleIngredient(ing.id)}
              >
                {ing.name}
                <X className="ml-1 h-3 w-3" aria-hidden="true" />
                <span className="sr-only">{ing.name} 선택 해제</span>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Ingredient chips by category */}
      <div className="space-y-4">
        {Object.entries(filteredGroups).map(([category, ings]) => (
          <div key={category}>
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">
              {category}
            </h3>
            <div className="flex flex-wrap gap-2" role="group" aria-label={`${category} 재료`}>
              {ings.map((ing) => {
                const isSelected = selectedIds.includes(ing.id);
                return (
                  <button
                    key={ing.id}
                    onClick={() => toggleIngredient(ing.id)}
                    className={cn(
                      "inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input bg-background hover:bg-accent hover:text-accent-foreground"
                    )}
                    aria-pressed={isSelected}
                  >
                    {ing.name}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {Object.keys(filteredGroups).length === 0 && searchQuery && (
        <p className="py-8 text-center text-muted-foreground">
          &quot;{searchQuery}&quot;에 해당하는 재료가 없습니다.
        </p>
      )}
    </div>
  );
}
