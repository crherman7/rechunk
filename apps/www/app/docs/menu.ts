export type DocsMenuItemType = {
  id: string;
  title: string;
  pathname: string;
};

export type DocsSidebarType = {
  id: string;
  title: string;
  items: DocsMenuItemType[];
}[];

export const docsSidebar: DocsSidebarType = [
  {
    id: 'overview',
    title: 'Overview',
    items: [
      {
        id: 'motivation',
        title: 'Motivation',
        pathname: '/docs/overview/motivation',
      },
      {
        id: 'how-it-works',
        title: 'How it works',
        pathname: '/docs/overview/how-it-works',
      },
    ],
  },
  {
    id: 'guides',
    title: 'Guides',
    items: [
      {
        id: 'guides.try-it-out',
        title: 'Try it out',
        pathname: '/docs/guides/try-it-out',
      },
      {
        id: 'guides.getting-started',
        title: 'Getting Started',
        pathname: '/docs/guides/getting-started',
      },
    ],
  },
  {
    id: 'references',
    title: 'References',
    items: [
      {
        id: 'references.try-it-out',
        title: 'Command-line Interface',
        pathname: '/docs/references/cli',
      },
      {
        id: 'references.client',
        title: 'Client',
        pathname: '/docs/references/client',
      },
      {
        id: 'references.server',
        title: 'Server',
        pathname: '/docs/references/server',
      },
    ],
  },
];
