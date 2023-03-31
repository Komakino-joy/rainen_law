'use client';

import { httpGetAllClients } from "@/services/http";
import { Client, LabelValuePair } from "@/types/common";
import { hasValue, uniqueLabelValuePairs } from "@/utils/";
import { createContext, useContext, useEffect, useRef, useState } from "react";

interface ClientsContextProps {
  isLoadingClientsContext: boolean,
  clientSelectOptions: {
    CNAME: [{ label: string; value: string;}];
    CNMBR: [{ label: string; value: string;}];
    CSTAT: [{ label: string; value: string;}];
    CCNTCT: [{ label: string; value: string;}];
    CSTATTO: [{ label: string; value: string;}];
    CCITY: [{ label: string; value: string;}];
    CSTATE: [{ label: string; value: string;}];
    CZIP: [{ label: string; value: string;}];
    CPHONE: [{ label: string; value: string;}];
    CFAX: [{ label: string; value: string;}];
    CEMAIL: [{ label: string; value: string;}];
  };
}

const ClientsContext = createContext<ClientsContextProps>({
  isLoadingClientsContext: false,
  clientSelectOptions: {
    CNAME: [{ label: '', value: ''}],
    CNMBR: [{ label: '', value: ''}],
    CSTAT: [{ label: '', value: ''}],
    CCNTCT: [{ label: '', value: ''}],
    CSTATTO: [{ label: '', value: ''}],
    CCITY: [{ label: '', value: ''}],
    CSTATE: [{ label: '', value: ''}],
    CZIP: [{ label: '', value: ''}],
    CPHONE: [{ label: '', value: ''}],
    CFAX: [{ label: '', value: ''}],
    CEMAIL: [{ label: '', value: ''}]
  },
})

export const ClientsContextProvider = ({children}: {children:any}) => {
  const [isLoadingClientsContext, setIsLoading] = useState<boolean>(false)
  const [clientSelectOptions, setclientSelectOptions] = useState<any>([])

  const mounted = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {

      const httpFetchClientInfo = async () => {
        mounted.current = true;

        setIsLoading(true)
        // These are the only fields we care to make into Options for Select component
        const fields = [
          'CNAME', 'CNMBR', 'CSTAT', 'CCNTCT', 'CSTATTO',
          'CCITY', 'CSTATE', 'CZIP', 'CPHONE', 'CFAX', 'CEMAIL'
        ]
        const clients = await httpGetAllClients()

        const clientsObject = clients.reduce((acc: any, row: Client) => {
          // Iterate through our fields and see if we have assigned a value for each property in our accumulator
          // Assign empty array if no value is found
          for(let i=0; i<fields.length; i++) {
            if(!acc[fields[i]]) {
              acc[fields[i]] = []
            }
          }
          
          type clientKey = keyof typeof row
          
          // Iterate through our fields and push to our accumulator arrays
          for(let i=0; i<fields.length; i++) {
            if(hasValue(row[fields[i] as clientKey])) {
              acc[fields[i]].push({
                label: row[fields[i] as clientKey], 
                value:row[fields[i] as clientKey]
              })
            }
          }

          return acc
        }, {})
        
        // Remove all duplicate objects from our new arrays
        Object.keys(clientsObject).map(key => (
          clientsObject[key] = uniqueLabelValuePairs(clientsObject[key])
        ))

        clientsObject.CNMBR.sort(function(a: LabelValuePair, b:LabelValuePair) {
          return a.value - b.value;
        })

        setclientSelectOptions(clientsObject)
        setIsLoading(false)
      }
      
      if(mounted) {
        httpFetchClientInfo();
      }

      return () => {
        mounted.current = false;
      }
    
    } 
  },[])
  
  return (
    <ClientsContext.Provider value={{clientSelectOptions, isLoadingClientsContext}}>
      {children}
    </ClientsContext.Provider>
  )
};

export const useClientsContext = () => useContext(ClientsContext);