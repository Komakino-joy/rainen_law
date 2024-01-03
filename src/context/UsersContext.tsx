"use client";

import { httpGetUsers } from "@/services/http";
import { createContext, useContext, useEffect, useRef, useState } from "react";

interface OwnProps {
  isLoadingUserscontext: boolean;
  usersList: any[];
}

const UsersContext = createContext<OwnProps>({
  isLoadingUserscontext: false,
  usersList: [],
});

export const UsersContextProvider = ({ children }: { children: any }) => {
  const [isLoadingUserscontext, setIsLoading] = useState<boolean>(false);
  const [usersList, setUsersList] = useState([]);

  const mounted = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      mounted.current = true;
      const httpFetchExaminerInfo = async () => {
        setIsLoading(true);
        const users = await httpGetUsers();

        setUsersList(users);
        setIsLoading(false);
      };

      if (mounted) {
        httpFetchExaminerInfo();
      }

      return () => {
        mounted.current = false;
      };
    }
  }, []);

  return (
    <UsersContext.Provider
      value={{
        usersList,
        isLoadingUserscontext,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};

export const useUsersContext = () => useContext(UsersContext);
