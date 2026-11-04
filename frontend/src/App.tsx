import { Route, Routes } from "react-router";
import DashboardPage from "./pages/DashboardPage";
import EmployeePage from "./pages/EmployeePage";
import LeavePage from "./pages/LeavePage";
import EmployeeFormPage from "./pages/EmployeeFormPage";
import LeaveFormPage from "./pages/LeaveFormPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<DashboardPage />}></Route>
        <Route path="/employees" element={<EmployeePage />}></Route>
        <Route path="/employees/add" element={<EmployeeFormPage />}></Route>
        <Route path="/leaves" element={<LeavePage />}></Route>
        <Route path="/leaves/add" element={<LeaveFormPage />}></Route>
      </Routes>
    </>
  );
}

export default App;
