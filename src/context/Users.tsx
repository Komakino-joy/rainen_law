'use client';

import axios from "axios";
import { createContext, useContext, useEffect, useRef, useState } from "react";

interface UsersContextProps {
  isLoadingUserscontext: boolean;
  usersList: any[];
}

const UsersContext = createContext<UsersContextProps>({
  isLoadingUserscontext: false,
  usersList: [],
})

export const UsersContextProvider = ({children}: {children:any}) => {
  const [isLoadingUserscontext, setIsLoading] = useState<boolean>(false)
  const [usersList, setUsersList] = useState([])

  const mounted = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      mounted.current = true;
      const httpFetchExaminerInfo = async() => {
        setIsLoading(true)
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/get-users`)
  
        const users = response.data

        setUsersList(users)
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
      <UsersContext.Provider 
        value={{ 
          usersList, 
          isLoadingUserscontext 
        }}
      >
          {children}
      </UsersContext.Provider>
  )
};

export const useUsersContext = () => useContext(UsersContext);