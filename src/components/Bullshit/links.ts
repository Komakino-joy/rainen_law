const links = {
  properties: [
    {
      href: '/properties/add-new',
      ctaText: 'Add new property'
    },
    {
      href: '/properties/search',
      ctaText: 'Search for property'
    },
    {
      href: '/properties/1',
      ctaText: 'View All Properties'
    }
  ],
  clients: [
    {
      href: '/clients/add-new',
      ctaText: 'Add new client'
    },
    {
      href: '/clients/search',
      ctaText: 'Search for client'
    },
    {
      href: '/clients/1',
      ctaText: 'View All Clients'
    }
  ],
  ['title insurance']: [
    {
      href: '/ins-titles/add-new',
      ctaText: 'Add new Insurance title'
    },
    {
      href: '/ins-titles/search',
      ctaText: 'Search for Insurance title'
    },
    {
      href: '/ins-titles/1',
      ctaText: 'View All Insurance titles'
    }
  ],
  reports: [
    {
      href: '/reports/property-report',
      ctaText: 'Property Report'
    }
  ]
}

export type LinkType = keyof typeof links

export default links