import NavBar from "./NavBar/NavBar";
import { Toaster } from 'react-hot-toast';
import { PropertiesContextProvider } from "@/context/Properties";
import { ClientsContextProvider } from "@/context/Clients";
import { CompaniesContextProvider } from "@/context/Companies";
import { INSTitlesContextProvider } from "@/context/INSTitles";
import { SelectDropDownsContextProvider } from "@/context/SelectDropDowns";
import { CountiesContextProvider } from "@/context/Counties";
import { ExaminersContextProvider } from "@/context/Examiners";

export default function Layout({ children }) {
  return (
    <div className="app">
      <NavBar />
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
      <Toaster />
    </div>
  )
}