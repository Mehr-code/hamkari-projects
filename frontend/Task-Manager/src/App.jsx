import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";

import PrivateRoute from "./routes/PrivateRoute";

import DashBoard from "./pages/Admin/DashBoard";
import ManageTasks from "./pages/Admin/ManageTasks";
import CreateTask from "./pages/Admin/CreateTasks";
import ManageUsers from "./pages/Admin/MangeUsers";

import UserDashBoard from "./pages/User/UserDashBoard";
import UserTasks from "./pages/User/UserTasks";
import ViewTaskDetail from "./pages/User/ViewTaskDetail";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Admin Routes */}
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<DashBoard />} />
            <Route path="/admin/tasks" element={<ManageTasks />} />
            <Route path="/admin/create-task" element={<CreateTask />} />
            <Route path="/admin/mange-users" element={<ManageUsers />} />
          </Route>

          {/* Users Routes */}
          <Route element={<PrivateRoute allowedRoles={["user"]} />}>
            <Route path="/user/dashboard" element={<UserDashBoard />} />
            <Route path="/user/tasks" element={<UserTasks />} />
            <Route
              path="/user/tasks-details/:id"
              element={<ViewTaskDetail />}
            ></Route>
          </Route>
        </Routes>
      </Router>
    </>
  );
};

export default App;
