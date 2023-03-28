'use client';

import { httpGetSelectDropDownOptions } from "@/services/http";
import { ClientStatus, Company, County, InsStatus, LabelValuePair, PropertyStatus, PropertyType } from "@/types/common";
import { createContext, useContext, useEffect, useRef, useState } from "react";

interface SelectDropDownsContextProps {
  isLoadingSelectDropDownsContext: boolean;
  clientStatusList: ClientStatus[];
  insStatusList: InsStatus[];
  propertyStatusList: PropertyStatus[];
  propertyTypeList: PropertyType[];
  companyList: County[];
  countyList: Company[];

  clientStatusDropDownOptions: LabelValuePair[];
  insStatusDropDownOptions: LabelValuePair[];
  propertyStatusDropDownOptions: LabelValuePair[];
  propertyTypeDropDownOptions: LabelValuePair[];
  companyDropDownOptions: LabelValuePair[];
  countyDropDownOptions: LabelValuePair[];
}

const SelectDropDownsContext = createContext<SelectDropDownsContextProps>({
  isLoadingSelectDropDownsContext: false,
  clientStatusList: [],
  insStatusList: [],
  propertyStatusList: [],
  propertyTypeList: [],
  companyList: [],
  countyList: [],
  clientStatusDropDownOptions: [],
  insStatusDropDownOptions: [],
  propertyStatusDropDownOptions: [],
  propertyTypeDropDownOptions: [],
  companyDropDownOptions: [],
  countyDropDownOptions: [],
})

export const SelectDropDownsContextProvider = ({children}: {children:any}) => {
  const [isLoadingSelectDropDownsContext, setIsLoading] = useState<boolean>(false)
  const [clientStatusList, setClientStatusList] = useState([])
  const [insStatusList, setInsStatusList] = useState([])
  const [propertyStatusList, setPropertyStatusList] = useState([])
  const [propertyTypeList, setPropertyTypeList] = useState([])
  const [companyList, setCompanyList] = useState([])
  const [countyList, setCountyList] = useState([])


  const [clientStatusDropDownOptions, setClientStatusDropDownOptions] = useState([])
  const [insStatusDropDownOptions, setInsStatusDropDownOptions] = useState([])
  const [propertyStatusDropDownOptions, setPropertyStatusDropDownOptions] = useState([])
  const [propertyTypeDropDownOptions, setPropertyTypeDropDownOptions] = useState([])
  const [companyDropDownOptions, setCompanyDropDownOptions] = useState([])
  const [countyDropDownOptions, setCountyDropDownOptions] = useState([])

  const mounted = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      mounted.current = true;
      const httpFetchDropDownOptions = async() => {
        setIsLoading(true)
        const selectDropDownOptions = await httpGetSelectDropDownOptions()
        const {
          clientStatusList, insStatusList, propertyStatusList, 
          propertyTypeList, companyList, countyList
        } = selectDropDownOptions

        setClientStatusList(clientStatusList)
        setInsStatusList(insStatusList)
        setPropertyStatusList(propertyStatusList)
        setPropertyTypeList(propertyTypeList)
        setCompanyList(companyList)
        setCountyList(countyList)

        setClientStatusDropDownOptions(clientStatusList.map((status: ClientStatus) => (
          { label:status.status_code, value:status.status_code }
        )))
        setInsStatusDropDownOptions(insStatusList.map((status: InsStatus) => (
          { label:status.status_code, value:status.status_code }
        )))
        setPropertyStatusDropDownOptions(propertyStatusList.map((status: PropertyStatus) => (
          { label:status.status_code, value:status.status_code }
        )))
        setPropertyTypeDropDownOptions(propertyTypeList.map((type: PropertyType) => (
          { label:type.type_code, value:type.type_code }
        )))
        setCompanyDropDownOptions(companyList.map((company: Company) => (
          { label:company.tticoname, value:company.tnmbr }
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
          insStatusList,
          propertyStatusList,
          propertyTypeList,
          companyList,
          countyList,
          clientStatusDropDownOptions,
          insStatusDropDownOptions,
          propertyStatusDropDownOptions,
          propertyTypeDropDownOptions,
          companyDropDownOptions,
          countyDropDownOptions,
        }}
      >
          {children}
      </SelectDropDownsContext.Provider>
  )
};

export const useSelectDropDownsContext = () => useContext(SelectDropDownsContext);