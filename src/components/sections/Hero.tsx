import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
<<<<<<< HEAD
=======
import SplitType from "split-type";
import { magneticHover } from "@/utils/motion";
>>>>>>> 3c283aa10f66add8e0cfbe38d9996c6f09e47202

gsap.registerPlugin(ScrollTrigger);

interface Props {
  hero: {
    title?: string;
    description: string;
    primaryCta: { href: string; label: string };
    secondaryCta: { href: string; label: string };
  };
}

export default function Hero({ hero }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef      = useRef<HTMLImageElement>(null);
  const badgeRef   = useRef<HTMLDivElement>(null);
<<<<<<< HEAD
  const titleRef   = useRef<HTMLDivElement>(null);
  const descRef    = useRef<HTMLDivElement>(null);
=======
  const titleRef   = useRef<HTMLHeadingElement>(null);
  const descRef    = useRef<HTMLParagraphElement>(null);
>>>>>>> 3c283aa10f66add8e0cfbe38d9996c6f09e47202
  const ctasRef    = useRef<HTMLDivElement>(null);
  const statsRef   = useRef<HTMLDivElement>(null);

  useGSAP(() => {
<<<<<<< HEAD
    /* ── Ken Burns en la imagen de fondo ── */
    gsap.from(bgRef.current, {
      scale: 1.1,
      duration: 8,
      ease: "power2.out",
    });

    /* ── Entrada escalonada del contenido ── */
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.from(badgeRef.current, { opacity: 0, y: 20, duration: 0.9 }, 0.2);
    tl.from(titleRef.current, { opacity: 0, y: 28, duration: 0.9 }, 0.4);
    tl.from(descRef.current,  { opacity: 0, y: 22, duration: 0.9 }, 0.6);
    tl.from(
      ctasRef.current ? Array.from(ctasRef.current.children) : [],
      { opacity: 0, y: 18, stagger: 0.12, duration: 0.8 },
      0.75
    );
    tl.from(
      statsRef.current ? Array.from(statsRef.current.children) : [],
      { opacity: 0, y: 14, stagger: 0.08, duration: 0.7 },
      0.9
    );

    /* ── Parallax del fondo al hacer scroll (solo la imagen, nunca el texto) ── */
    gsap.to(bgRef.current, {
      yPercent: 25,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1.5,
      },
    });

=======
    /* ── SplitType: word-by-word reveals ── */
    const splitTitle = titleRef.current
      ? new SplitType(titleRef.current, { types: "words" })
      : null;
    const splitDesc = descRef.current
      ? new SplitType(descRef.current, { types: "words" })
      : null;

    /* ── Ken Burns background ── */
    gsap.from(bgRef.current, { scale: 1.12, duration: 7, ease: "power2.out" });

    /* ── Cinematic entrance timeline ── */
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

    tl.from(badgeRef.current, { opacity: 0, y: 24, filter: "blur(8px)", duration: 1.0 });

    if (splitTitle?.words?.length) {
      tl.from(
        splitTitle.words,
        { opacity: 0, y: 44, filter: "blur(5px)", stagger: { each: 0.07, from: "start" }, duration: 0.85 },
        "-=0.55"
      );
    } else if (titleRef.current) {
      tl.from(titleRef.current, { opacity: 0, y: 36, duration: 1.0 }, "-=0.55");
    }

    if (splitDesc?.words?.length) {
      tl.from(
        splitDesc.words,
        { opacity: 0, y: 22, stagger: { each: 0.035, from: "start" }, duration: 0.65 },
        "-=0.45"
      );
    } else if (descRef.current) {
      tl.from(descRef.current, { opacity: 0, y: 22, duration: 0.85 }, "-=0.45");
    }

    tl.from(
      ctasRef.current ? Array.from(ctasRef.current.children) : [],
      { opacity: 0, y: 20, stagger: 0.12, duration: 0.75 },
      "-=0.35"
    );
    tl.from(
      statsRef.current ? Array.from(statsRef.current.children) : [],
      { opacity: 0, y: 18, stagger: 0.08, duration: 0.65 },
      "-=0.4"
    );

    /* ── Magnetic CTAs ── */
    const cleanups: Array<() => void> = [];
    tl.call(() => {
      if (ctasRef.current) {
        Array.from(ctasRef.current.children).forEach((el) => {
          cleanups.push(magneticHover(el as HTMLElement, 0.28));
        });
      }
    });

    /* ── Background parallax on scroll ── */
    gsap.to(bgRef.current, {
      yPercent: 20,
      ease: "none",
      scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 1.5 },
    });

    /* ── Content parallax (slightly faster than bg) ── */
    gsap.to(".hero-content-inner", {
      yPercent: 8,
      ease: "none",
      scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 2 },
    });

    return () => {
      cleanups.forEach((fn) => fn());
      splitTitle?.revert();
      splitDesc?.revert();
    };
>>>>>>> 3c283aa10f66add8e0cfbe38d9996c6f09e47202
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="inicio"
      className="relative overflow-hidden"
<<<<<<< HEAD
      style={{ minHeight: "92vh", marginBottom: "-1px" }}
    >
      {/* Imagen de fondo */}
=======
      style={{ height: "100vh" }}
    >
      {/* Background image */}
>>>>>>> 3c283aa10f66add8e0cfbe38d9996c6f09e47202
      <img
        ref={bgRef}
        src="/assests/img2.webp"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover object-center will-change-transform"
        loading="eager"
      />

