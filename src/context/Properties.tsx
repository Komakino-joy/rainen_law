'use client';

import { LabelValuePair } from "@/types/common";
import axios from "axios";
import { createContext, useContext, useEffect, useRef, useState } from "react";

interface PropertiesContextProps {
  isLoadingPropertyContext: boolean;
  propertiesSelectOptions: {
    PCITY: LabelValuePair[]; 
    PTYPE: LabelValuePair[]; 
    PSTAT: LabelValuePair[]; 
    PASIGN:LabelValuePair[];
  };
}

interface propertiesSelectOptions {
  PCITY: []; 
  PTYPE: []; 
  PSTAT: []; 
  PASIGN:[];
}


const PropertiesContext = createContext<PropertiesContextProps>({
  isLoadingPropertyContext: false,
  propertiesSelectOptions: {
    PCITY: [], 
    PTYPE: [], 
    PSTAT: [], 
    PASIGN:[]
  } 
})

export const PropertiesContextProvider = ({children}: {children:any}) => {
  const [isLoadingPropertyContext, setIsLoading] = useState<boolean>(false)
  const [propertiesSelectOptions, setPropertiesSelectOptions] = useState<propertiesSelectOptions>({
    PCITY: [], 
    PTYPE: [], 
    PSTAT: [], 
    PASIGN:[]
  })
  
  const mounted = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {

      const httpFetchProperyInfo = async() => {
        mounted.current = true;
        
        setIsLoading(true)
        const cityResponse = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/properties/get-distinct-city-options`)
        const typeResponse = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/properties/get-distinct-type-options`)
        const statusResponse = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/properties/get-distinct-status-options`)
        const assignResponse = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/properties/get-distinct-assign-options`)

        type propKey = keyof typeof propertiesResponseMap

        const propertiesResponseMap = {
          PCITY: cityResponse.data,
          PTYPE: typeResponse.data,
          PSTAT: statusResponse.data,
          PASIGN: assignResponse.data
        }

        const propertiesSelectOptions = Object.keys(propertiesResponseMap).reduce((acc:any, fieldName:any) => {
          acc[fieldName] = propertiesResponseMap[fieldName as propKey].map((field:any) => ({
            label: field[fieldName],
            value: field[fieldName]
          }))
          return acc
        },{})
        
        setPropertiesSelectOptions(propertiesSelectOptions)    
        setIsLoading(false)
      }

      if(mounted) {
        httpFetchProperyInfo();
      }

      return () => {
        mounted.current = false;
      }
    } 
  },[])

  return (
    <PropertiesContext.Provider value={{propertiesSelectOptions, isLoadingPropertyContext}}>
        {children}
    </PropertiesContext.Provider>
  )
};

export const usePropertiesContext = () => useContext(PropertiesContext);