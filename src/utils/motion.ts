/**
 * Centralized motion utilities — GSAP-powered, reusable across all components.
 * Imported client-side only (inside useGSAP / useEffect).
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────────
   Magnetic hover — button follows cursor with spring return
   Returns a cleanup function to remove listeners.
───────────────────────────────────────────────────────────── */
export function magneticHover(el: HTMLElement, strength = 0.32) {
  const onMove = (e: MouseEvent) => {
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width  / 2) * strength;
    const y = (e.clientY - rect.top  - rect.height / 2) * strength;
    gsap.to(el, { x, y, duration: 0.35, ease: "power2.out" });
  };
  const onLeave = () => {
    gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.5)" });
  };
  el.addEventListener("mousemove", onMove);
  el.addEventListener("mouseleave", onLeave);
  return () => {
    el.removeEventListener("mousemove", onMove);
    el.removeEventListener("mouseleave", onLeave);
  };
}

/* ─────────────────────────────────────────────────────────────
   3D tilt — card rotates toward cursor with elastic reset
   Returns a cleanup function to remove listeners.
───────────────────────────────────────────────────────────── */
export function tilt3D(el: HTMLElement, intensity = 9) {
  el.style.willChange = "transform";
  const onMove = (e: MouseEvent) => {
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left)  / rect.width  - 0.5) * 2;
    const y = ((e.clientY - rect.top)   / rect.height - 0.5) * 2;
    gsap.to(el, {
      rotationY: x * intensity,
      rotationX: -y * intensity,
      transformPerspective: 700,
      ease: "power2.out",
      duration: 0.45,
    });
  };
  const onLeave = () => {
    gsap.to(el, {
      rotationY: 0,
      rotationX: 0,
      duration: 0.9,
      ease: "elastic.out(1, 0.4)",
    });
  };
  el.addEventListener("mousemove", onMove);
  el.addEventListener("mouseleave", onLeave);
  return () => {
    el.removeEventListener("mousemove", onMove);
    el.removeEventListener("mouseleave", onLeave);
  };
}

/* ─────────────────────────────────────────────────────────────
   Scrub parallax — element moves continuously as you scroll
   through its trigger. Creates depth and life.
───────────────────────────────────────────────────────────── */
export function scrubParallax(
  el: Element | null,
  trigger: Element | null,
  yFrom: number,
  yTo: number,
  scrub = 1.5
) {
  if (!el || !trigger) return;
  gsap.fromTo(
    el,
    { y: yFrom },
    {
      y: yTo,
      ease: "none",
      scrollTrigger: {
        trigger,
        start: "top bottom",
        end: "bottom top",
        scrub,
      },
    }
  );
}

/* ─────────────────────────────────────────────────────────────
   Scrub reveal — element fades + moves in as you scroll toward it
───────────────────────────────────────────────────────────── */
export function scrubReveal(
  el: Element | null,
  trigger: Element | null,
  opts: {
    fromX?: number;
    fromY?: number;
    scrub?: number;
    start?: string;
    end?: string;
  } = {}
) {
  if (!el || !trigger) return;
  const { fromX = 0, fromY = 30, scrub = 1, start = "top 88%", end = "top 35%" } = opts;
  gsap.fromTo(
    el,
    { opacity: 0, x: fromX, y: fromY },
    {
      opacity: 1,
      x: 0,
      y: 0,
      ease: "none",
      scrollTrigger: {
        trigger,
        start,
        end,
        scrub,
      },
    }
  );
}
