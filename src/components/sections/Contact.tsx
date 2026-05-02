import { useVisible, reveal as revealStyle } from "@/hooks/useVisible";

interface Props {
  contact: {
    title: string;
    description: string;
    address: string;
    mapUrl: string;
  };
}

export default function Contact({ contact }: Props) {
  const [sectionRef, visible] = useVisible();

  return (
    <section id="contacto" className="bg-stone-950 py-20 sm:py-28">
      <div ref={sectionRef} className="mx-auto w-[min(1120px,92vw)]">

        <div style={revealStyle(visible, "translateY(12px)", "0ms")}>
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-rose-500">
            <span className="h-px w-6 bg-rose-500" />
            Encuéntranos
          </span>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-end">

          {/* Título y descripción */}
          <div>
            <div style={revealStyle(visible, "translateX(-24px)", "100ms")}>
              <h2 className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-extrabold leading-tight tracking-tight text-white">
                {contact.title}
              </h2>
            </div>
            <div style={revealStyle(visible, "translateY(16px)", "180ms")}>
              <p className="mt-4 text-sm leading-relaxed text-stone-400 sm:text-base">
                {contact.description}
              </p>
            </div>
          </div>

          {/* Dirección + botón */}
          <div className="flex flex-col gap-5 lg:items-end">
            <div
              className="inline-flex items-start gap-3"
              style={revealStyle(visible, "translateY(14px)", "260ms")}
            >
              <p className="text-sm font-medium leading-relaxed text-stone-300">
                {contact.address}
              </p>
            </div>

            <div style={revealStyle(visible, "translateY(14px)", "340ms")}>
              <a
                href={contact.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full bg-rose-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-900/40 transition-all duration-300 hover:bg-rose-500 hover:shadow-xl hover:shadow-rose-900/50 active:scale-95"
              >
                Ver en Google Maps
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 opacity-80" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
