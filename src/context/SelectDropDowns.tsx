'use client';

import { httpGetSelectDropDownOptions } from "@/services/http";
import { ClientStatus, County, LabelValuePair, PropertyStatus, PropertyType } from "@/types/common";
import { createContext, useContext, useEffect, useRef, useState } from "react";

interface SelectDropDownsContextProps {
  isLoadingSelectDropDownsContext: boolean;
  clientStatusList: ClientStatus[];
  propertyStatusList: PropertyStatus[];
  propertyTypeList: PropertyType[];
  countyList: County[];
  clientStatusDropDownOptions: LabelValuePair[];
  propertyStatusDropDownOptions: LabelValuePair[];
  propertyTypeDropDownOptions: LabelValuePair[];
  countyDropDownOptions: LabelValuePair[];
}

const SelectDropDownsContext = createContext<SelectDropDownsContextProps>({
  isLoadingSelectDropDownsContext: false,
  clientStatusList: [],
  propertyStatusList: [],
  propertyTypeList: [],
  countyList: [],
  clientStatusDropDownOptions: [],
  propertyStatusDropDownOptions: [],
  propertyTypeDropDownOptions: [],
  countyDropDownOptions: [],
})

export const SelectDropDownsContextProvider = ({children}: {children:any}) => {
  const [isLoadingSelectDropDownsContext, setIsLoading] = useState<boolean>(false)
  const [clientStatusList, setClientStatusList] = useState([])
  const [propertyStatusList, setPropertyStatusList] = useState([])
  const [propertyTypeList, setPropertyTypeList] = useState([])
  const [countyList, setCountyList] = useState([])


  const [clientStatusDropDownOptions, setClientStatusDropDownOptions] = useState([])
  const [propertyStatusDropDownOptions, setPropertyStatusDropDownOptions] = useState([])
  const [propertyTypeDropDownOptions, setPropertyTypeDropDownOptions] = useState([])
  const [countyDropDownOptions, setCountyDropDownOptions] = useState([])

  const mounted = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      mounted.current = true;
      const httpFetchDropDownOptions = async() => {
        setIsLoading(true)
        const selectDropDownOptions = await httpGetSelectDropDownOptions()
        const {
          clientStatusList, propertyStatusList, 
          propertyTypeList, countyList
        } = selectDropDownOptions

        setClientStatusList(clientStatusList)
        setPropertyStatusList(propertyStatusList)
        setPropertyTypeList(propertyTypeList)
        setCountyList(countyList)

        setClientStatusDropDownOptions(clientStatusList.map((status: ClientStatus) => (
          { label:status.status_desc, value:status.status_code }
        )))
        setPropertyStatusDropDownOptions(propertyStatusList.map((status: PropertyStatus) => (
          { label:status.status_code, value:status.status_code }
        )))
        setPropertyTypeDropDownOptions(propertyTypeList.map((type: PropertyType) => (
          { label:type.type_desc, value:type.type_code }
        )))
        setCountyDropDownOptions(countyList.map((county: County) => (
          { label:county.code, value:county.code }
        )))

        setIsLoading(false)
      }
      
      if(mounted) {
        httpFetchDropDownOptions()
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
          clientStatusList,
          propertyStatusList,
          propertyTypeList,
          countyList,
          clientStatusDropDownOptions,
          propertyStatusDropDownOptions,
          propertyTypeDropDownOptions,
          countyDropDownOptions,
        }}
      >
          {children}
      </SelectDropDownsContext.Provider>
  )
};

export const useSelectDropDownsContext = () => useContext(SelectDropDownsContext);