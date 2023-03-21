import NavBar from "./NavBar/NavBar";
import { Toaster } from 'react-hot-toast';
import { PropertiesContextProvider } from "@/context/Properties";
import { ClientsContextProvider } from "@/context/Clients";
import { CompaniesContextProvider } from "@/context/Companies";
import { INSTitlesContextProvider } from "@/context/INSTitles";

export default function Layout({ children }) {
  return (
    <div className="app">
      <NavBar />
      <INSTitlesContextProvider>
        <CompaniesContextProvider>
          <ClientsContextProvider>
            <PropertiesContextProvider>
              <main>{children}</main>
            </PropertiesContextProvider>
          </ClientsContextProvider>
        </CompaniesContextProvider>
      </INSTitlesContextProvider>
      <Toaster />
    </div>
  )
}