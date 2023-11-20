import LoginPanel from "./components/Login/Login"
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPanel />} />
    </Routes>
  );
}
export default App;
