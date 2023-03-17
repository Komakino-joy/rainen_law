'use client';

import { Client, LabelValuePair } from "@/types/common";
import { hasValue, uniqueLabelValuePairs } from "@/utils";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

interface INSTitlesContextProps {
  insTitleSelectOptions: {
    INMBR: LabelValuePair[]; ISTAT: LabelValuePair[]; tticoname: LabelValuePair[];
    ISTATE: LabelValuePair[]; 
    IZIP: LabelValuePair[]; IREMIT: LabelValuePair[];
  };
}

interface insTitlesResponseObject {
  INMBR: []; ISTAT: []; tticoname: [];
  ISTATE: []; 
  IZIP: []; IREMIT: [];
}

const INSTitlesContext = createContext<INSTitlesContextProps>({
  insTitleSelectOptions: {
    INMBR: [], ISTAT: [], tticoname: [],
    ISTATE: [], 
    IZIP: [], IREMIT: []
  } 
})

export const INSTitlesContextProvider = ({children}: {children:any}) => {

  const [insTitleSelectOptions, setINSTitleSelectOptions] = useState<insTitlesResponseObject>({
    INMBR: [], ISTAT: [], tticoname: [],
    ISTATE: [], 
    IZIP: [], IREMIT: []
  } )

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const httpFetchProperyInfo = async() => {
        const allTitlesResponse = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/titles/get-all-ins-titles`)

        // These are the only fields we care to make into Options for Select component
        const fields = [
          'tticoname', 'INMBR', 'ISTAT',
           'ISTATE', 'IZIP', 'IREMIT'
        ]

        const insTitlesObject = allTitlesResponse.data.reduce((acc: any, row: Client) => {
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
                value:row[fields[i] as insTitlesKey]
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
      }
      
      httpFetchProperyInfo();
    } 
  },[])

  console.log(insTitleSelectOptions)

  return (
    <INSTitlesContext.Provider value={{insTitleSelectOptions}}>
        {children}
    </INSTitlesContext.Provider>
  )
};

export const useINSTitlesContext = () => useContext(INSTitlesContext);