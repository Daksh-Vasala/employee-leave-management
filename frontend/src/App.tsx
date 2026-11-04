import { Route, Routes } from "react-router";
import Dashboard from "./pages/Dashboard";
import Employee from "./pages/Employee";
import Leaves from "./pages/Leaves";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />}></Route>
        <Route path="/employees" element={<Employee />}></Route>
        <Route path="/leaves" element={<Leaves />}></Route>
      </Routes>
    </>
  );
}

export default App;
