import { Outlet, useLocation } from "react-router";

export function Layout() {
  let location = useLocation();
  console.log(location);
  return (
    <div className="flex flex-col h-screen">
      <header>
        <h1>Dashboard</h1>
      </header>
      <main
        className={`flex-grow${
          location.pathname === "/" ? " overflow-y-auto" : ""
        }`}
      >
        <Outlet />
      </main>
      <footer>footer</footer>
    </div>
  );
}
