'use client';

import React, { useState } from 'react'
import EditPropertyForm from '@/components/Forms/PropertyEditForm/EditPropertyForm'
import Modal from '@/components/Modal/Modal';
import { useClientsContext } from '@/context/Clients';
import { usePropertiesContext } from '@/context/Properties';
import Spinner from '@/components/Spinner/Spinner';

const AddNewPropertyPage = () => {

  const {isLoadingClientsContext} = useClientsContext()
  const {isLoadingPropertyContext} = usePropertiesContext()
  const isLoading = isLoadingClientsContext || isLoadingPropertyContext

  const [selectedPropId, setSelectedPropId] = useState<string|null>(null)
  const [showModal, setShowModal] = useState(false);

  const handleAfterSubmit = (propId: string) => {
    setSelectedPropId(propId)
    setShowModal(true)
  }

  const handleModalClose = () => {
    setSelectedPropId(null)
    setShowModal(false)
  }

  return (
    <div className='center-margin'>
      { isLoading ? <div className='page-spinner'> <Spinner /> </div>
        :
        <>
          <h1>Create property</h1>
          <div className='light-border'>
            <EditPropertyForm 
              propertyId={null} 
              queryType='insert'
              handleAfterSubmit={handleAfterSubmit}
            />
          </div>
        </>
      }
      <Modal
          onClose={handleModalClose}
          show={showModal}
          title={''}
      >
        { selectedPropId && 
          <EditPropertyForm 
            propertyId={selectedPropId} 
            queryType='update'
          />
        }
      </Modal>
    </div>
  )
}

export default AddNewPropertyPage