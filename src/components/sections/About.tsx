import { useState, useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface AboutSlide {
  label: string;
  title: string;
  description: string;
  image: string;
}

interface Props {
  about: {
    badge: string;
    slides: AboutSlide[];
  };
}

export default function About({ about }: Props) {
  const sectionRef    = useRef<HTMLElement>(null);
  const imgWrapRef    = useRef<HTMLDivElement>(null);   // outer rounded container
  const imgFrameRef   = useRef<HTMLDivElement>(null);   // inner overflow-hidden frame
  const titleRef      = useRef<HTMLHeadingElement>(null);
  const textColRef    = useRef<HTMLDivElement>(null);

  const [active, setActive] = useState(0);
  const [fading, setFading] = useState(false);
  const total = about.slides.length;

  const goTo = (i: number) => {
    if (i === active) return;
    setFading(true);
    setTimeout(() => { setActive(i); setFading(false); }, 300);
  };
  const next = () => goTo(active >= total - 1 ? 0 : active + 1);

  useEffect(() => {
    const t = setInterval(next, 4500);
    return () => clearInterval(t);
  }, [active]);

  useGSAP(() => {
    const section = sectionRef.current;

    /* ── UNIQUE: grayscale → color + scale + slight rotation on image ──
       This creates an "emotional reveal" — image comes alive as you scroll in.
    ── */
    gsap.fromTo(
      imgFrameRef.current,
      { filter: "grayscale(90%) brightness(0.7)", scale: 0.92, rotate: -1.5 },
      {
        filter: "grayscale(0%) brightness(1)",
        scale: 1,
        rotate: 0,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top 90%",
          end: "top 20%",
          scrub: 1.2,
        },
      }
    );

    /* ── Image column: slow parallax from below (depth layer) ── */
    gsap.fromTo(
      imgWrapRef.current,
      { y: 70, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          end: "top 35%",
          scrub: 1,
        },
      }
    );

    /* ── Title: falls from above ── */
    gsap.fromTo(
      titleRef.current,
      { y: -30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top 88%",
          end: "top 58%",
          scrub: 0.9,
        },
      }
    );

    /* ── Text column: rises from below at a slower pace than image ──
       Different speed from image = distinct depth layers.
    ── */
    gsap.fromTo(
      textColRef.current,
      { y: 90, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "top 25%",
          scrub: 1.4,   // slower scrub = lags behind image = depth
        },
      }
    );

    /* ── Continuous lift: image moves up slightly as you scroll through ── */
    gsap.to(imgWrapRef.current, {
      y: -35,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top 35%",
        end: "bottom top",
        scrub: 1.5,
      },
    });
  }, { scope: sectionRef });

  const slide = about.slides[active];

  const LABEL_COLORS = [
    "bg-rose-50 text-rose-700 border-rose-200",
    "bg-amber-50 text-amber-700 border-amber-200",
    "bg-orange-50 text-orange-700 border-orange-200",
  ];

  return (
    <section
      ref={sectionRef}
      id="quienes-somos"
      className="relative bg-white py-16 sm:py-20 overflow-hidden"
    >
      <div className="mx-auto w-[min(1120px,92vw)]">

        <h2 ref={titleRef} className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
          {about.badge}
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start lg:gap-10">

          {/* ── Imagen: grayscale → color ── */}
          <div ref={imgWrapRef} className="will-change-transform">
            <div
              ref={imgFrameRef}
              className="relative overflow-hidden rounded-3xl shadow-xl shadow-stone-900/10 h-56 sm:h-80 lg:h-[400px] will-change-[filter,transform]"
            >
              {about.slides.map((s, i) => (
                <img
                  key={s.image}
                  src={s.image}
                  alt={s.label}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
                  style={{ opacity: i === active ? 1 : 0 }}
                />
              ))}
            </div>
          </div>

          {/* ── Texto: lag parallax ── */}
          <div ref={textColRef} className="flex flex-col justify-center lg:py-4 will-change-transform">
            <div
              style={{
                opacity: fading ? 0 : 1,
                transform: fading ? "translateY(10px)" : "none",
                transition: "opacity 300ms ease, transform 300ms ease",
              }}
            >
              <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${LABEL_COLORS[active % LABEL_COLORS.length]}`}>
                {slide.label}
              </span>
              <h2 className="mt-4 text-[clamp(1.5rem,3vw,2.2rem)] font-extrabold leading-tight tracking-tight text-stone-900">
                {slide.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-stone-600 sm:text-[0.9375rem]">
                {slide.description}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2">
              {Array.from({ length: total }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Ir a página ${i + 1}`}
                  className={[
                    "h-2.5 rounded-full border transition-all duration-500 carousel-dot",
                    i === active ? "w-8 dot-active" : "w-2.5",
                  ].join(" ")}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