<<<<<<< HEAD
      {/* Overlay base */}
      <div aria-hidden className="absolute inset-0 bg-stone-950/30" />

      {/* Gradiente móvil */}
=======
      {/* Base overlay */}
      <div aria-hidden className="absolute inset-0 bg-stone-950/30" />

      {/* Mobile gradient */}
>>>>>>> 3c283aa10f66add8e0cfbe38d9996c6f09e47202
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: "linear-gradient(to bottom, rgba(10,6,4,0.82) 0%, rgba(10,6,4,0.78) 100%)" }}
      />

<<<<<<< HEAD
      {/* Gradiente lateral desktop */}
=======
      {/* Desktop lateral gradient */}
>>>>>>> 3c283aa10f66add8e0cfbe38d9996c6f09e47202
      <div
        aria-hidden
        className="absolute inset-0 hidden lg:block"
        style={{ background: "linear-gradient(to right, rgba(10,6,4,0.90) 0%, rgba(10,6,4,0.88) 38%, rgba(10,6,4,0.55) 58%, rgba(10,6,4,0.10) 78%, transparent 100%)" }}
      />

<<<<<<< HEAD
      {/* Tinte rose cálido */}
      <div
        aria-hidden
        className="absolute inset-0 hidden lg:block"
        style={{ background: "linear-gradient(135deg, rgba(159,18,57,0.20) 0%, transparent 50%)" }}
      />

      {/* Contenido — pb-20 en móvil para que la ola no tape los stats */}
      <div className="relative z-10 flex items-end pb-20 sm:items-center sm:pb-0" style={{ minHeight: "92vh" }}>
        <div className="mx-auto w-[min(1120px,92vw)] py-14 sm:py-20">
=======
      {/* Rose atmospheric glow */}
      <div
        aria-hidden
        className="absolute inset-0 hidden lg:block hero-glow"
        style={{ background: "linear-gradient(135deg, rgba(159,18,57,0.22) 0%, transparent 52%)" }}
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 60% at 18% 50%, rgba(159,18,57,0.10) 0%, transparent 70%)" }}
      />

      {/* Content */}
      <div className="relative z-[20] flex h-full items-end pb-14 sm:items-center sm:pb-0">
        <div className="hero-content-inner mx-auto w-[min(1120px,92vw)] py-14 sm:py-20">
>>>>>>> 3c283aa10f66add8e0cfbe38d9996c6f09e47202
          <div className="lg:max-w-[52%]">

            {/* Badge */}
            <div ref={badgeRef}>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/12 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-rose-400" />
                Barranquilla, Colombia
              </span>
            </div>

            {/* Title */}
            {hero.title && (
<<<<<<< HEAD
              <div ref={titleRef}>
                <h1 className="mt-5 max-w-[20ch] text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-tight tracking-tight text-white">
                  {hero.title}
                </h1>
              </div>
            )}

            {/* Descripción */}
            <div ref={descRef}>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-white/75 sm:text-[0.9375rem]">
                {hero.description}
              </p>
            </div>
=======
              <h1
                ref={titleRef}
                className="mt-5 max-w-[20ch] text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-tight tracking-tight text-white"
              >
                {hero.title}
              </h1>
            )}

            {/* Description */}
            <p
              ref={descRef}
              className="mt-4 max-w-md text-sm leading-relaxed text-white/75 sm:text-[0.9375rem]"
            >
              {hero.description}
            </p>
>>>>>>> 3c283aa10f66add8e0cfbe38d9996c6f09e47202

            {/* CTAs */}
            <div ref={ctasRef} className="mt-8 flex flex-wrap gap-3">
              <a
                href={hero.primaryCta.href}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-bold text-stone-900 shadow-lg transition-colors duration-300 hover:bg-rose-50 hover:shadow-xl"
                style={{ willChange: "transform" }}
              >
                {hero.primaryCta.label}
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
              <a
                href={hero.secondaryCta.href}
                className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-6 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors duration-300 hover:bg-white/25 hover:border-white/50"
                style={{ willChange: "transform" }}
              >
                {hero.secondaryCta.label}
              </a>
            </div>

            {/* Stats */}
            <div ref={statsRef} className="mt-12 flex flex-wrap gap-8 border-t border-white/20 pt-8">
              {[
                { value: "6+", label: "Eventos por semana" },
                { value: "6",  label: "Ministerios activos" },
                { value: "∞",  label: "Comunidad abierta"  },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col gap-0.5">
                  <span className="text-2xl font-extrabold text-white">{stat.value}</span>
                  <span className="text-xs font-medium text-white/55">{stat.label}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
<<<<<<< HEAD

      {/* ── Ola ──
          Sin color de fondo en el contenedor: el hero se ve
          naturalmente sobre la curva (foto + overlays existentes).
          Blanco debajo de la curva = color del About section (bg-white).
          rect al fondo cierra cualquier artefacto de subpíxel.
          -mb-px en el <section> solapa 1px con About para eliminar la línea.
      */}
      <div className="absolute bottom-0 inset-x-0 z-20 pointer-events-none leading-[0]">
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          className="block w-full h-14 sm:h-20 lg:h-28"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,40 C360,65 1080,15 1440,40 L1440,80 L0,80 Z"
            fill="#ffffff"
          />
          <rect x="0" y="76" width="1440" height="4" fill="#ffffff" />
        </svg>
      </div>

=======
>>>>>>> 3c283aa10f66add8e0cfbe38d9996c6f09e47202
    </section>
  );
}
