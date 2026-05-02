import { useRef, useEffect, useState, useCallback } from "react";
import { useVisible, reveal as revealStyle } from "@/hooks/useVisible";

interface GalleryItem {
  src: string;
  alt: string;
  caption?: string;
}

interface Props {
  gallery: GalleryItem[];
}

function Lightbox({ image, onClose }: { image: GalleryItem; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-950/95 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={image.src} alt={image.alt} className="w-full object-cover max-h-[85vh]" />
        {image.caption && (
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-stone-950/90 to-transparent px-6 py-4">
            <p className="text-sm font-medium text-white/90">{image.caption}</p>
          </div>
        )}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          aria-label="Cerrar imagen"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function Gallery({ gallery }: Props) {
  const [sectionRef, visible] = useVisible();
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  /* ── Desktop: featured + thumbnails ── */
  const GROUP = 4;
  const totalGroups = Math.max(1, Math.ceil(gallery.length / GROUP));
  const [groupIndex,     setGroupIndex]     = useState(0);
  const [featuredIndex,  setFeaturedIndex]  = useState(0); // index within group
  const [fading,         setFading]         = useState(false);

  const currentGroup = gallery.slice(groupIndex * GROUP, groupIndex * GROUP + GROUP);
  const featured     = currentGroup[featuredIndex] ?? currentGroup[0];
  const thumbs       = currentGroup.filter((_, i) => i !== featuredIndex);

  const goGroup = (g: number) => {
    setFading(true);
    setTimeout(() => { setGroupIndex(g); setFeaturedIndex(0); setFading(false); }, 320);
  };
  const nextGroup = () => goGroup(groupIndex >= totalGroups - 1 ? 0 : groupIndex + 1);

  const selectThumb = (indexInGroup: number) => {
    if (indexInGroup === featuredIndex) return;
    setFading(true);
    setTimeout(() => { setFeaturedIndex(indexInGroup); setFading(false); }, 320);
  };

  /* Auto-play */
  useEffect(() => {
    const t = setInterval(nextGroup, 5000);
    return () => clearInterval(t);
  }, [groupIndex]);

  /* ── Mobile: simple carousel ── */
  const trackRef = useRef<HTMLDivElement>(null);
  const viewRef  = useRef<HTMLDivElement>(null);
  const [itemIndex, setItemIndex] = useState(0);
  const [stepPx,    setStepPx]   = useState(0);
  const [perPage,   setPerPage]  = useState(1);

  const maxIndex   = Math.max(0, gallery.length - perPage);
  const totalPages = Math.max(1, Math.ceil(gallery.length / perPage));
  const activePage = Math.round(itemIndex / Math.max(1, perPage));

  const measure = useCallback(() => {
    const track = trackRef.current;
    const view  = viewRef.current;
    if (!track || !view) return;
    const first = track.children[0] as HTMLElement | undefined;
    if (!first) return;
    const gap = parseFloat(getComputedStyle(track).gap || "0");
    const w   = first.getBoundingClientRect().width + gap;
    const pp  = Math.max(1, Math.round((view.clientWidth + gap) / w));
    setStepPx(w);
    setPerPage(pp);
    setItemIndex((i) => Math.min(i, Math.max(0, gallery.length - pp)));
  }, [gallery.length]);

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

  const mNext = () => setItemIndex((i) => (i >= maxIndex ? 0 : Math.min(maxIndex, i + perPage)));
  const mPrev = () => setItemIndex((i) => Math.max(0, i - perPage));
  const goTo  = (p: number) => setItemIndex(Math.max(0, Math.min(maxIndex, p * perPage)));

  const touchStart = useRef(0);
  const touchEnd   = useRef(0);

  return (
    <>
      {lightbox && <Lightbox image={lightbox} onClose={() => setLightbox(null)} />}

      <section id="galeria" className="bg-stone-950 py-16 sm:py-20">
        <div ref={sectionRef} className="mx-auto w-[min(1120px,92vw)]">

          {/* Header */}
          <div className="flex items-end justify-between">
            <div>
              <div style={revealStyle(visible, "translateX(-24px)")}>
                <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Galería de comunidad
                </h2>
              </div>
              <div style={revealStyle(visible, "translateY(16px)", "80ms")}>
                <p className="mt-1 text-sm text-stone-400 sm:text-base">
                  Momentos de fe, esperanza y vida en comunidad.
                </p>
              </div>
            </div>

            {/* Group counter — desktop only */}
            <div
              className="hidden lg:flex items-center gap-1.5 text-xs font-medium text-stone-500"
              style={revealStyle(visible, "translateY(12px)", "120ms")}
            >
              {Array.from({ length: totalGroups }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goGroup(i)}
                  className={[
                    "h-1.5 rounded-full transition-all duration-500",
                    i === groupIndex ? "w-6 bg-rose-500" : "w-1.5 bg-stone-600 hover:bg-stone-400",
                  ].join(" ")}
                  aria-label={`Grupo ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* ── Desktop: featured layout ── */}
          <div
            className="mt-8 hidden lg:grid lg:grid-cols-[1fr_auto] lg:gap-3"
            style={revealStyle(visible, "translateY(28px)", "160ms")}
          >
            {/* Featured image */}
            <div
              className="relative cursor-pointer overflow-hidden rounded-2xl bg-stone-800"
              style={{ aspectRatio: "16/9" }}
              onClick={() => setLightbox(featured)}
            >
              <img
                src={featured?.src}
                alt={featured?.alt}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
                style={{
                  opacity: fading ? 0 : 1,
                  transform: fading ? "scale(1.04)" : "scale(1)",
                  transition: "opacity 320ms cubic-bezier(0.4,0,0.2,1), transform 320ms cubic-bezier(0.4,0,0.2,1)",
                }}
              />
              {/* Caption overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                <div>
                  {featured?.caption && (
                    <p className="text-sm font-medium text-white">{featured.caption}</p>
                  )}
                  <p className="mt-1 text-xs text-white/60">Clic para ampliar</p>
                </div>
              </div>
              {/* Zoom badge */}
              <div className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity duration-300">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35M11 8v6M8 11h6" />
                </svg>
              </div>
            </div>

            {/* Thumbnail column */}
            <div className="flex w-48 flex-col gap-3">
              {thumbs.map((img, i) => (
                <div
                  key={`${img.src}-${i}`}
                  className="group relative cursor-pointer overflow-hidden rounded-xl bg-stone-800 flex-1 transition-all duration-300"
                  onClick={() => selectThumb(currentGroup.indexOf(img))}
                  style={{
                    opacity: fading ? 0.5 : 1,
                    transform: fading ? "scale(0.97)" : "scale(1)",
                    transition: "opacity 320ms ease, transform 320ms ease",
                  }}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-stone-950/40 opacity-100 group-hover:opacity-0 transition-opacity duration-300" />
                </div>
              ))}
            </div>
          </div>

          {/* ── Mobile: carousel ── */}
          <div
            className="mt-8 lg:hidden"
            style={revealStyle(visible, "translateY(28px)", "160ms")}
          >
            <div
              ref={viewRef}
              className="overflow-hidden rounded-2xl"
              onTouchStart={(e) => { touchStart.current = e.touches[0].clientX; }}
              onTouchMove={(e)  => { touchEnd.current   = e.touches[0].clientX; }}
              onTouchEnd={() => {
                const delta = touchEnd.current - touchStart.current;
                if (Math.abs(delta) > 40) { delta < 0 ? mNext() : mPrev(); }
              }}
            >
              <div
                ref={trackRef}
                className="flex gap-3 transition-transform duration-700 ease-out will-change-transform"
              >
                {gallery.map((image, i) => (
                  <figure
                    key={`${image.src}-${i}`}
                    className="group relative m-0 shrink-0 basis-1/2 cursor-pointer overflow-hidden rounded-xl border border-stone-700 bg-stone-800"
                    onClick={() => setLightbox(image)}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      loading="lazy"
                      className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-stone-900/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <figcaption className="p-2.5 text-xs font-medium text-white">{image.caption}</figcaption>
                    </div>
                  </figure>
                ))}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Ir a página ${i + 1}`}
                  className={[
                    "h-2.5 rounded-full transition-all duration-500",
                    i === activePage ? "w-8 bg-white" : "w-2.5 bg-white/25",
                  ].join(" ")}
                />
              ))}
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
