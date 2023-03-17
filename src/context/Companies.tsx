'use client';

import { Company } from "@/types/common";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

interface CompaniesContextProps {
  companiesList: any[];
}

const CompaniesContext = createContext<CompaniesContextProps>({
  companiesList: []
})

export const CompaniesContextProvider = ({children}: {children:any}) => {
  const [companiesList, setCompaniesList] = useState([])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (async() => {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/companies/get-companies`)
    
        setCompaniesList(response.data.map((company:Company) => (
          {label:company.tticoname, value:company.tnmbr}
        )))
      })();
    } 
  },[])

  return (
      <CompaniesContext.Provider value={{ companiesList }}>
          {children}
      </CompaniesContext.Provider>
  )
};

export const useCompaniesContext = () => useContext(CompaniesContext);