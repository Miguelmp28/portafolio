import { useRef, useEffect, useState, useCallback } from "react";
import { useVisible, reveal as revealStyle } from "@/hooks/useVisible";

interface EventItem {
  day: string;
  title: string;
  time: string;
  place: string;
}

interface Props {
  events: EventItem[];
}

const normalize = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

const DAY_ALIASES: Record<string, string> = {
  domingo: "Domingo", lunes: "Lunes", martes: "Martes",
  miercoles: "Miércoles", jueves: "Jueves", viernes: "Viernes", sabado: "Sábado",
};

const DAY_COLORS: Record<string, string> = {
  martes:    "text-rose-700 bg-rose-50 border-rose-200",
  miercoles: "text-amber-700 bg-amber-50 border-amber-200",
  jueves:    "text-stone-700 bg-stone-100 border-stone-300",
  viernes:   "text-orange-700 bg-orange-50 border-orange-200",
  sabado:    "text-blue-700 bg-blue-50 border-blue-200",
  domingo:   "text-purple-700 bg-purple-50 border-purple-200",
  lunes:     "text-green-700 bg-green-50 border-green-200",
};

export default function Schedule({ events }: Props) {
  const [sectionRef, visible] = useVisible();
  const trackRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const [itemIndex, setItemIndex] = useState(0);
  const [stepPx, setStepPx] = useState(0);
  const [perPage, setPerPage] = useState(2);
  const [todayKey, setTodayKey] = useState<string | null>(null);

  const maxIndex = Math.max(0, events.length - perPage);
  const totalPages = Math.max(1, Math.ceil(events.length / perPage));
  const activePage = Math.round(itemIndex / Math.max(1, perPage));

  useEffect(() => {
    const bogotaDay = new Intl.DateTimeFormat("es-CO", {
      weekday: "long",
      timeZone: "America/Bogota",
    }).format(new Date());
    const norm = normalize(bogotaDay);
    const alias = DAY_ALIASES[norm];
    if (alias) setTodayKey(alias);
  }, []);

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
    setItemIndex((i) => Math.min(i, Math.max(0, events.length - pp)));
  }, [events.length]);

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

  // Navigate to today's event
  useEffect(() => {
    if (!todayKey) return;
    const idx = events.findIndex((e) => e.day === todayKey);
    if (idx >= 0) {
      setItemIndex(Math.min(idx, maxIndex));
    }
  }, [todayKey, maxIndex, events]);

  const next = () => setItemIndex((i) => Math.min(maxIndex, i + perPage));
  const prev = () => setItemIndex((i) => Math.max(0, i - perPage));
  const goTo = (p: number) => setItemIndex(Math.max(0, Math.min(maxIndex, p * perPage)));

  const touchStart = useRef(0);
  const touchEnd = useRef(0);

  return (
    <section id="agenda" className="bg-white py-16 sm:py-20">
      <div ref={sectionRef} className="mx-auto w-[min(1120px,92vw)]">

        <div style={revealStyle(visible, "translateX(-28px)")}>
          <h2 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
            Agenda de la semana
          </h2>
        </div>
        <div style={revealStyle(visible, "translateY(20px)", "80ms")}>
          <p className="mt-1 text-sm text-stone-600 sm:text-base">
            Ven y participa en nuestros encuentros de fe.
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
              {events.map((event) => {
                const isToday = event.day === todayKey;
                const dayNorm = normalize(event.day);
                const dayColorClass = DAY_COLORS[dayNorm] ?? "text-stone-700 bg-stone-100 border-stone-300";

                return (
                  <article
                    key={`${event.day}-${event.title}`}
                    className={[
                      "shrink-0 basis-1/2 lg:basis-[calc(33.333%-8px)] rounded-2xl border p-4 shadow-sm transition-all duration-300 hover:shadow-md",
                      isToday
                        ? "border-amber-400 bg-amber-50 shadow-amber-100"
                        : "border-stone-200 bg-stone-50 hover:border-stone-300",
                    ].join(" ")}
                  >
                    {isToday && (
                      <div className="mb-2 flex items-center gap-1.5">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500" />
                        <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">Hoy</span>
                      </div>
                    )}
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${dayColorClass}`}
                    >
                      {event.day}
                    </span>
                    <h3 className="mt-2.5 text-base font-bold text-stone-900 leading-snug">
                      {event.title}
                    </h3>
                    <div className="mt-2 flex flex-col gap-0.5">
                      <p className="flex items-center gap-1.5 text-sm text-stone-600">
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0 text-stone-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                        </svg>
                        {event.time}
                      </p>
                      <p className="flex items-center gap-1.5 text-xs text-stone-500">
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0 text-stone-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 21s7-5.68 7-11a7 7 0 1 0-14 0c0 5.32 7 11 7 11Z" /><circle cx="12" cy="10" r="2" />
                        </svg>
                        {event.place}
                      </p>
                    </div>
                  </article>
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
