import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { magneticHover } from "@/utils/motion";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  contact: {
    title: string;
    description: string;
    address: string;
    mapUrl: string;
  };
}

export default function Contact({ contact }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const badgeRef   = useRef<HTMLDivElement>(null);
  const titleRef   = useRef<HTMLHeadingElement>(null);
  const descRef    = useRef<HTMLParagraphElement>(null);
  const rightRef   = useRef<HTMLDivElement>(null);
  const btnRef     = useRef<HTMLAnchorElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;

    /* ── Badge: fades in from a soft blur ── */
    gsap.fromTo(
      badgeRef.current,
      { opacity: 0, filter: "blur(6px)" },
      {
        opacity: 1,
        filter: "blur(0px)",
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top 90%",
          end: "top 65%",
          scrub: 0.7,
        },
      }
    );

    /* ── UNIQUE: Title split by CHARS with rotationX 3D flip ──
       Each character flips in on its X axis (3D rotation).
       Much slower stagger than Hero's word reveal — deliberate, elegant closure.
       This feels completely different from Hero's word-blur reveal.
    ── */
    const splitTitle = titleRef.current
      ? new SplitType(titleRef.current, { types: "chars" })
      : null;

    if (splitTitle?.chars?.length) {
      gsap.fromTo(
        splitTitle.chars,
        {
          opacity: 0,
          rotationX: -55,
          y: 20,
          transformOrigin: "50% 0% -30px",
          filter: "blur(3px)",
        },
        {
          opacity: 1,
          rotationX: 0,
          y: 0,
          filter: "blur(0px)",
          stagger: { each: 0.022, from: "start" },
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            end: "top 25%",
            scrub: 1.3,
          },
        }
      );
    }

    /* ── Description: fades word by word from opacity (no transform) ── */
    gsap.fromTo(
      descRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top 78%",
          end: "top 35%",
          scrub: 1,
        },
      }
    );

    /* ── Right col: scale-up reveal (not directional slide) ── */
    gsap.fromTo(
      rightRef.current,
      { opacity: 0, scale: 0.88 },
      {
        opacity: 1,
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "top 30%",
          scrub: 1,
        },
      }
    );

    /* ── Magnetic CTA ── */
    const cleanups: Array<() => void> = [];
    if (btnRef.current) cleanups.push(magneticHover(btnRef.current, 0.25));

    return () => {
      cleanups.forEach((fn) => fn());
      splitTitle?.revert();
    };
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="contacto" className="bg-stone-950 py-20 sm:py-28 overflow-hidden">
      {/* Subtle breathing glow — atmospheric closure */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hero-glow"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(159,18,57,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto w-[min(1120px,92vw)]">

        <div ref={badgeRef}>
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-rose-500">
            <span className="h-px w-6 bg-rose-500" />
            Encuéntranos
          </span>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-end">

          {/* Title + description — char reveal */}
          <div>
            <h2
              ref={titleRef}
              className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-extrabold leading-tight tracking-tight text-white"
              style={{ perspective: "500px", perspectiveOrigin: "50% 50%" }}
            >
              {contact.title}
            </h2>
            <p ref={descRef} className="mt-4 text-sm leading-relaxed text-stone-400 sm:text-base">
              {contact.description}
            </p>
          </div>

          {/* Dirección + botón — scale reveal */}
          <div ref={rightRef} className="flex flex-col gap-5 lg:items-end will-change-transform">
            <div className="inline-flex items-start gap-3">
              <p className="text-sm font-medium leading-relaxed text-stone-300">
                {contact.address}
              </p>
            </div>

            <a
              ref={btnRef}
              href={contact.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-full bg-rose-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-900/40 transition-colors duration-300 hover:bg-rose-500 hover:shadow-xl hover:shadow-rose-900/50"
              style={{ willChange: "transform" }}
            >
              Ver en Google Maps
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 opacity-80" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
