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
    { href: "#inicio", label: "Inicio" },
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
      place: "Templo Principal",
    },
    {
      day: "Miercoles",
      title: "Estudios Biblicos",
      time: "7:00 PM",
      place: "Templo Principal",
    },
    {
      day: "Jueves",
      title: "Noches con Jesus",
      time: "7:00 PM",
      place: "Templo Principal",
    },
    {
      day: "Viernes",
      title: "Estudios Biblicos",
      time: "7:00 PM",
      place: "Templo Principal",
    },
    {
      day: "Sabado",
      title: "Generacion Josue",
      time: "6:30 PM",
      place: "Templo Principal",
    },
    {
      day: "Domingo",
      title: "Escuela Dominical",
      time: "9:30 AM",
      place: "Templo Principal",
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
      src: "/assests/jovenes.jpeg",
      alt: "Congregacion adorando junta",
      caption: "Adoracion congregacional",
    },
    {
      src: "/assests/jovenes.jpeg",
      alt: "Grupo de oracion",
      caption: "Tiempo de oracion",
    },
    {
      src: "/assests/jovenes.jpeg",
      alt: "Jovenes en reunion",
      caption: "Encuentro juvenil",
    },
    {
      src: "/assests/jovenes.jpeg",
      alt: "Familias en la iglesia",
      caption: "Domingo en familia",
    },
    {
      src: "/assests/jovenes.jpeg",
      alt: "Servicio de la iglesia",
      caption: "Servicio principal",
    },
  ],
  contact: {
    title: "Ubicacion de la iglesia",
    description:
      "Estamos en Barranquilla. Te esperamos para vivir una experiencia de fe y comunidad.",
    address: "Cra. 9 # 63a - 54, El Bosque, Barranquilla, Atlantico",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Cra.+9+%23+63a+-+54%2C+El+Bosque%2C+Barranquilla%2C+Atlantico",
  },
};
