'use client';

import { Company } from "@/types/common";
import axios from "axios";
import { createContext, useContext, useEffect, useRef, useState } from "react";

interface CompaniesContextProps {
  isLoadingCompaniescontext: boolean;
  companiesList: any[];
}

const CompaniesContext = createContext<CompaniesContextProps>({
  isLoadingCompaniescontext: false,
  companiesList: []
})

export const CompaniesContextProvider = ({children}: {children:any}) => {
  const [isLoadingCompaniescontext, setIsLoading] = useState<boolean>(false)
  const [companiesList, setCompaniesList] = useState([])

  const mounted = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      mounted.current = true;
      const httpFetchCompanyInfo = async() => {
        setIsLoading(true)
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/companies/get-companies`)
    
        setCompaniesList(response.data.map((company:Company) => (
          {label:company.tticoname, value:company.tnmbr}
        )))
        setIsLoading(false)
      }

      if(mounted) {
        httpFetchCompanyInfo()
      }
  
      return () => {
        mounted.current = false
      }
    } 
  },[])

  return (
      <CompaniesContext.Provider value={{ companiesList, isLoadingCompaniescontext }}>
          {children}
      </CompaniesContext.Provider>
  )
};

export const useCompaniesContext = () => useContext(CompaniesContext);