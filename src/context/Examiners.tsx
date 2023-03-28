'use client';

import { httpGetExaminers } from "@/services/http";
import { Examiner } from "@/types/common";
import { createContext, useContext, useEffect, useRef, useState } from "react";

interface ExaminersContextProps {
  isLoadingExaminerscontext: boolean;
  examinersList: any[];
  examinersDropDownOptions: any[];
}

const ExaminersContext = createContext<ExaminersContextProps>({
  isLoadingExaminerscontext: false,
  examinersList: [],
  examinersDropDownOptions: []
})

export const ExaminersContextProvider = ({children}: {children:any}) => {
  const [isLoadingExaminerscontext, setIsLoading] = useState<boolean>(false)
  const [examinersList, setExaminersList] = useState([])
  const [examinersDropDownOptions, setExaminersDropDownOptions] = useState([])

  const mounted = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      mounted.current = true;
      const httpFetchExaminerInfo = async() => {
        setIsLoading(true)
        const examiners = await httpGetExaminers()

        setExaminersList(examiners)

        setExaminersDropDownOptions(examiners.map((examiner:Examiner) => (
          {
            label:examiner.name, 
            value:examiner.name
          }
        )))

        setIsLoading(false)
      }

      if(mounted) {
        httpFetchExaminerInfo()
      }
  
      return () => {
        mounted.current = false
      }
    } 
  },[])

  return (
      <ExaminersContext.Provider 
        value={{ 
          examinersList, 
          examinersDropDownOptions,
          isLoadingExaminerscontext 
        }}
      >
          {children}
      </ExaminersContext.Provider>
  )
};

export const useExaminersContext = () => useContext(ExaminersContext);