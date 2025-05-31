import { Routes, Route } from "react-router";

function App() {
  return (
    <Routes>
      <Route path="/" element={<div>Hello World</div>} />
      <Route path="/about" element={<div>about</div>} />
      <Route path="*" element={<div>404</div>} />
    </Routes>
  );
}

export default App;
