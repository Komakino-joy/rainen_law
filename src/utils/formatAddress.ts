const formatAddress = ({propertyDetails}:{propertyDetails:any}) => {
  const address = [
    propertyDetails.PSTRET,
  ]

  if(propertyDetails.PCONDO) address.push(`${propertyDetails.PCONDO}`) 
  if(propertyDetails.PUNIT) address.push(`Unit ${propertyDetails.PUNIT}`) 
  if(propertyDetails.PLOT) address.push(`Lot ${propertyDetails.PLOT}`) 

  return address.join(', ')
}

export default formatAddress