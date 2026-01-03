import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecipeDetailSkeleton } from "@/components/loading-skeleton";
import {
  formatTime,
  getDifficultyLabel,
  getDifficultyColor,
} from "@/lib/utils";
import {
  ArrowLeft,
  Clock,
  ChefHat,
  Lightbulb,
  ShoppingBasket,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface RecipePageProps {
  params: Promise<{ id: string }>;
}

async function getRecipe(id: string) {
  const recipe = await db.recipe.findUnique({
    where: { id },
    include: {
      ingredients: {
        include: {
          ingredient: true,
        },
      },
    },
  });

  return recipe;
}

export async function generateMetadata({
  params,
}: RecipePageProps): Promise<Metadata> {
  const { id } = await params;
  const recipe = await getRecipe(id);

  if (!recipe) {
    return {
      title: "레시피를 찾을 수 없습니다",
    };
  }

  return {
    title: recipe.title,
    description:
      recipe.description ||
      `${recipe.title} 레시피입니다. 조리시간 ${formatTime(recipe.time)}.`,
    openGraph: {
      title: `${recipe.title} | 재료 다:씀 레시피`,
      description:
        recipe.description || `${recipe.title} 레시피입니다.`,
      type: "article",
    },
  };
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { id } = await params;

  return (
    <div className="container py-8">
      <div className="mx-auto max-w-3xl">
        <Suspense fallback={<RecipeDetailSkeleton />}>
          <RecipeContent id={id} />
        </Suspense>
      </div>
    </div>
  );
}

async function RecipeContent({ id }: { id: string }) {
  const recipe = await getRecipe(id);

  if (!recipe) {
    notFound();
  }

  return (
    <article className="space-y-8">
      {/* Back button */}
      <Button variant="ghost" size="sm" asChild>
        <Link href="/recipes">
          <ArrowLeft className="mr-1 h-4 w-4" aria-hidden="true" />
          레시피 목록
        </Link>
      </Button>

      {/* Header */}
      <header className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">{recipe.title}</h1>
        {recipe.description && (
          <p className="text-lg text-muted-foreground">{recipe.description}</p>
        )}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-5 w-5" aria-hidden="true" />
            <span>{formatTime(recipe.time)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ChefHat className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-medium ${getDifficultyColor(recipe.difficulty)}`}
            >
              {getDifficultyLabel(recipe.difficulty)}
            </span>
          </div>
        </div>
      </header>

      {/* Ingredients */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBasket className="h-5 w-5" aria-hidden="true" />
            재료
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 sm:grid-cols-2">
            {recipe.ingredients.map((ri) => (
              <li
                key={ri.id}
                className="flex items-center justify-between rounded-lg border px-3 py-2"
              >
                <span className="font-medium">{ri.ingredient.name}</span>
                <Badge variant="secondary">
                  {ri.quantity} {ri.unit}
                </Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Steps */}
      <Card>
        <CardHeader>
          <CardTitle>조리 순서</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-4">
            {recipe.steps.map((step, index) => (
              <li key={index} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {index + 1}
                </span>
                <p className="flex-1 pt-1">{step}</p>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Tips */}
      {recipe.tips && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Lightbulb
                className="h-5 w-5 shrink-0 text-primary"
                aria-hidden="true"
              />
              <div>
                <h3 className="font-semibold text-primary">재료 활용 팁</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {recipe.tips}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </article>
  );
}
