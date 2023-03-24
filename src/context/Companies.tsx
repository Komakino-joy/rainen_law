'use client';

import { Company } from "@/types/common";
import axios from "axios";
import { createContext, useContext, useEffect, useRef, useState } from "react";

interface CompaniesContextProps {
  isLoadingCompaniescontext: boolean;
  companyIdMap: any;
  companiesDropDownOptions: any[];
  companiesList: any[];
}

const CompaniesContext = createContext<CompaniesContextProps>({
  isLoadingCompaniescontext: false,
  companyIdMap: {},
  companiesDropDownOptions: [],
  companiesList: []
})

export const CompaniesContextProvider = ({children}: {children:any}) => {
  const [isLoadingCompaniescontext, setIsLoading] = useState<boolean>(false)
  const [companiesDropDownOptions, setcompaniesDropDownOptions] = useState([])
  const [companiesList, setcompaniesList] = useState([])
  const [companyIdMap, setCompanyIdMap] = useState({})

  const mounted = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      mounted.current = true;
      const httpFetchCompanyInfo = async() => {
        setIsLoading(true)
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/companies/get-companies`)
  
        const companies = response.data

        setcompaniesList(companies)
        setcompaniesDropDownOptions(companies.map((company:Company) => (
          {
            label:company.tticoname, 
            value:company.tnmbr
          }
        )))

        setCompanyIdMap(companies.reduce((acc: {}, company: any) => {
          // @ts-ignore
          acc[company.tnmbr] = company.tticoname 
          return acc
        },{}))

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
      <CompaniesContext.Provider 
        value={{ 
          companiesDropDownOptions, 
          companiesList,
          companyIdMap,
          isLoadingCompaniescontext 
        }}
      >
          {children}
      </CompaniesContext.Provider>
  )
};

export const useCompaniesContext = () => useContext(CompaniesContext);