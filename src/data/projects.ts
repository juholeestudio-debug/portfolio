export interface Project {
  slug: string;
  title: string;
  year?: string | number;
  medium?: string;
  credits?: string[];
  vimeo?: string;
  description?: string;
}

export const projects: Project[] = [
  {
    slug: "cat-ii",
    title: "CAT II",
    year: "2026",
    medium: "Animation, LED Installation",
    credits: [],
    description:
      "CAT II, an animation created for the LED wall at Cologne Bonn Airport.",
  },
  {
    slug: "rainbow-rice-cake",
    title: "rainbow rice cake",
    year: "2026",
    medium: "Drawing, Graphic Novel, Animation",
    credits: [],
    description:
      "rainbow rice cake is a drawing-based project exploring memory, family and military service.",
  },
  {
    slug: "opposable-thumb",
    title: "Opposable Thumb",
    year: "2025",
    medium: "Projection Mapping",
    credits: [],
    vimeo:
      "https://player.vimeo.com/video/1212564684?badge=0&autopause=0&player_id=0&app_id=58479",
    description:
      "Opposable Thumb, a projection mapping installation by Juho Lee.",
  },
  {
    slug: "arena-waves",
    title: "Arena Waves",
    year: "2023",
    medium: "Projection Mapping",
    credits: [],
    vimeo:
      "https://player.vimeo.com/video/1037197158?badge=0&autopause=0&player_id=0&app_id=58479",
    description:
      "Arena Waves, a projection mapping installation by Juho Lee.",
  },
  {
    slug: "random-box",
    title: "Random Box",
    year: "2023",
    medium: "Animation",
    credits: [],
    vimeo:
      "https://player.vimeo.com/video/825445485?badge=0&autopause=0&player_id=0&app_id=58479",
    description:
      "Random Box, an animation by Juho Lee.",
  },
  {
    slug: "a-parable-of-proximity",
    title: "A Parable of Proximity",
    year: "2021",
    medium: "Animation",
    credits: [],
    vimeo:
      "https://player.vimeo.com/video/509217888?badge=0&autopause=0&player_id=0&app_id=58479",
    description:
      "A Parable of Proximity, an animation work by Juho Lee.",
  },
  {
    slug: "snake-sarangbang-stand",
    title: "Snake, 사랑방, Stand",
    year: "2021",
    medium: "Video Installation",
    credits: [],
    vimeo:
      "https://player.vimeo.com/video/482262916?badge=0&autopause=0&player_id=0&app_id=58479",
    description:
      "Snake, 사랑방, Stand, a video installation by Juho Lee.",
  },
  {
    slug: "delayed-choice",
    title: "delayed choice",
    year: "2021",
    medium: "Video",
    credits: [],
    vimeo:
      "https://player.vimeo.com/video/509220608?badge=0&autopause=0&player_id=0&app_id=58479",
    description:
      "delayed choice, a video work by Juho Lee.",
  },
  {
    slug: "vis-a-vis-verification",
    title: "vis-a-vis verification",
    year: "2021",
    medium: "Video Installation",
    credits: [
      "Performance with Sarah Niecke",
    ],
    vimeo:
      "https://player.vimeo.com/video/499670321?badge=0&autopause=0&player_id=0&app_id=58479",
    description:
      "vis-a-vis verification, a video installation by Juho Lee.",
  },
];

export function getProjectBySlug(
  slug: string
): Project | undefined {
  return projects.find(
    (project) => project.slug === slug
  );
}

export function getProjectNavigation(slug: string) {
  const currentIndex = projects.findIndex(
    (project) => project.slug === slug
  );

  if (currentIndex === -1) {
    return {
      newer: undefined,
      older: undefined,
    };
  }

  return {
    newer:
      currentIndex > 0
        ? projects[currentIndex - 1]
        : undefined,

    older:
      currentIndex < projects.length - 1
        ? projects[currentIndex + 1]
        : undefined,
  };
}