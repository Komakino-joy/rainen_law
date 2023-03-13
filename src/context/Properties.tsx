'use client';

import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

interface PropertiesContextProps {
  cityOptions: {PCITY:string}[];
  typeOptions: {PTYPE:string}[];
  statusOptions: {PSTAT:string}[];
  assignOptions: {PASIGN: string}[];
}

const PropertiesContext = createContext<PropertiesContextProps>({
  cityOptions: [{PCITY: ''}],
  typeOptions: [{PTYPE: ''}],
  statusOptions: [{PSTAT: ''}],
  assignOptions: [{PASIGN: ''}]
})

export const PropertiesContextProvider = ({children}: {children:any}) => {
  const [cityOptions, setCityOptions] = useState([])
  const [typeOptions, setTypeOptions] = useState([])
  const [statusOptions, setStatusOptions] = useState([])
  const [assignOptions, setAssignOptions] = useState([])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (async() => {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/properties/get-distinct-city-options`)
        setCityOptions(response.data)
      })();
  
      (async() => {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/properties/get-distinct-type-options`)
        setTypeOptions(response.data)
      })();
  
      (async() => {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/properties/get-distinct-status-options`)
        setStatusOptions(response.data)
      })();
  
      (async() => {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/properties/get-distinct-assign-options`)
        setAssignOptions(response.data)
      })();
    } 
  },[])

  return (
      <PropertiesContext.Provider 
        value={{ 
          cityOptions, 
          typeOptions,
          statusOptions,
          assignOptions 
        }}
      >
          {children}
      </PropertiesContext.Provider>
  )
};

export const usePropertiesContext = () => useContext(PropertiesContext);