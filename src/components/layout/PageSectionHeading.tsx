import { ReactNode } from "react";

type HeadingSize = "lg" | "md" | "sm";
type HeadingAlign = "stacked" | "split";
type HeadingTone = "dark" | "light";

interface PageSectionHeadingProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  badge?: ReactNode;
  size?: HeadingSize;
  align?: HeadingAlign;
  tone?: HeadingTone;
}

const SIZE_CLASSES: Record<HeadingSize, string> = {
  lg: "text-3xl md:text-4xl",
  md: "text-2xl md:text-3xl",
  sm: "text-xl md:text-2xl",
};

const TONE_CLASSES: Record<HeadingTone, { title: string; subtitle: string; eyebrow: string }> = {
  dark: {
    title: "text-hti-navy",
    subtitle: "text-hti-stone",
    eyebrow: "text-hti-plum/70",
  },
  light: {
    title: "text-white",
    subtitle: "text-white/80",
    eyebrow: "text-white/70",
  },
};

export default function PageSectionHeading({
  title,
  subtitle,
  eyebrow,
  icon,
  actions,
  badge,
  size = "lg",
  align = "stacked",
  tone = "dark",
}: PageSectionHeadingProps) {
  const toneClasses = TONE_CLASSES[tone];

  const content = (
    <div className="space-y-3">
      {eyebrow && (
        <span className={`text-xs uppercase tracking-[0.3em] font-semibold ${toneClasses.eyebrow}`}>
          {eyebrow}
        </span>
      )}
      <div className="flex items-center gap-3">
        {icon && <span className="text-2xl" aria-hidden>{icon}</span>}
        <h2 className={`${SIZE_CLASSES[size]} font-bold ${toneClasses.title}`}>
          {title}
        </h2>
        {badge && <div className="ml-2">{badge}</div>}
      </div>
      {subtitle && (
        <p className={`text-base md:text-lg font-medium ${toneClasses.subtitle}`}>
          {subtitle}
        </p>
      )}
    </div>
  );

  if (align === "split") {
    return (
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        {content}
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {content}
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}

