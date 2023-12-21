import NavBar from "./NavBar/NavBar";
import { PropertiesContextProvider } from "@/context/PropertiesContext";
import { ClientsContextProvider } from "@/context/ClientsContext";
import { SelectDropDownsContextProvider } from "@/context/SelectDropDownsContext";
import { CitiesProvider } from "@/context/CitiesContext";
import { ExaminersContextProvider } from "@/context/ExaminersContext";
import { UsersContextProvider } from "@/context/UsersContext";
import { useAuth } from "../context/AuthContext";
import AuthPage from "@/pages/auth";

export default function Layout({ children }) {
  const { user, isLoadingAuthContext } = useAuth();

  if (isLoadingAuthContext) {
    return <div></div>;
  }

  if (!user) {
    return <AuthPage />;
  }
  if (user) {
    return (
      <div className="app">
        <NavBar />
        <UsersContextProvider>
          <ExaminersContextProvider>
            <SelectDropDownsContextProvider>
              <CitiesProvider>
                <ClientsContextProvider>
                  <PropertiesContextProvider>
                    <main>{children}</main>
                  </PropertiesContextProvider>
                </ClientsContextProvider>
              </CitiesProvider>
            </SelectDropDownsContextProvider>
          </ExaminersContextProvider>
        </UsersContextProvider>
      </div>
    );
  }
}
