import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ChefHat } from "lucide-react";
import { formatTime, getDifficultyLabel, getDifficultyColor } from "@/lib/utils";
import { RankedRecipe } from "@/lib/ranking";

interface RecipeCardProps {
  recipe: RankedRecipe;
  showScore?: boolean;
}

export function RecipeCard({ recipe, showScore = false }: RecipeCardProps) {
  const scorePercentage = Math.round(recipe.utilizationScore * 100);

  return (
    <Link href={`/recipes/${recipe.id}`} className="block group">
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg group-hover:text-primary transition-colors">
              {recipe.title}
            </CardTitle>
            {showScore && recipe.utilizationScore > 0 && (
              <Badge variant="secondary" className="shrink-0">
                활용도 {scorePercentage}%
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {recipe.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {recipe.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" aria-hidden="true" />
              <span>{formatTime(recipe.time)}</span>
            </span>
            <span className="flex items-center gap-1">
              <ChefHat className="h-4 w-4" aria-hidden="true" />
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}
              >
                {getDifficultyLabel(recipe.difficulty)}
              </span>
            </span>
          </div>

          {showScore && recipe.matchedIngredients.length > 0 && (
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground mb-1.5">
                사용 가능한 재료:
              </p>
              <div className="flex flex-wrap gap-1">
                {recipe.matchedIngredients.map((name) => (
                  <Badge key={name} variant="outline" className="text-xs">
                    {name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
