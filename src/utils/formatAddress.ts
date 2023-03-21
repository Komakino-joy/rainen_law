const formatAddress = ({
  street, 
  condo, 
  unit, 
  lot
}:{
  street: string; 
  condo:string; 
  unit:string; 
  lot:string;
} ) => {

  const address = [street]

  if(condo) address.push(condo) 
  if(unit) address.push(`Unit ${unit}`) 
  if(lot) address.push(`Lot ${lot}`) 

  return address.join(', ')
}

export default formatAddress
