import SignUpPanel from "./components/Signup/Signup"
import LoginPanel from "./components/Login/Login"
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPanel />} />
      <Route path="/register" element={<SignUpPanel />} />
    </Routes>
  );
}
export default App;
