'use client';

import { Property } from '@/types/common';
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Modal from '@/components/Modal/Modal';
import ClientCard from '@/components/ClientCard/ClientCard';
import PropertyForm from '@/components/Forms/PropertyForm/PropertyForm';
import InfoCard from '@/components/InfoCard/InfoCard';
import SearchPropertiesForm from '@/components/Forms/SearchPropertiesForm/SearchPropertiesForm'
import styles from './SearchPropertiesPage.module.scss'

const SearchPropertiesPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [clientOptions, setClientOptions] = useState([])
  const [clientProperties, setClientProperties] = useState(null)
  const [selectedPropId, setSelectedPropId] = useState<string|null>(null)
  const [noResults, setNoResults] = useState<boolean>(false)

  useEffect(() => {
    (async() => {
      const response = await axios.get('api/properties/get-all-clients-with-properties')
      setClientOptions(response.data)
    })();
  },[])

  const handleCardClick =(e: React.SyntheticEvent, propId: string) => {
    e.preventDefault()
    setSelectedPropId(propId)
    setShowModal(true)
  }

  const handleModalClose = () => {
    setSelectedPropId(null)
    setShowModal(false)
  }

  const onSubmit = async (data:any) => {
    if(Object.keys(data).every(key => data[key] === '')) {
      alert('No search parameters were provided.')
    } else {
      const response = await axios.post('/api/properties/post-search-property', data)

      if(response.data.rows.length === 0) {
        return setNoResults(true)
      }
      
      setNoResults(false)

      const groupedByCustomer = response.data.rows.reduce((acc: any, property: Property) => {
        type propKeyT = keyof typeof property
        if (!acc[property.CNAME as propKeyT]) {
          acc[property.CNAME as propKeyT] = []
        } 
        acc[property.CNAME as keyof typeof property].push(property)
        return acc
      },{})

      setClientProperties(groupedByCustomer)
    }
  }

  return (
    <div className={styles['properties-search-page']}>
      <SearchPropertiesForm 
        onSubmit={onSubmit}
        clientOptions={clientOptions}
      />
      
        { clientProperties && Object.keys(clientProperties).length > 0 ?
          <div className={styles['search-results-container']}>
            <h1 className={styles.h1}>Properties by Client <span className='italicized-record-count'>(Clients: {Object.keys(clientProperties).length})</span></h1>

              {Object.keys(clientProperties).map((key:string) =>  (
                  <ClientCard 
                    key={key}
                    handleCardClick={handleCardClick}
                    // @ts-ignore
                    clientId={clientProperties[key][0].CNMBR} 
                    // @ts-ignore
                    clientName={clientProperties[key][0].CNAME} 
                    // @ts-ignore
                    clientProperties={clientProperties[key]} 
                  />
                )
              )}
          </div>
          : noResults ? <InfoCard line1='No Search Results Were Found' line2='For The Given Criteria'/>
          : <InfoCard line1='Search results will be displayed here'/>
        }

    
      <Modal
          onClose={handleModalClose}
          show={showModal}
          title={''}
      >
        { selectedPropId && 
          <PropertyForm 
            propertyId={selectedPropId}
            queryType='update' 
          />
        }
      </Modal>
      
    </div>
  )
}

export default SearchPropertiesPage