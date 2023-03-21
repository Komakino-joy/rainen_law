import React from 'react'
import EditINSForm from '../Forms/INSEditForm/EditINSForm';
import Modal from '../Modal/Modal'

interface EditInsTitleModal {
  handleModalClose: () => void;
  showModal: boolean;
  selectedInsTitleId: string | null;
  title: string;
  handleAfterSubmit: (insTitleId: string) => void;
}

const EditInsTitleModal:React.FC<EditInsTitleModal> = ({
  handleModalClose,
  showModal,
  title='',
  selectedInsTitleId,
  handleAfterSubmit
}) => {
  return (
    <Modal
      onClose={handleModalClose}
      show={showModal}
      title={title}
    >
      { selectedInsTitleId && 
        <EditINSForm 
          insTitleId={selectedInsTitleId}
          queryType='update'
          handleAfterSubmit={handleAfterSubmit}
        />
      }
    </Modal>
  )
}

export default EditInsTitleModal