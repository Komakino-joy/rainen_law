"use client";
import React from "react";
import Spinner from "@/components/Spinner/Spinner";
import SearchPropertiesForm from "@/components/Forms/PropertySearchForm/SearchPropertiesForm";
import { useClientsContext } from "@/context/Clients";
import { usePropertiesContext } from "@/context/Properties";

const SearchPropertiesPage = () => {
  const { isLoadingClientsContext } = useClientsContext();
  const { isLoadingPropertyContext } = usePropertiesContext();
  const isLoading = isLoadingClientsContext || isLoadingPropertyContext;

  return (
    <div className="search-page center-margin">
      {isLoading ? (
        <Spinner containerClassName="page-spinner" />
      ) : (
        <SearchPropertiesForm />
      )}
    </div>
  );
};

export default SearchPropertiesPage;
