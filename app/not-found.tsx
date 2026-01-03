import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container py-16">
      <EmptyState
        icon={<Home className="h-16 w-16" />}
        title="페이지를 찾을 수 없습니다"
        description="요청하신 페이지가 존재하지 않습니다."
        action={
          <Button asChild>
            <Link href="/">홈으로 돌아가기</Link>
          </Button>
        }
      />
    </div>
  );
}
