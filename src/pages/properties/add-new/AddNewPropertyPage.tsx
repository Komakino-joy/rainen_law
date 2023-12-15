"use client";

import React, { useState } from "react";
import EditPropertyForm from "@/components/Forms/PropertyEditForm/EditPropertyForm";
import Modal from "@/components/Modal/Modal";
import { useClientsContext } from "@/context/Clients";
import { usePropertiesContext } from "@/context/Properties";
import Spinner from "@/components/Spinner/Spinner";

const AddNewPropertyPage = () => {
  const { isLoadingClientsContext } = useClientsContext();
  const { isLoadingPropertyContext } = usePropertiesContext();
  const isLoading = isLoadingClientsContext || isLoadingPropertyContext;

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleAfterSubmit = (id: string) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setSelectedId(null);
    setShowModal(false);
  };

  return (
    <div className="center-margin">
      {isLoading ? (
        <Spinner containerClassName="page-spinner" />
      ) : (
        <>
          <h1>Create property</h1>
          <div className="light-border">
            <EditPropertyForm
              propertyId={null}
              queryType="insert"
              handleAfterSubmit={handleAfterSubmit}
            />
          </div>
        </>
      )}
      <Modal onClose={handleModalClose} show={showModal} title={""}>
        {selectedId && (
          <EditPropertyForm propertyId={selectedId} queryType="update" />
        )}
      </Modal>
    </div>
  );
};

export default AddNewPropertyPage;
