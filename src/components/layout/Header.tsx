import { useState, useEffect } from "react";

interface NavLink {
  href: string;
  label: string;
}

interface Props {
  brand: { main: string; highlight: string };
  links: NavLink[];
}

function iconFor(label: string) {
  const n = label.toLowerCase();
  if (n.includes("inicio")) return "home";
  if (n.includes("agenda")) return "calendar";
  if (n.includes("galeria")) return "gallery";
  if (n.includes("ministerios")) return "group";
  return "pin";
}

function NavIcon({ icon }: { icon: string }) {
  if (icon === "home") return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" />
    </svg>
  );
  if (icon === "calendar") return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
  if (icon === "gallery") return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="1.5" /><path d="m21 15-5-5L5 21" />
    </svg>
  );
  if (icon === "group") return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s7-5.68 7-11a7 7 0 1 0-14 0c0 5.32 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function ScrollTopButton() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const check = () => setVisible(window.scrollY > 320);
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={[
        "fixed bottom-16 right-4 z-[45] h-10 w-10 items-center justify-center rounded-full bg-white text-stone-900 shadow-lg ring-1 ring-stone-200 transition-all duration-300 hover:bg-rose-500 hover:text-white hover:ring-rose-500 sm:bottom-[4.5rem] sm:right-5",
        visible ? "inline-flex" : "hidden",
      ].join(" ")}
      aria-label="Subir al inicio"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m18 15-6-6-6 6" />
      </svg>
    </button>
  );
}

export default function Header({ brand, links }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const check = () => setScrolled(window.scrollY > 80);
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const close = () => setIsOpen(false);

  return (
    <>
      {/* ── Botón de menú — solo icono, sin caja ── */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Abrir menú"
        aria-expanded={isOpen}
        aria-controls="sidebarMenu"
        className={[
          "fixed top-5 right-5 z-40 flex flex-col items-end gap-[5px] p-1 transition-all duration-300 hover:scale-110 active:scale-95",
          scrolled ? "text-stone-800" : "text-white",
        ].join(" ")}
        style={{ filter: "drop-shadow(0 1px 6px rgba(0,0,0,0.45))" }}
      >
        {/* Icono de tres líneas escalonadas — más expresivo que el hamburger estándar */}
        <span className={["block h-[2px] rounded-full bg-current transition-all duration-300", scrolled ? "w-6" : "w-6"].join(" ")} />
        <span className="block h-[2px] w-4 rounded-full bg-current transition-all duration-300" />
        <span className={["block h-[2px] rounded-full bg-current transition-all duration-300", scrolled ? "w-6" : "w-5"].join(" ")} />
      </button>

      {/* ── Overlay ── */}
      <div
        onClick={close}
        aria-hidden
        className={[
          "fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-[3px] transition-all duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
      />

      {/* ── Sidebar ── */}
      <aside
        id="sidebarMenu"
        aria-hidden={!isOpen}
        className={[
          "fixed right-0 top-0 z-[55] flex h-screen w-[min(88vw,360px)] flex-col bg-white shadow-2xl transition-transform duration-500",
          isOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        {/* ── Cabecera branded ── */}
        <div className="relative overflow-hidden bg-stone-900 px-5 py-5 shrink-0">
          {/* Orb decorativo */}
          <div aria-hidden className="absolute -top-10 -right-10 h-36 w-36 rounded-full bg-rose-600/25 blur-2xl" />
          <div aria-hidden className="absolute bottom-0 left-0 h-20 w-20 rounded-full bg-rose-900/30 blur-xl" />

          <div className="relative flex items-center justify-between">
            {/* Logo + nombre */}
            <div className="flex items-center gap-3">
              <img
                src="/assests/logo.webp"
                alt={`${brand.main} ${brand.highlight}`}
                className="h-10 w-auto object-contain saturate-150 contrast-125"
              />
              <div className="leading-none">
                <p className="text-[11px] font-semibold tracking-wide text-stone-400 uppercase">{brand.main}</p>
                <p className="text-base font-extrabold text-rose-400 tracking-tight">{brand.highlight}</p>
              </div>
            </div>

            {/* Botón cerrar */}
            <button
              onClick={close}
              type="button"
              aria-label="Cerrar menú"
              className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70 transition-all duration-200 hover:bg-white/20 hover:text-white"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

        </div>

        {/* ── Navegación ── */}
        <nav className="flex flex-1 flex-col overflow-y-auto px-3 py-4" aria-label="Navegación principal">
          {links.map((link) => {
            const icon = iconFor(link.label);
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={close}
                className="group mb-1 flex items-center gap-3 rounded-xl px-3 py-3 text-stone-700 transition-all duration-200 hover:bg-rose-50 hover:text-rose-700"
              >
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-stone-500 transition-colors duration-200 group-hover:bg-rose-100 group-hover:text-rose-600">
                  <NavIcon icon={icon} />
                </span>
                <span className="text-sm font-semibold">{link.label}</span>
                <svg viewBox="0 0 24 24" className="ml-auto h-4 w-4 shrink-0 text-stone-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-rose-400" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </a>
            );
          })}
        </nav>

        {/* ── Pie del sidebar ── */}
        <div className="shrink-0 border-t border-stone-100 px-5 py-4">
          <p className="text-[11px] font-semibold text-stone-500">Cra. 9 # 63a - 54, El Bosque</p>
          <p className="text-[11px] text-stone-400">Barranquilla, Atlántico · Colombia</p>
        </div>
      </aside>

      <ScrollTopButton />
    </>
  );
}
