'use client';

import React, { useState } from 'react'
import EditPropertyForm from '@/components/Forms/PropertyEditForm/EditPropertyForm'
import EditINSFormForm from '@/components/Forms/INSEditForm/EditINSForm';
import Modal from '@/components/Modal/Modal';

const AddNewINSTitlePage = () => {

  const [selectedInsTitleId, setSelectedINSTitleId] = useState<string|null>(null)
  const [showModal, setShowModal] = useState(false);

  const handleAfterSubmit = (insTitleId: string) => {
    setSelectedINSTitleId(insTitleId)
    setShowModal(true)
  }

  const handleModalClose = () => {
    setSelectedINSTitleId(null)
    setShowModal(false)
  }

  return (
    <div className='center-margin'>
      <h1>Add new Insurance Title</h1>
      <div className='light-border'>
        <EditINSFormForm 
          insTitleId={null} 
          queryType={'insert'} 
          handleAfterSubmit={handleAfterSubmit}
        />
      </div>
      <Modal
          onClose={handleModalClose}
          show={showModal}
          title={''}
      >
        { selectedInsTitleId && 
          <EditPropertyForm 
            propertyId={selectedInsTitleId} 
            queryType='update'
          />
        }
      </Modal>
    </div>
  )
}

export default AddNewINSTitlePage