import { StrictMode } from "react";
import { Navigate } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import Layout from "./Layout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Validate from "./pages/Validate.jsx";
import IdeaDetail from "./pages/IdeaDetail.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import UsereDetails from "./pages/UsereDetails.jsx";
import Profile from "./pages/Profile.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import SendPassRequest from "./pages/SendPassRequest.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Dashboard />} />
      <Route path="validate">
        <Route index element={<Navigate to="idea" replace />} />
        <Route path="idea" element={<Validate step={1} />} />
        <Route path="insights" element={<Validate step={2} />} />
        <Route path="post-ideas" element={<Validate step={3} />} />
      </Route>
      <Route path="idea/:id" element={<IdeaDetail />} />
      <Route path="user" element={<UsereDetails />} />
      <Route path="auth">
        <Route index element={<Login />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="send-pass-request" element={<SendPassRequest />} />
      </Route>
      <Route path="profile" element={<Profile />} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
