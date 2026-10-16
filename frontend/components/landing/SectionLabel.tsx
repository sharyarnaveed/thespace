export function SectionLabel({ index, children, light = false }: { index: string; children: string; light?: boolean }) {
  return (
    <p className={`flex items-center gap-3 font-mono text-[0.72rem] uppercase tracking-[0.16em] ${light ? "text-paper/70" : "text-muted"}`}>
      <span className={`inline-flex h-6 min-w-6 items-center justify-center px-1 font-pixel text-[0.65rem] ${light ? "bg-sun text-ink" : "bg-ink text-paper"}`}>
        {index}
      </span>
      {children}
    </p>
  );
}
