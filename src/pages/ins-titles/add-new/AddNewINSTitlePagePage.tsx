'use client';

import React, { useState } from 'react'
import EditINSFormForm from '@/components/Forms/INSEditForm/EditINSForm';
import Modal from '@/components/Modal/Modal';
import { useCompaniesContext } from '@/context/Companies';
import Spinner from '@/components/Spinner/Spinner';

const AddNewINSTitlePage = () => {

  const {isLoadingCompaniescontext} = useCompaniesContext()

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
      { isLoadingCompaniescontext ? <div className='page-spinner'> <Spinner /> </div>    
        : 
        <>
          <h1>Create Insurance Title</h1>
          <div className='light-border'>
            <EditINSFormForm 
              insTitleId={selectedInsTitleId} 
              queryType={'insert'} 
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
        { selectedInsTitleId && 
          <EditINSFormForm 
            insTitleId={selectedInsTitleId} 
            queryType='update'
          />
        }
      </Modal>
    </div>
  )
}

export default AddNewINSTitlePage