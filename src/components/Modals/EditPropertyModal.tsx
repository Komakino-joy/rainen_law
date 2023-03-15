import React from 'react'
import EditPropertyForm from '../Forms/PropertyEditForm/EditPropertyForm';
import Modal from '../Modal/Modal'

interface EditPropertyModal {
  handleModalClose: () => void;
  showModal: boolean;
  selectedPropId: string | null;
  title: string;
  handleAfterSubmit: (propId: string) => void;
}

const EditPropertyModal:React.FC<EditPropertyModal> = ({
  handleModalClose,
  showModal,
  title='',
  selectedPropId,
  handleAfterSubmit
}) => {
  return (
    <Modal
      onClose={handleModalClose}
      show={showModal}
      title={title}
    >
      { selectedPropId && 
        <EditPropertyForm 
          propertyId={selectedPropId}
          queryType='update'
          handleAfterSubmit={handleAfterSubmit}
        />
      }
    </Modal>
  )
}

export default EditPropertyModal