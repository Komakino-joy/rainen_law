import NavBar from "./NavBar/NavBar";
import { PropertiesContextProvider } from "@/context/Properties";
import { ClientsContextProvider } from "@/context/Clients";
import { SelectDropDownsContextProvider } from "@/context/SelectDropDowns";
import { CountiesContextProvider } from "@/context/Counties";
import { ExaminersContextProvider } from "@/context/Examiners";
import { UsersContextProvider } from "@/context/Users";
import { useAuth } from '../context/AuthContext'
import AuthPage from "@/pages/auth";

export default function Layout({ children }) {

  const { user, isLoadingAuthContext } = useAuth()

  if(isLoadingAuthContext) {
    return <div></div>
  }

  if (!user) {
    return (
      <>
        <AuthPage />
      </>
    )
  }
  if (user) {
    return (
      <div className="app">
        <NavBar />
        <UsersContextProvider>
          <ExaminersContextProvider>
            <SelectDropDownsContextProvider>
              <CountiesContextProvider>
                <ClientsContextProvider>
                  <PropertiesContextProvider>
                    <main>{children}</main>
                  </PropertiesContextProvider>
                </ClientsContextProvider>
              </CountiesContextProvider>
            </SelectDropDownsContextProvider>
          </ExaminersContextProvider>
        </UsersContextProvider>
      </div>
    )
  }

}