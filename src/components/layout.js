import Bullshit from "./Bullshit/Bullshit";
import { Toaster } from 'react-hot-toast';
import { PropertiesContextProvider } from "@/context/Properties";
import { ClientsContextProvider } from "@/context/Clients";

export default function Layout({ children }) {
  return (
    <div className="app">
      <Bullshit />
      <ClientsContextProvider>
        <PropertiesContextProvider>
          <main>{children}</main>
        </PropertiesContextProvider>
      </ClientsContextProvider>
      <Toaster />
    </div>
  )
}