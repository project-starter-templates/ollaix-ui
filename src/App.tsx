import { Routes, Route } from "react-router";

import { Layout } from "@/pages/Layout";
import { Home } from "@/pages/Home";
import { NotFound } from "@/pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
