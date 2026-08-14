"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Delay in ms before the reveal starts, once in view. Use to stagger groups. */
  delay?: number;
  /** Vertical offset in px the element travels while revealing. */
  y?: number;
};

/**
 * Fades an element in and lifts it slightly as it enters the viewport.
 * Fires once, on scroll, rather than on mount — so long pages don't burn
 * every animation at load time. Falls back to an instant, static reveal
 * when the visitor has requested reduced motion.
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
  y = 14,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(query.matches);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduceMotion) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -64px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduceMotion]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transitionProperty: "opacity, transform",
        transitionDuration: "700ms",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        transitionDelay: `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0px)" : `translateY(${y}px)`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
