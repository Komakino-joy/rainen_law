'use client';

import { INSTitle, LabelValuePair } from "@/types/common";
import { hasValue, uniqueLabelValuePairs } from "@/utils";
import axios from "axios";
import { createContext, useContext, useEffect, useRef, useState } from "react";

interface INSTitlesContextProps {
  isLoadingINSTitlescontext: boolean;
  insTitleSelectOptions: {
    tticoname: LabelValuePair[];
    INMBR: LabelValuePair[]; 
    ISTAT: LabelValuePair[]; 
    ISTATE: LabelValuePair[]; 
    IZIP: LabelValuePair[]; 
    IREMIT: LabelValuePair[];
    ICITY: LabelValuePair[];
  };
}

interface insTitlesResponseObject {
  tticoname: [];
  INMBR: []; 
  ISTAT: []; 
  ISTATE: []; 
  IZIP: []; 
  IREMIT: [];
  ICITY: [];
}

const INSTitlesContext = createContext<INSTitlesContextProps>({
  isLoadingINSTitlescontext: false,
  insTitleSelectOptions: {
    tticoname: [],
    INMBR: [], 
    ISTAT: [], 
    ISTATE: [], 
    IZIP: [], 
    IREMIT: [],
    ICITY: []
  } 
})

export const INSTitlesContextProvider = ({children}: {children:any}) => {
  const [isLoadingINSTitlescontext, setIsLoading] = useState<boolean>(false)
  const [insTitleSelectOptions, setINSTitleSelectOptions] = useState<insTitlesResponseObject>({
    tticoname: [],
    INMBR: [], 
    ISTAT: [], 
    ISTATE: [], 
    IZIP: [], 
    IREMIT: [],
    ICITY: []
  })

  const mounted = useRef(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      mounted.current = true;

      const httpFetchProperyInfo = async() => {
        setIsLoading(true)

        const allTitlesResponse = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/titles/get-all-ins-titles`)

        // These are the only fields we care to make into Options for Select component
        const fields = [
          'tticoname', 
          'INMBR', 
          'ISTAT',
          'ISTATE', 
          'IZIP', 
          'IREMIT',
          'ICITY'
        ]

        const insTitlesObject = allTitlesResponse.data.reduce((acc: any, row: INSTitle) => {
          // Iterate through our fields and see if we have assigned a value for each property in our accumulator
          // Assign empty array if no value is found
          for(let i=0; i<fields.length; i++) {
            if(!acc[fields[i]]) {
              acc[fields[i]] = []
            }
          }
          
          type insTitlesKey = keyof typeof row
          
          // Iterate through our fields and push to our accumulator arrays
          for(let i=0; i<fields.length; i++) {
            if(hasValue(row[fields[i] as insTitlesKey])) {
              acc[fields[i]].push({
                label: row[fields[i] as insTitlesKey], 
                // Making sure that the user can see company name while sending the company ID to the Database
                value: fields[i] === 'tticoname' ? row.TITLECO  : row[fields[i] as insTitlesKey]
              })
            }
          }

          return acc
        }, {})
        
        // Remove all duplicate objects from our new arrays
        Object.keys(insTitlesObject).map(key => (
          insTitlesObject[key] = uniqueLabelValuePairs(insTitlesObject[key])
        ))

        setINSTitleSelectOptions(insTitlesObject)

        setIsLoading(false)
      }
      
      if(mounted) {
        httpFetchProperyInfo()
      }

      return () => {
        mounted.current = false
      }
    } 
  },[])


  return (
    <INSTitlesContext.Provider value={{insTitleSelectOptions, isLoadingINSTitlescontext}}>
        {children}
    </INSTitlesContext.Provider>
  )
};

export const useINSTitlesContext = () => useContext(INSTitlesContext);