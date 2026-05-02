import { useVisible, reveal } from "@/hooks/useVisible";

interface Props {
  hero: {
    title?: string;
    description: string;
    primaryCta: { href: string; label: string };
    secondaryCta: { href: string; label: string };
  };
}

export default function Hero({ hero }: Props) {
  const [sectionRef, visible] = useVisible();

  return (
    <section id="inicio" className="relative min-h-[92vh] overflow-hidden">

      {/* ── Imagen de fondo ── */}
      <img
        src="/assests/img2.webp"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover object-center"
        loading="eager"
      />

      {/* ── Overlay base: oscurece toda la imagen levemente ── */}
      <div aria-hidden className="absolute inset-0 bg-stone-950/30" />

      {/* ── Gradient panel izquierdo: fondo del texto en desktop ── */}
      {/* En mobile cubre todo; en desktop se desvanece hacia la derecha */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: [
            /* mobile: oscuro uniforme */
            "linear-gradient(to bottom, rgba(10,6,4,0.82) 0%, rgba(10,6,4,0.78) 100%)",
          ].join(", "),
        }}
      />
      {/* Desktop: reemplaza con degradado lateral */}
      <div
        aria-hidden
        className="absolute inset-0 hidden lg:block"
        style={{
          background:
            "linear-gradient(to right, rgba(10,6,4,0.90) 0%, rgba(10,6,4,0.88) 38%, rgba(10,6,4,0.55) 58%, rgba(10,6,4,0.10) 78%, transparent 100%)",
        }}
      />

      {/* ── Tinte rose cálido en la esquina ── */}
      <div
        aria-hidden
        className="absolute inset-0 hidden lg:block"
        style={{
          background:
            "linear-gradient(135deg, rgba(159,18,57,0.20) 0%, transparent 50%)",
        }}
      />

      {/* ── Contenido ── */}
      <div
        ref={sectionRef}
        className="relative flex min-h-[92vh] items-end pb-14 sm:items-center sm:pb-0"
      >
        <div className="mx-auto w-[min(1120px,92vw)] py-14 sm:py-20">
          {/* En desktop, limitar ancho del texto para que la imagen se vea a la derecha */}
          <div className="lg:max-w-[52%]">

            {/* Badge */}
            <div style={reveal(visible, "translateY(16px)", "80ms")}>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/12 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-rose-400" />
                Barranquilla, Colombia
              </span>
            </div>

            {/* Título */}
            {hero.title && (
              <div style={reveal(visible, "translateY(20px)", "170ms")}>
                <h1 className="mt-5 max-w-[20ch] text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-tight tracking-tight text-white">
                  {hero.title}
                </h1>
              </div>
            )}

            {/* Descripción */}
            <div style={reveal(visible, "translateY(18px)", "270ms")}>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-white/75 sm:text-[0.9375rem]">
                {hero.description}
              </p>
            </div>

            {/* CTAs */}
            <div
              className="mt-8 flex flex-wrap gap-3"
              style={reveal(visible, "translateY(16px)", "360ms")}
            >
              <a
                href={hero.primaryCta.href}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-bold text-stone-900 shadow-lg transition-all duration-300 hover:bg-rose-50 hover:shadow-xl active:scale-95"
              >
                {hero.primaryCta.label}
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
              <a
                href={hero.secondaryCta.href}
                className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-6 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/25 active:scale-95"
              >
                {hero.secondaryCta.label}
              </a>
            </div>

            {/* Stats */}
            <div
              className="mt-12 flex flex-wrap gap-8 border-t border-white/20 pt-8"
              style={reveal(visible, "translateY(14px)", "460ms")}
            >
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

      {/* ── Ola integrada — mismos paths y altura que WaveDivider ── */}
      <div className="absolute bottom-0 inset-x-0 z-10">
        <svg
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          className="block h-16 w-full sm:h-24 lg:h-32"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0,52 C260,72 500,34 740,56 C960,76 1200,38 1380,54 C1420,58 1440,52 1440,52 L1440,100 L0,100 Z" fill="#ffffff" fillOpacity="0.08" />
          <path d="M0,38 C260,60 500,18 740,42 C960,64 1200,22 1380,40 C1420,44 1440,38 1440,38 L1440,100 L0,100 Z" fill="#ffffff" fillOpacity="1"    />
        </svg>
      </div>

    </section>
  );
}
