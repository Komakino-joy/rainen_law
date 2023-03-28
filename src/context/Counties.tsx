'use client';

import { httpGetCounties } from "@/services/http";
import { County } from "@/types/common";
import { createContext, useContext, useEffect, useRef, useState } from "react";

interface CountiesContextProps {
  isLoadingCountiescontext: boolean;
  countyIdMap: any;
  countiesList: any[];
}

const CountiesContext = createContext<CountiesContextProps>({
  isLoadingCountiescontext: false,
  countyIdMap: {},
  countiesList: []
})

export const CountiesContextProvider = ({children}: {children:any}) => {
  const [isLoadingCountiescontext, setIsLoading] = useState<boolean>(false)
  const [countiesList, setCountiesList] = useState([])
  const [countyIdMap, setCountyIdMap] = useState({})

  const mounted = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      mounted.current = true;
      const httpFetchCountyInfo = async() => {
        setIsLoading(true)
        const counties = await httpGetCounties()

        setCountiesList(counties.map((county:County) => (
          {
            label:county.county, 
            value:county.code
          }
        )))

        setCountyIdMap(counties.reduce((acc: {}, county: any) => {
          // @ts-ignore
          acc[county.code] = county.county 
          return acc
        },{}))

        setIsLoading(false)
      }

      if(mounted) {
        httpFetchCountyInfo()
      }
  
      return () => {
        mounted.current = false
      }
    } 
  },[])

  return (
      <CountiesContext.Provider 
        value={{ 
          countiesList, 
          countyIdMap,
          isLoadingCountiescontext 
        }}
      >
          {children}
      </CountiesContext.Provider>
  )
};

export const useCountiesContext = () => useContext(CountiesContext);