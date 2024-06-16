import { Outlet, ScrollRestoration } from "react-router-dom"
import Navbar from "../navbars/Navbar"

export default function RootLayout() {
    return (
      <div className="root-layout">
      <ScrollRestoration />
      <Navbar/>
      <main>
        <Outlet />
      </main>
    </div>
    )
  }
  