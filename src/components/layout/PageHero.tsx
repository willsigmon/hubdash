import { ReactNode } from "react";

type PageHeroTheme = "navy" | "ops" | "sunrise";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  theme?: PageHeroTheme;
  align?: "left" | "center";
  maxWidth?: "default" | "wide";
  showLogo?: boolean;
  logoSrc?: string;
}

const THEME_STYLES: Record<PageHeroTheme, {
  wrapper: string;
  overlayOne?: string;
  overlayTwo?: string;
  accentText: string;
}> = {
  navy: {
    wrapper: "bg-gradient-to-r from-hti-navy via-hti-navy/95 to-hti-navy text-white",
    overlayOne: "bg-[radial-gradient(circle_at_top_right,_rgba(109,179,183,0.35),_transparent_60%)]",
    overlayTwo: "bg-[radial-gradient(circle_at_bottom_left,_rgba(255,235,59,0.25),_transparent_65%)]",
    accentText: "text-hti-yellow",
  },
  sunrise: {
    wrapper: "bg-gradient-to-r from-hti-navy via-hti-navy/90 to-hti-plum/85 text-white",
    overlayOne: "bg-[radial-gradient(circle_at_top_left,_rgba(109,179,183,0.25),_transparent_60%)]",
    overlayTwo: "bg-[radial-gradient(circle_at_bottom_right,_rgba(255,186,120,0.3),_transparent_60%)]",
    accentText: "text-hti-yellow",
  },
  ops: {
    wrapper: "bg-gradient-to-r from-hti-navy/95 via-[#0a1627] to-hti-navy/80 text-white",
    overlayOne: "bg-[radial-gradient(circle_at_top_left,_rgba(255,170,85,0.28),_transparent_55%)]",
    overlayTwo: "bg-[radial-gradient(circle_at_bottom_right,_rgba(109,179,183,0.35),_transparent_60%)]",
    accentText: "text-hti-teal",
  },
};

const WIDTH_CLASS: Record<NonNullable<PageHeroProps["maxWidth"]>, string> = {
  default: "max-w-7xl",
  wide: "max-w-[1600px]",
};

export default function PageHero({
  title,
  subtitle,
  eyebrow,
  icon,
  actions,
  theme = "navy",
  align = "left",
  maxWidth = "default",
  showLogo = true,
  logoSrc = "/hti-logo-mark.svg",
}: PageHeroProps) {
  const themeStyle = THEME_STYLES[theme];

  return (
    <header
      className={`relative overflow-hidden shadow-xl ${themeStyle.wrapper}`}
      role="banner"
    >
      {themeStyle.overlayOne && (
        <div className={`absolute inset-0 pointer-events-none opacity-35 ${themeStyle.overlayOne}`} />
      )}
      {themeStyle.overlayTwo && (
        <div className={`absolute inset-0 pointer-events-none opacity-25 ${themeStyle.overlayTwo}`} />
      )}
      <div className={`relative ${WIDTH_CLASS[maxWidth]} mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12`}>
        <div
          className={`flex flex-col gap-6 ${align === "center" ? "items-center text-center" : ""} md:flex-row md:items-center md:justify-between`}
        >
          <div className={`flex ${align === "center" ? "flex-col items-center" : "items-start"} gap-4`}
          >
            {showLogo && (
              <img
                src={logoSrc}
                alt="HTI Logo"
                className="h-12 md:h-14 w-auto drop-shadow"
              />
            )}
            <div className={`space-y-3 ${align === "center" ? "text-center" : ""}`}>
              {eyebrow && (
                <span className={`text-xs uppercase tracking-[0.3em] font-semibold ${themeStyle.accentText}`}>
                  {eyebrow}
                </span>
              )}
              <div className={`flex ${align === "center" ? "justify-center" : ""} items-center gap-3`}
              >
                {icon && <span className="text-2xl sm:text-3xl" aria-hidden>{icon}</span>}
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  {title}
                </h1>
              </div>
              {subtitle && (
                <p className="text-base md:text-xl font-medium text-white/80 max-w-2xl">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {actions && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {actions}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
