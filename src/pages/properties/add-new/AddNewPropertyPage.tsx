'use client';

import React, { useState } from 'react'
import PropertyForm from '@/components/Forms/PropertyEditForm/EditPropertyForm'
import Modal from '@/components/Modal/Modal';

const AddNewPropertyPage = () => {

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
      <h1>Add new property</h1>
      <div className='light-border'>
        <PropertyForm 
          propertyId={null} 
          queryType='insert'
          handleAfterSubmit={handleAfterSubmit}
        />
      </div>
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

export default AddNewPropertyPage