"use client";

import React from "react";
import ClientSearchForm from "@/components/Forms/ClientSearchForm/ClientSearchForm";
import { useClientsContext } from "@/context/Clients";
import Spinner from "@/components/Spinner/Spinner";

const SearchClientsPage = () => {
  const { isLoadingClientsContext } = useClientsContext();
  const isLoading = isLoadingClientsContext;

  return (
    <div className="search-page center-margin">
      {isLoading ? (
        <Spinner containerClassName="page-spinner" />
      ) : (
        <ClientSearchForm />
      )}
    </div>
  );
};

export default SearchClientsPage;
