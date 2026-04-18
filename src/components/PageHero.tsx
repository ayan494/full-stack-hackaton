import { ReactNode } from "react";

interface Props {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  children?: ReactNode;
}

export default function PageHero({ eyebrow, title, description, children }: Props) {
  return (
    <section className="surface-ink relative overflow-hidden p-8 md:p-14 mb-10 animate-fade-up">
      <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-amber-300/20 blur-3xl animate-float" />
      <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="relative max-w-4xl">
        <p className="eyebrow-light mb-5">{eyebrow}</p>
        <h1 className="font-display text-4xl md:text-6xl leading-[1.05] mb-5">{title}</h1>
        {description && <p className="text-base md:text-lg text-primary-foreground/70 max-w-2xl">{description}</p>}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
