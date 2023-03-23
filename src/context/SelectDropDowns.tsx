'use client';

import { ClientStatus, InsStatus, PropertyStatus, PropertyType } from "@/types/common";
import axios from "axios";
import { createContext, useContext, useEffect, useRef, useState } from "react";

interface SelectDropDownsContextProps {
  isLoadingSelectDropDownsContext: boolean;
  clientStatusOptions: ClientStatus[];
  insStatusOptions: InsStatus[];
  propertyStatusOptions: PropertyStatus[];
  propertyTypeOptions: PropertyType[];
}

const SelectDropDownsContext = createContext<SelectDropDownsContextProps>({
  isLoadingSelectDropDownsContext: false,
  clientStatusOptions: [],
  insStatusOptions: [],
  propertyStatusOptions: [],
  propertyTypeOptions: []
})

export const SelectDropDownsContextProvider = ({children}: {children:any}) => {
  const [isLoadingSelectDropDownsContext, setIsLoading] = useState<boolean>(false)
  const [clientStatusOptions, setClientStatusOptions] = useState([])
  const [insStatusOptions, setInsStatusOptions] = useState([])
  const [propertyStatusOptions, setPropertyStatusOptions] = useState([])
  const [propertyTypeOptions, setPropertyTypeOptions] = useState([])

  const mounted = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      mounted.current = true;
      const httpFetchSelectOptions = async() => {
        setIsLoading(true)
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/management/get-select-drop-down-options`)

        setClientStatusOptions(response.data.clientStatusOptions)
        setInsStatusOptions(response.data.insStatusOptions)
        setPropertyStatusOptions(response.data.propertyStatusOptions)
        setPropertyTypeOptions(response.data.propertyTypeOptions)
      }
      
      if(mounted) {
        httpFetchSelectOptions()
      }
  
      return () => {
        mounted.current = false
      }
    } 
  },[])

  return (
      <SelectDropDownsContext.Provider 
        value={{
          isLoadingSelectDropDownsContext,
          clientStatusOptions,
          insStatusOptions,
          propertyStatusOptions,
          propertyTypeOptions
        }}
      >
          {children}
      </SelectDropDownsContext.Provider>
  )
};

export const useSelectDropDownsContext = () => useContext(SelectDropDownsContext);