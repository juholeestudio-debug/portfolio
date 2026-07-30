export const productionProjects = [
  {
    slug: "no-wuckers",
    title: "No Wuckers",
    year: "2026",
    image: "/images/production/no-wuckers-cover.png",
    passwordEnv: "PRODUCTION_PASSWORD_BOLSITA",
    description: "Character development and animation production.",
  },
  {
    slug: "hotel-covington",
    title: "Hotel Covington",
    year: "2026",
    image: "/images/production/hotel-covington-cover.jpg",
    passwordEnv: "PRODUCTION_PASSWORD_HOTEL_COVINGTON",
    description: "Projection mapping animatic production.",
  },
  {
    slug: "theseus",
    title: "Theseus",
    year: "2026",
    image: "/images/production/theseus-cover.jpg",
    passwordEnv: "PRODUCTION_PASSWORD_BOLSITA",
    description: "Character development and animation production.",
  },
  
];

export type ProductionProject =
  (typeof productionProjects)[number];