"use client";
import {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from "react";

type TechHoverCtx = {
  /** Normalized set of techs currently highlighted (from a hovered project). */
  hovered: Set<string>;
  /** Pass the raw tech labels of the hovered project, or [] to clear. */
  setHovered: (techs: string[]) => void;
  /** When true, every badge glows (e.g. hovering "More Projects"). */
  all: boolean;
  setAll: (v: boolean) => void;
};

/** Strip casing/punctuation so "Next.js" and "NextJS" match. */
export const normalizeTech = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]/g, "");

const TechHoverContext = createContext<TechHoverCtx>({
  hovered: new Set(),
  setHovered: () => {},
  all: false,
  setAll: () => {},
});

export const useTechHover = () => useContext(TechHoverContext);

export function TechHoverProvider({ children }: { children: ReactNode }) {
  const [hovered, setHoveredState] = useState<Set<string>>(new Set());
  const [all, setAll] = useState(false);

  const value = useMemo<TechHoverCtx>(
    () => ({
      hovered,
      setHovered: (techs) => setHoveredState(new Set(techs.map(normalizeTech))),
      all,
      setAll,
    }),
    [hovered, all],
  );

  return (
    <TechHoverContext.Provider value={value}>
      {children}
    </TechHoverContext.Provider>
  );
}
