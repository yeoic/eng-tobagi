import { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { validateAdminAccess } from "@/lib/admin-auth";
import { Button } from "@/components/ui/button";
import { Settings, Package, ChefHat, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: {
    default: "관리자",
    template: "%s | 관리자",
  },
  robots: {
    index: false,
    follow: false,
  },
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const isAuthorized = await validateAdminAccess();

  if (!isAuthorized) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted/30 hidden md:block">
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center gap-2 px-2 py-4 border-b mb-4">
            <Settings className="h-5 w-5 text-primary" aria-hidden="true" />
            <span className="font-semibold">관리자</span>
          </div>
          <nav className="space-y-1">
            <Link
              href="/admin"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
            >
              대시보드
            </Link>
            <Link
              href="/admin/ingredients"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
            >
              <Package className="h-4 w-4" aria-hidden="true" />
              재료 관리
            </Link>
            <Link
              href="/admin/recipes"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
            >
              <ChefHat className="h-4 w-4" aria-hidden="true" />
              레시피 관리
            </Link>
          </nav>
          <div className="mt-auto pt-4 border-t">
            <Button variant="ghost" size="sm" asChild className="w-full justify-start">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                사이트로 돌아가기
              </Link>
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background p-2 flex justify-around">
        <Link href="/admin" className="flex flex-col items-center gap-1 text-xs">
          <Settings className="h-5 w-5" />
          <span>대시보드</span>
        </Link>
        <Link href="/admin/ingredients" className="flex flex-col items-center gap-1 text-xs">
          <Package className="h-5 w-5" />
          <span>재료</span>
        </Link>
        <Link href="/admin/recipes" className="flex flex-col items-center gap-1 text-xs">
          <ChefHat className="h-5 w-5" />
          <span>레시피</span>
        </Link>
      </div>

      {/* Main content */}
      <main className="flex-1 p-6 pb-20 md:pb-6">{children}</main>
    </div>
  );
}
