import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import WelcomeEmployee from "./WelcomeEmployee";
import AdminHome from "./AdminHome";
import UserHome from "./UserHome";
import ForgotPassword from "./ForgotPassword";
import CreateEmployee from "./CreateEmployee";
import ApplyLeave from "./ApplyLeave"
import ManageLeaves from "./ManageLeaves";
import ViewEmployeeLeaves from "./ViewEmployeeLeaves";
import ViewMyLeaves from "./ViewMyLeaves";
import ChangePassword from "./ChangePassword";
import DeleteEmployee from "./DeleteEmployee";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/home" element={<AdminHome />} >
        <Route path="welcome" element={<WelcomeEmployee />} />
        <Route path="create" element={<CreateEmployee />}/>
        <Route path="applyLeave" element={<ApplyLeave />}/>
        <Route path="manageLeaves" element={<ManageLeaves />}/>
        <Route path="viewEmployeeLeaves" element={<ViewEmployeeLeaves />}/>
        <Route path="viewMyLeaves" element={<ViewMyLeaves />}/>
        <Route path="changePassword" element={<ChangePassword />}/>
        <Route path="delete" element={<DeleteEmployee />}/> 
      </Route>
      <Route path="/userhome" element={<UserHome />} >
        <Route path="welcome" element={<WelcomeEmployee />} />        
        <Route path="applyLeave" element={<ApplyLeave />}/>
        <Route path="viewMyLeaves" element={<ViewMyLeaves />}/>
        <Route path="changePassword" element={<ChangePassword />}/>
      </Route>
    </Routes>
  );
}

export default App;
