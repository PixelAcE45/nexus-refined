import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Accent = "violet" | "azure" | "mint" | "amber" | "rose";
export type GlassLevel = "low" | "medium" | "high";
export type Density = "compact" | "comfortable" | "spacious";
export type Motion = "full" | "subtle" | "off";

export type Appearance = {
  accent: Accent;
  glass: GlassLevel;
  density: Density;
  motion: Motion;
};

const DEFAULTS: Appearance = {
  accent: "violet",
  glass: "medium",
  density: "comfortable",
  motion: "full",
};

const STORAGE_KEY = "nexus-appearance";

type AppearanceContextValue = Appearance & {
  set: <K extends keyof Appearance>(key: K, value: Appearance[K]) => void;
  reset: () => void;
};

const AppearanceContext = createContext<AppearanceContextValue | null>(null);

function apply(value: Appearance) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.dataset["accent"] = value.accent;
  root.dataset["glass"] = value.glass;
  root.dataset["density"] = value.density;
  root.dataset["motion"] = value.motion;
}

export function AppearanceProvider({ children }: { children: ReactNode }) {
  const [appearance, setAppearance] = useState<Appearance>(DEFAULTS);

  useEffect(() => {
    let next = DEFAULTS;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) next = { ...DEFAULTS, ...(JSON.parse(stored) as Partial<Appearance>) };
    } catch {
      next = DEFAULTS;
    }
    setAppearance(next);
    apply(next);
  }, []);

  const set = useCallback<AppearanceContextValue["set"]>((key, value) => {
    setAppearance((current) => {
      const next = { ...current, [key]: value };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      apply(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setAppearance(DEFAULTS);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULTS));
    apply(DEFAULTS);
  }, []);

  const value = useMemo(() => ({ ...appearance, set, reset }), [appearance, set, reset]);

  return <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>;
}

export function useAppearance() {
  const ctx = useContext(AppearanceContext);
  if (!ctx) throw new Error("useAppearance must be used inside AppearanceProvider");
  return ctx;
}
