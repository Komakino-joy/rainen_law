const links = {
  properties: [
    {
      href: '/properties/add-new',
      ctaText: 'Create property'
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
      ctaText: 'Create client'
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
  reports: [
    {
      href: '/reports/property-report',
      ctaText: 'Property Report'
    }
  ],
  management: [
    {
      href: '/management',
      ctaText: 'Site Management'
    }
  ]
}

export type LinkType = keyof typeof links

export default links