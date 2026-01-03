import Link from "next/link";
import { ChefHat } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <ChefHat className="h-6 w-6 text-primary" aria-hidden="true" />
          <span>재료 다:씀</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            홈
          </Link>
          <Link
            href="/recipes"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            레시피
          </Link>
        </nav>
      </div>
    </header>
  );
}
