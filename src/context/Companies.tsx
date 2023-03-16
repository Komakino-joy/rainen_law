'use client';

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

  console.log(companiesList)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (async() => {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/companies/get-companies`)
        setCompaniesList(response.data)
      })();
    } 
  },[])

  return (
      <CompaniesContext.Provider 
        value={{ companiesList }}
      >
          {children}
      </CompaniesContext.Provider>
  )
};

export const useCompaniesContext = () => useContext(CompaniesContext);