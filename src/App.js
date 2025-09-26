import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import WelcomeEmployee from "./WelcomeEmployee";
import Home from "./Home";
import ForgotPassword from "./ForgotPassword";
import CreateEmployee from "./CreateEmployee";
import ApplyLeave from "./ApplyLeave"
import ManageLeaves from "./ManageLeaves";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/home" element={<Home />} >
        <Route path="welcome" element={<WelcomeEmployee />} />
        <Route path="create" element={<CreateEmployee />}/>
        <Route path="applyLeave" element={<ApplyLeave />}/>
        <Route path="manageLeaves" element={<ManageLeaves />}/>
      </Route>
    </Routes>
  );
}

export default App;
