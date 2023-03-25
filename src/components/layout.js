import NavBar from "./NavBar/NavBar";
import { PropertiesContextProvider } from "@/context/Properties";
import { ClientsContextProvider } from "@/context/Clients";
import { CompaniesContextProvider } from "@/context/Companies";
import { INSTitlesContextProvider } from "@/context/INSTitles";
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
              <INSTitlesContextProvider>
                <CompaniesContextProvider>
                  <CountiesContextProvider>
                    <ClientsContextProvider>
                      <PropertiesContextProvider>
                        <main>{children}</main>
                      </PropertiesContextProvider>
                    </ClientsContextProvider>
                  </CountiesContextProvider>
                </CompaniesContextProvider>
              </INSTitlesContextProvider>
            </SelectDropDownsContextProvider>
          </ExaminersContextProvider>
        </UsersContextProvider>
      </div>
    )
  }

}