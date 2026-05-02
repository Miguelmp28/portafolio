import { useRef, useState, useCallback, useEffect } from "react";
import { useVisible, reveal as revealStyle } from "@/hooks/useVisible";

interface Props {
  ministries: string[];
}

function ministryIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes("niño") || n.includes("familia")) {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
  }
  if (n.includes("joven") || n.includes("juventud")) {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    );
  }
  if (n.includes("music") || n.includes("adorac")) {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
      </svg>
    );
  }
  if (n.includes("interce") || n.includes("oraci")) {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2" /><path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2" />
        <path d="M10 10.5a2 2 0 0 0-2-2a2 2 0 0 0-2 2V17a6 6 0 0 0 6 6 6 6 0 0 0 6-6V11a2 2 0 0 0-2-2a2 2 0 0 0-2 2" />
      </svg>
    );
  }
  if (n.includes("ujier")) {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
      </svg>
    );
  }
  if (n.includes("caball")) {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
    </svg>
  );
}

const CARD_COLORS = [
  { bg: "bg-rose-50", border: "border-rose-200", icon: "bg-rose-100 text-rose-700 border-rose-200", text: "text-rose-800" },
  { bg: "bg-amber-50", border: "border-amber-200", icon: "bg-amber-100 text-amber-700 border-amber-200", text: "text-amber-800" },
  { bg: "bg-stone-50", border: "border-stone-200", icon: "bg-stone-100 text-stone-700 border-stone-200", text: "text-stone-700" },
  { bg: "bg-orange-50", border: "border-orange-200", icon: "bg-orange-100 text-orange-700 border-orange-200", text: "text-orange-800" },
  { bg: "bg-yellow-50", border: "border-yellow-200", icon: "bg-yellow-100 text-yellow-700 border-yellow-200", text: "text-yellow-800" },
  { bg: "bg-red-50", border: "border-red-200", icon: "bg-red-100 text-red-700 border-red-200", text: "text-red-800" },
];

export default function Ministries({ ministries }: Props) {
  const [sectionRef, visible] = useVisible();
  const trackRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const [itemIndex, setItemIndex] = useState(0);
  const [stepPx, setStepPx] = useState(0);
  const [perPage, setPerPage] = useState(2);

  const maxIndex = Math.max(0, ministries.length - perPage);
  const totalPages = Math.max(1, Math.ceil(ministries.length / perPage));
  const activePage = Math.round(itemIndex / Math.max(1, perPage));

  const measure = useCallback(() => {
    const track = trackRef.current;
    const view = viewRef.current;
    if (!track || !view) return;
    const first = track.children[0] as HTMLElement | undefined;
    if (!first) return;
    const gap = parseFloat(getComputedStyle(track).gap || "0");
    const w = first.getBoundingClientRect().width + gap;
    const pp = Math.max(1, Math.round((view.clientWidth + gap) / w));
    setStepPx(w);
    setPerPage(pp);
    setItemIndex((i) => Math.min(i, Math.max(0, ministries.length - pp)));
  }, [ministries.length]);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  useEffect(() => {
    if (trackRef.current && stepPx > 0) {
      trackRef.current.style.transform = `translateX(-${itemIndex * stepPx}px)`;
    }
  }, [itemIndex, stepPx]);

  const next = () => setItemIndex((i) => Math.min(maxIndex, i + perPage));
  const prev = () => setItemIndex((i) => Math.max(0, i - perPage));
  const goTo = (p: number) => setItemIndex(Math.max(0, Math.min(maxIndex, p * perPage)));

  const touchStart = useRef(0);
  const touchEnd = useRef(0);

  return (
    <section id="ministerios" className="bg-white py-16 sm:py-20">
      <div ref={sectionRef} className="mx-auto w-[min(1120px,92vw)]">

        <div style={revealStyle(visible, "translateX(-28px)")}>
          <h2 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
            Ministerios activos
          </h2>
        </div>
        <div style={revealStyle(visible, "translateY(20px)", "80ms")}>
          <p className="mt-1 text-sm text-stone-500 sm:text-base">
            Conoce las áreas donde servimos y crecemos juntos.
          </p>
        </div>

        <div className="mt-8" style={revealStyle(visible, "translateY(28px)", "160ms")}>
          <div
            ref={viewRef}
            className="overflow-hidden"
            onTouchStart={(e) => { touchStart.current = e.touches[0].clientX; }}
            onTouchMove={(e) => { touchEnd.current = e.touches[0].clientX; }}
            onTouchEnd={() => {
              const delta = touchEnd.current - touchStart.current;
              if (Math.abs(delta) > 40) { delta < 0 ? next() : prev(); }
            }}
          >
            <div
              ref={trackRef}
              className="flex gap-3 transition-transform duration-700 ease-out will-change-transform"
            >
              {ministries.map((item, i) => {
                const colors = CARD_COLORS[i % CARD_COLORS.length];
                return (
                  <div
                    key={item}
                    className={`shrink-0 basis-1/2 lg:basis-[calc(33.333%-8px)] rounded-2xl border ${colors.bg} ${colors.border} p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md cursor-default`}
                  >
                    <span className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border ${colors.icon}`}>
                      {ministryIcon(item)}
                    </span>
                    <p className={`mt-3 text-sm font-semibold leading-snug ${colors.text}`}>
                      {item}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dots */}
          <div
            className="mt-4 flex items-center justify-center gap-2"
            style={revealStyle(visible, "scale(0.8)", "260ms", "500ms")}
          >
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Ir a página ${i + 1}`}
                className={[
                  "h-2.5 rounded-full border transition-all duration-500 carousel-dot",
                  i === activePage ? "w-8 dot-active" : "w-2.5",
                ].join(" ")}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
