interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function Section({ children, className = "", id }: SectionProps) {
  return (
    <section id={id} className={`relative mx-auto w-full max-w-6xl px-6 py-16 sm:px-8 ${className}`}>
      {children}
    </section>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-border-strong bg-card px-3 py-1 text-xs font-medium uppercase tracking-wider text-muted">
      {children}
    </span>
  );
}
