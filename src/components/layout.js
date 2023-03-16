import Bullshit from "./Bullshit/Bullshit";
import { Toaster } from 'react-hot-toast';
import { PropertiesContextProvider } from "@/context/Properties";
import { ClientsContextProvider } from "@/context/Clients";
import { CompaniesContextProvider } from "@/context/Companies";

export default function Layout({ children }) {
  return (
    <div className="app">
      <Bullshit />
      <CompaniesContextProvider>
        <ClientsContextProvider>
          <PropertiesContextProvider>
            <main>{children}</main>
          </PropertiesContextProvider>
        </ClientsContextProvider>
      </CompaniesContextProvider>
      <Toaster />
    </div>
  )
}