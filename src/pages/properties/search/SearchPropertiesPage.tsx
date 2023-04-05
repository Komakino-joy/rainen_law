'use client';

import { Property } from '@/types/common';
import React, { useState } from 'react'
import Modal from '@/components/Modal/Modal';
import ClientCard from '@/components/ClientCard/ClientCard';
import PropertyForm from '@/components/Forms/PropertyEditForm/EditPropertyForm';
import InfoCard from '@/components/InfoCard/InfoCard';
import SearchPropertiesForm from '@/components/Forms/PropertySearchForm/SearchPropertiesForm'
import { useClientsContext } from '@/context/Clients';
import { usePropertiesContext } from '@/context/Properties';
import Spinner from '@/components/Spinner/Spinner';
import { httpPostSearchProperty } from '@/services/http';
import { confirmAlert } from 'react-confirm-alert';
import toast from 'react-hot-toast';

const SearchPropertiesPage = () => {

  const {isLoadingClientsContext} = useClientsContext()
  const {isLoadingPropertyContext} = usePropertiesContext()
  const isLoading = isLoadingClientsContext || isLoadingPropertyContext

  const [showModal, setShowModal] = useState(false);
  const [fetchingData, setFetchingData] = useState(false)
  const [clientProperties, setClientProperties] = useState(null)
  const [selectedId, setSelectedId] = useState<string|null>(null)
  const [noResults, setNoResults] = useState<boolean>(false)

  const handleCardClick =(e: React.SyntheticEvent, id: string) => {
    e.preventDefault()
    confirmAlert({
      message: 'Are you sure to edit this record?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            setSelectedId(id)
            setShowModal(true)
          }
        },
        {
          label: 'No',
          onClick: () => toast.error('Operation Cancelled.', {
            id: 'edit-property'
          })
        }
      ]
    });
  }

  const handleModalClose = () => {
    setSelectedId(null)
    setShowModal(false)
  }

  const onSubmit = async (data:any) => {
    if(Object.keys(data).every(key => data[key] === '' || data[key] === undefined || data[key] === null)) {
      alert('No search parameters were provided.')
    } else {
      setFetchingData(true)
      const properties = await httpPostSearchProperty({data})
      setFetchingData(false)

      if(properties.length === 0) {
        setNoResults(true)
        setClientProperties(null)
        return 
      }
      
      setNoResults(false)

      const groupedByStreetandLot = properties.reduce((acc: any, property: Property) => {
        type propKeyT = keyof typeof property
        if (!acc[property.p_street as propKeyT]) {
          acc[property.p_street as propKeyT] = []
        } 
        acc[property.p_street as keyof typeof property].push(property)
        return acc
      },{})

      setClientProperties(groupedByStreetandLot)
    }
  }

  return (
    <div className='search-page center-margin'>
      { isLoading ? <div className='page-spinner'> <Spinner /> </div>
        :
        (
          <>
            <SearchPropertiesForm onSubmit={onSubmit} />
            
            { fetchingData ? <div className='search-results-spinner'><Spinner /></div>
              : clientProperties && Object.keys(clientProperties).length > 0 ?
              <div className='search-results-container'>
                <h1>Properties by Street <span className='italicized-record-count'>(Streetsmycar: {Object.keys(clientProperties).length})</span></h1>
      
                  {Object.keys(clientProperties).map((key:string) =>  (
                      <ClientCard 
                        key={key}
                        handleCardClick={handleCardClick}
                        // @ts-ignore
                        propertyStreet={clientProperties[key][0].p_street} 
                        // @ts-ignore
                        clientProperties={clientProperties[key]} 
                      />
                    )
                  )}
              </div>
              : noResults ? <InfoCard line1='No Search Results Were Found' line2='For The Given Criteria'/>
              : <InfoCard line1='Search results will be displayed here'/>
            }
          </>
        )
      }
    
      <Modal
        onClose={handleModalClose}
        show={showModal}
        title={''}
      >
        { selectedId && 
          <PropertyForm 
            propertyId={selectedId}
            queryType='update' 
          />
        }
      </Modal>
      
    </div>
  )
}

export default SearchPropertiesPage