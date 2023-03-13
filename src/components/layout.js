import Bullshit from "./Bullshit/Bullshit";
import { PropertiesContextProvider } from "@/context/Properties";

export default function Layout({ children }) {
  return (
    <div className="app">
      <Bullshit />
      <PropertiesContextProvider>
        <main>{children}</main>
      </PropertiesContextProvider>
    </div>
  )
}