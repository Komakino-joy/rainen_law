import Bullshit from "./Bullshit/Bullshit";
import { Toaster } from 'react-hot-toast';
import { PropertiesContextProvider } from "@/context/Properties";

export default function Layout({ children }) {
  return (
    <div className="app">
      <Bullshit />
      <PropertiesContextProvider>
        <main>{children}</main>
      </PropertiesContextProvider>
      <Toaster />
    </div>
  )
}