import "./App.css";
import React from "react";
import { RouterProvider, createBrowserRouter, createHashRouter} from "react-router-dom";
import NotFound from "./Modules/SharedModule/components/NotFound/NotFound";
import Login from "./Modules/AuthenticationModule/components/Login/Login";
import AuthLayout from "./Modules/SharedModule/components/AuthLayout/AuthLayout";
import ForgetPass from "./Modules/AuthenticationModule/components/ForgetPass/ForgetPass";
import ResetPass from "./Modules/AuthenticationModule/components/ResetPass/ResetPass";
import VerifyAccount from "./Modules/AuthenticationModule/components/VerifyAccount/VerifyAccount";
import Register from "./Modules/AuthenticationModule/components/Register/Register";
import MasterLayout from "./Modules/SharedModule/components/MasterLayout/MasterLayout";
import ProjectsList from "./Modules/ProjectsModule/components/ProjectsList/ProjectsList";
import ProtectedRoute from "./Modules/SharedModule/components/ProtectedRoute/ProtectedRoute";
import TasksList from "./Modules/TasksModule/components/TasksList/TasksList";
import UsersList from "./Modules/UsersModule/components/UsersList/UsersList";
import Dashboard from "./Modules/DashboardModule/components/Dashboard/Dashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProjectsData from "./Modules/ProjectsModule/components/ProjectsData/ProjectsData";
import TasksData from "./Modules/TasksModule/components/TasksData/TasksData";
import TaskBoard from "./Modules/TasksModule/components/TaskBoard/TaskBoard";

function App() {
  const routes = createHashRouter([
    {
      path: "/",
      element: <AuthLayout />,
      errorElement: <NotFound />,
      children: [
        { path: "", element: <Login /> },
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
        { path: "forgetpass", element: <ForgetPass /> },
        { path: "resetpass", element: <ResetPass /> },
        { path: "verify", element: <VerifyAccount /> },
      ],
    },
    {
      path: "DashBoard",
      element: (
        <ProtectedRoute>
          <MasterLayout />
        </ProtectedRoute>
      ),
      errorElement: <NotFound />,
      children: [
        { path: "", element: <Dashboard /> },
        { path: "projects", element: <ProjectsList /> },
        { path: "projectsdata", element: <ProjectsData /> },
        { path: "projectsdata/:id", element: <ProjectsData /> }, // Add this route
        { path: "tasks", element: <TasksList /> },
        { path: "tasksdata", element: <TasksData /> },
        { path: "tasksedit/:id", element: <TasksData /> },
        { path: "users", element: <UsersList /> },
        { path: "taskboard", element: <TaskBoard /> },
      ],
    },
  ]);

  return (
    <div className="App">
      <ToastContainer />
      <RouterProvider router={routes} />
    </div>
  );
}

export default App;
