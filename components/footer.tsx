export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          재료 다:씀 레시피 - 남은 재료를 활용한 레시피 추천
        </p>
        <p className="text-center text-sm text-muted-foreground">
          MVP v0.1.0
        </p>
      </div>
    </footer>
  );
}
