import React, { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast'
import { httpPostLogin } from '@/services/http';

// create the auth context
export const AuthContext = createContext();

// create the auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoadingAuthContext, setIsLoading] = useState(true)
  const router = useRouter();

  // check if the user is logged in on initial render
  useEffect(() => {
    setIsLoading(true)
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setIsLoading(false)
  }, []);

  // log in the user
  const login = async(userData) => {
    const response = await httpPostLogin({data: userData})
    if (response.data?.user !== undefined) {
      setUser(response.data?.user);
      localStorage.setItem('user', JSON.stringify(response.data?.user));
      router.push('/');
    } else {
      toast.error(response.data.message, {id: 'invalid-credentials'})
    }
  };

  // log out the user
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  // return the provider component with the auth context value
  return (
    <AuthContext.Provider value={{ user, login, logout, isLoadingAuthContext }}>
      {children}
    </AuthContext.Provider>
  );
};

// create the useAuth hook
export const useAuth = () => {
  const auth = React.useContext(AuthContext);
  if (!auth) {
    throw new Error('You must use this hook within the AuthProvider');
  }
  return auth;
};
