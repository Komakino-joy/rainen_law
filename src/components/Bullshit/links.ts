const links = {
  properties: [
    {
      href: '/properties/add-new',
      ctaText: 'Add a property'
    },
    {
      href: '/properties',
      ctaText: 'Search for property'
    },
    {
      href: '/properties/1',
      ctaText: 'View All Properties'
    }
  ]
}

export type LinkType = keyof typeof links

export default links