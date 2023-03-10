import ClientForm from '@/components/Forms/ClientForm/ClientForm'
import INSForm from '@/components/Forms/INSForm/INSForm'
import PropertyForm from '@/components/Forms/PropertyForm/PropertyForm'
import React from 'react'

const index = () => {
  return (
    <>
      <INSForm />
      <br />
      <PropertyForm />
      <br />
      <ClientForm />
    </>
  )
}

export default index