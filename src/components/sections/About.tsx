import { useState, useEffect } from "react";
import { useVisible, reveal } from "@/hooks/useVisible";

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
  const [sectionRef, visible] = useVisible();
  const [active, setActive] = useState(0);
  const [fading, setFading] = useState(false);
  const total = about.slides.length;

  const goTo = (i: number) => {
    if (i === active) return;
    setFading(true);
    setTimeout(() => {
      setActive(i);
      setFading(false);
    }, 300);
  };

  const next = () => goTo(active >= total - 1 ? 0 : active + 1);
  const prev = () => goTo(active <= 0 ? total - 1 : active - 1);

  useEffect(() => {
    const t = setInterval(next, 4500);
    return () => clearInterval(t);
  }, [active]);

  const slide = about.slides[active];

  const LABEL_COLORS = [
    "bg-rose-50 text-rose-700 border-rose-200",
    "bg-amber-50 text-amber-700 border-amber-200",
    "bg-orange-50 text-orange-700 border-orange-200",
  ];

  return (
    <section id="quienes-somos" className="bg-white py-16 sm:py-20">
      <div ref={sectionRef} className="mx-auto w-[min(1120px,92vw)]">

        {/* Badge */}
        <div style={reveal(visible, "translateY(12px)", "0ms")}>
          <h2 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
            {about.badge} 
          </h2>            
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start lg:gap-10">

          {/* ── Columna izquierda: imagen + nav debajo ── */}
          <div style={reveal(visible, "translateX(-24px)", "100ms", "800ms")}>

            {/* Imagen con crossfade */}
            <div className="relative overflow-hidden rounded-3xl shadow-xl shadow-stone-900/10 h-56 sm:h-80 lg:h-[400px]">
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

          {/* ── Columna derecha: texto del slide activo ── */}
          <div
            style={reveal(visible, "translateX(24px)", "200ms", "800ms")}
            className="flex flex-col justify-center lg:py-4"
          >
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
