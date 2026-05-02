import { useRef, useEffect, useState } from "react";

/**
 * Dispara `visible=true` cuando el elemento entra al viewport.
 * El setTimeout de 80ms garantiza que el browser pinte el estado inicial
 * (opacity:0) antes de que el observer dispare, asegurando que la animación
 * de entrada se vea incluso en secciones que hidratan con client:visible.
 */
export function useVisible() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let obs: IntersectionObserver;
    const t = setTimeout(() => {
      obs = new IntersectionObserver(
        ([entry]) => { setVisible(entry.isIntersecting); },
        { threshold: 0.06, rootMargin: "0px 0px -40px 0px" }
      );
      obs.observe(el);
    }, 80);
    return () => { clearTimeout(t); obs?.disconnect(); };
  }, []);

  return [ref, visible] as const;
}

export const reveal = (visible: boolean, from: string, delay = "0ms", dur = "750ms") => ({
  opacity: visible ? 1 : 0,
  transform: visible ? "none" : from,
  transition: `opacity ${dur} cubic-bezier(0.16,1,0.3,1) ${delay}, transform ${dur} cubic-bezier(0.16,1,0.3,1) ${delay}`,
});
