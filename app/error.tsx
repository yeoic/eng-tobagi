"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container py-16">
      <EmptyState
        icon={<AlertCircle className="h-16 w-16" />}
        title="오류가 발생했습니다"
        description="페이지를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요."
        action={
          <Button onClick={() => reset()}>다시 시도</Button>
        }
      />
    </div>
  );
}
