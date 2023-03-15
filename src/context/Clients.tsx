'use client';

import { Client } from "@/types/common";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

interface ClientsContextProps {
  clientsData: {
    CNAME: [];
    CNMBR: [];
    CSTAT: [];
    CCNTCT: [];
    CSTATTO: [];
    CCITY: [];
    CSTATE: [];
    CZIP: [];
    CPHONE: [];
    CFAX: [];
    CEMAIL: [];
  };
}

const ClientsContext = createContext<ClientsContextProps>({
  clientsData: {
    CNAME: [],
    CNMBR: [],
    CSTAT: [],
    CCNTCT: [],
    CSTATTO: [],
    CCITY: [],
    CSTATE: [],
    CZIP: [],
    CPHONE: [],
    CFAX: [],
    CEMAIL: []
  },
})

export const ClientsContextProvider = ({children}: {children:any}) => {
  const [clientsData, setClientsData] = useState<any>({})

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (async() => {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/clients/get-all-clients`)
        // Creating a map of all distinct client values
        const clientProps = response.data.reduce((acc: any, row: Client) => {
          if(!acc.CNAME) acc.CNAME = new Set()
          if(!acc.CNMBR) acc.CNMBR = new Set()
          if(!acc.CSTAT) acc.CSTAT = new Set()
          if(!acc.CCNTCT) acc.CCNTCT = new Set()
          if(!acc.CSTATTO) acc.CSTATTO = new Set()
          if(!acc.CCITY) acc.CCITY = new Set()
          if(!acc.CSTATE) acc.CSTATE = new Set()
          if(!acc.CZIP) acc.CZIP = new Set()
          if(!acc.CPHONE) acc.CPHONE = new Set()
          if(!acc.CFAX) acc.CFAX = new Set()
          if(!acc.CEMAIL) acc.CEMAIL = new Set()
  
          acc.CNAME.add(row.CNAME)
          acc.CNMBR.add(row.CNMBR)
          acc.CSTAT.add(row.CSTAT)
          acc.CCNTCT.add(row.CCNTCT)
          acc.CSTATTO.add(row.CSTATTO)
          acc.CCITY.add(row.CCITY)
          acc.CSTATE.add(row.CSTATE)
          acc.CZIP.add(row.CZIP)
          acc.CPHONE.add(row.CPHONE)
          acc.CFAX.add(row.CFAX)
          acc.CEMAIL.add(row.CEMAIL)
  
          return acc
        }, {})

        setClientsData({
          CNAME: [...clientProps.CNAME],
          CNMBR: [...clientProps.CNMBR],
          CSTAT: [...clientProps.CSTAT],
          CCNTCT: [...clientProps.CCNTCT],
          CSTATTO: [...clientProps.CSTATTO],
          CCITY: [...clientProps.CCITY],
          CSTATE: [...clientProps.CSTATE],
          CZIP: [...clientProps.CZIP],
          CPHONE: [...clientProps.CPHONE],
          CFAX: [...clientProps.CFAX],
          CEMAIL: [...clientProps.CEMAIL]
        })

      })();
    } 
  },[])

  return (
    <ClientsContext.Provider value={{clientsData}}>
      {children}
    </ClientsContext.Provider>
  )
};

export const useClientsContext = () => useContext(ClientsContext);