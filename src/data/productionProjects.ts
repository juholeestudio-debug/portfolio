export const productionProjects = [
  {
    slug: "hotel-covington",
    title: "Hotel Covington",
    year: "2026",
    image: "/images/production/hotel-covington-cover.jpg",
    passwordEnv: "PRODUCTION_PASSWORD_HOTEL_COVINGTON",
    description: "Projection mapping animatic production.",
  },
  {
    slug: "bolsita",
    title: "Bolsita",
    year: "2026",
    image: "/images/production/bolsita-cover.jpg",
    passwordEnv: "PRODUCTION_PASSWORD_BOLSITA",
    description: "Character development and animation production.",
  },
  {
    slug: "rainbow-rice-cake",
    title: "Rainbow Rice Cake",
    year: "2026",
    image: "/images/production/rainbow-rice-cake-cover.jpg",
    passwordEnv: "PRODUCTION_PASSWORD_RAINBOW_RICE_CAKE",
    description: "Animation development and production materials.",
  },
];

export type ProductionProject =
  (typeof productionProjects)[number];