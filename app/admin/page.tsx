import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ChefHat, TrendingUp } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getStats() {
  const [ingredientCount, recipeCount, recentRecipes] = await Promise.all([
    db.ingredient.count(),
    db.recipe.count(),
    db.recipe.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, createdAt: true },
    }),
  ]);

  return { ingredientCount, recipeCount, recentRecipes };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">대시보드</h1>
        <p className="text-muted-foreground">재료 다:씀 레시피 관리 현황</p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">총 재료</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.ingredientCount}</div>
            <p className="text-xs text-muted-foreground">
              <Link href="/admin/ingredients" className="hover:underline">
                재료 관리하기 &rarr;
              </Link>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">총 레시피</CardTitle>
            <ChefHat className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recipeCount}</div>
            <p className="text-xs text-muted-foreground">
              <Link href="/admin/recipes" className="hover:underline">
                레시피 관리하기 &rarr;
              </Link>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">활성 상태</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">정상</div>
            <p className="text-xs text-muted-foreground">
              모든 서비스가 정상 운영 중
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent recipes */}
      <Card>
        <CardHeader>
          <CardTitle>최근 등록된 레시피</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentRecipes.length > 0 ? (
            <ul className="space-y-2">
              {stats.recentRecipes.map((recipe) => (
                <li
                  key={recipe.id}
                  className="flex items-center justify-between border-b pb-2 last:border-0"
                >
                  <Link
                    href={`/admin/recipes/${recipe.id}`}
                    className="hover:underline"
                  >
                    {recipe.title}
                  </Link>
                  <span className="text-sm text-muted-foreground">
                    {new Date(recipe.createdAt).toLocaleDateString("ko-KR")}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">등록된 레시피가 없습니다.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
