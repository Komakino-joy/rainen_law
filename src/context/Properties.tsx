'use client';

import { LabelValuePair } from "@/types/common";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

interface PropertiesContextProps {
  propertiesSelectOptions: {
    PCITY: LabelValuePair[]; 
    PTYPE: LabelValuePair[]; 
    PSTAT: LabelValuePair[]; 
    PASIGN:LabelValuePair[];
  };
}

interface propertyResponseObject {
  PCITY: []; 
  PTYPE: []; 
  PSTAT: []; 
  PASIGN:[];
}


const PropertiesContext = createContext<PropertiesContextProps>({
  propertiesSelectOptions: {
    PCITY: [], 
    PTYPE: [], 
    PSTAT: [], 
    PASIGN:[]
  } 
})

export const PropertiesContextProvider = ({children}: {children:any}) => {
  const [propertiesResponseObject, setPropertiesResponseObject] = useState<propertyResponseObject>({
    PCITY: [], 
    PTYPE: [], 
    PSTAT: [], 
    PASIGN:[]
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const httpFetchProperyInfo = async() => {
        const cityResponse = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/properties/get-distinct-city-options`)
        const typeResponse = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/properties/get-distinct-type-options`)
        const statusResponse = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/properties/get-distinct-status-options`)
        const assignResponse = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/properties/get-distinct-assign-options`)

        setPropertiesResponseObject({
          PCITY: cityResponse.data,
          PTYPE: typeResponse.data,
          PSTAT: statusResponse.data,
          PASIGN: assignResponse.data
        })
      }

      httpFetchProperyInfo();
    } 
  },[])

  type propKey = keyof typeof propertiesResponseObject

  const propertiesSelectOptions = Object.keys(propertiesResponseObject).reduce((acc:any, fieldName:any) => {
    acc[fieldName] = propertiesResponseObject[fieldName as propKey].map((field:any) => ({
      label: field[fieldName],
      value: field[fieldName]
    }))
    return acc
  },{})

  return (
    <PropertiesContext.Provider value={{propertiesSelectOptions}}>
        {children}
    </PropertiesContext.Provider>
  )
};

export const usePropertiesContext = () => useContext(PropertiesContext);