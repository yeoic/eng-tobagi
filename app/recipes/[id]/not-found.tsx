import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { UtensilsCrossed } from "lucide-react";

export default function RecipeNotFound() {
  return (
    <div className="container py-16">
      <EmptyState
        icon={<UtensilsCrossed className="h-16 w-16" />}
        title="레시피를 찾을 수 없습니다"
        description="요청하신 레시피가 존재하지 않거나 삭제되었습니다."
        action={
          <Button asChild>
            <Link href="/recipes">레시피 목록으로</Link>
          </Button>
        }
      />
    </div>
  );
}
