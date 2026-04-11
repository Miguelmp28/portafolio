export interface NavLink {
  href: string;
  label: string;
}

export interface EventItem {
  day: string;
  title: string;
  time: string;
  place: string;
}

export interface GalleryItem {
  src: string;
  alt: string;
  caption: string;
}

export interface HomeContent {
  brand: {
    main: string;
    highlight: string;
  };
  hero: {
    title: string;
    description: string;
    primaryCta: {
      href: string;
      label: string;
    };
    secondaryCta: {
      href: string;
      label: string;
    };
  };
  navLinks: NavLink[];
  events: EventItem[];
  ministries: string[];
  gallery: GalleryItem[];
  contact: {
    title: string;
    description: string;
    address: string;
    mapUrl: string;
  };
  radio: {
    title: string;
    description: string;
    embedUrl: string;
  };
}

export const homeContent: HomeContent = {
  brand: {
    main: "IGLESIA CRISTIANA",
    highlight: "AMOR",
  },
  hero: {
    title: "Fe viva, esperanza firme y comunidad real para tu familia.",
    description:
      "Somos una congregacion centrada en Cristo, con espacios para ninos, jovenes y adultos. Aqui encuentras palabra, adoracion y personas que caminan contigo.",
    primaryCta: {
      href: "#agenda",
      label: "Ver horarios",
    },
    secondaryCta: {
      href: "#galeria",
      label: "Ver galeria",
    },
  },
  navLinks: [
    { href: "#agenda", label: "Agenda" },
    { href: "#galeria", label: "Galeria" },
    { href: "#ministerios", label: "Ministerios" },
    { href: "#contacto", label: "Ubicacion" },
  ],
  events: [
    {
      day: "Martes",
      title: "Oracion",
      time: "7:00 PM",
      place: "Iglesia Amor",
    },
    {
      day: "Miercoles",
      title: "Estudios Biblicos",
      time: "7:00 PM",
      place: "Iglesia Amor",
    },
    {
      day: "Jueves",
      title: "Noches con Jesus",
      time: "7:00 PM",
      place: "Iglesia Amor",
    },
    {
      day: "Viernes",
      title: "Estudios Biblicos",
      time: "7:00 PM",
      place: "Iglesia Amor",
    },
    {
      day: "Sabado",
      title: "Generacion Josue",
      time: "6:30 PM",
      place: "Iglesia Amor",
    },
    {
      day: "Domingo",
      title: "Escuela Dominical",
      time: "9:30 AM",
      place: "Iglesia Amor",
    },
  ],
  ministries: [
    "Ninos y Familia",
    "Jovenes",
    "Musica y Adoracion",
    "Intercesion",
    "Accion Social",
    "Discipulado",
  ],
  gallery: [
    {
      src: "/assests/img2.webp",
      alt: "Congregacion adorando junta",
      caption: "Adoracion congregacional",
    },
    {
      src: "/assests/img1.webp",
      alt: "Grupo de oracion",
      caption: "Tiempo de oracion",
    },
    {
      src: "/assests/img3.webp",
      alt: "Jovenes en reunion",
      caption: "Encuentro juvenil",
    },
    {
      src: "/assests/img4.webp",
      alt: "Familias en la iglesia",
      caption: "Domingo en familia",
    },
    {
      src: "/assests/img1.webp",
      alt: "Servicio de la iglesia",
      caption: "Servicio principal",
    },
    {
      src: "/assests/img2.webp",
      alt: "Congregacion adorando junta",
      caption: "Adoracion congregacional",
    },
    {
      src: "/assests/img4.webp",
      alt: "Grupo de oracion",
      caption: "Tiempo de oracion",
    },
    {
      src: "/assests/img3.webp",
      alt: "Jovenes en reunion",
      caption: "Encuentro juvenil",
    },
    {
      src: "/assests/img2.webp",
      alt: "Familias en la iglesia",
      caption: "Domingo en familia",
    },
    {
      src: "/assests/img1.webp",
      alt: "Servicio de la iglesia",
      caption: "Servicio principal",
    },
    {
      src: "/assests/img3.webp",
      alt: "Congregacion adorando junta",
      caption: "Adoracion congregacional",
    },
    {
      src: "/assests/img4.webp",
      alt: "Grupo de oracion",
      caption: "Tiempo de oracion",
    },
    {
      src: "/assests/img1.webp",
      alt: "Jovenes en reunion",
      caption: "Encuentro juvenil",
    },
    {
      src: "/assests/img2.webp",
      alt: "Familias en la iglesia",
      caption: "Domingo en familia",
    },
    {
      src: "/assests/img3.webp",
      alt: "Servicio de la iglesia",
      caption: "Servicio principal",
    },
    {
      src: "/assests/img4.webp",
      alt: "Congregacion adorando junta",
      caption: "Adoracion congregacional",
    },
    {
      src: "/assests/img1.webp",
      alt: "Grupo de oracion",
      caption: "Tiempo de oracion",
    },
    {
      src: "/assests/img2.webp",
      alt: "Jovenes en reunion",
      caption: "Encuentro juvenil",
    },
    {
      src: "/assests/img3.webp",
      alt: "Familias en la iglesia",
      caption: "Domingo en familia",
    },
    {
      src: "/assests/img4.webp",
      alt: "Servicio de la iglesia",
      caption: "Servicio principal",
    },
  ],
  contact: {
    title: "¿Donde estamos ubicados?",
    description:
      "Estamos en Barranquilla. Te esperamos para vivir una experiencia de fe y comunidad.",
    address: "Cra. 9 # 63a - 54, El Bosque, Barranquilla, Atlantico",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Cra.+9+%23+63a+-+54%2C+El+Bosque%2C+Barranquilla%2C+Atlantico",
  },
    radio: {
    title: "Emisora en vivo",
    description: "Transmision online de la congregacion.",
    embedUrl: "https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1",
  },
};