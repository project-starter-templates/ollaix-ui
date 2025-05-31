import { Outlet, useLocation } from "react-router";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export function Layout() {
  let location = useLocation();

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main
        className={`flex-grow${
          location.pathname === "/" ? " overflow-y-auto" : ""
        }`}
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
