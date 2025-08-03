import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import { AppSidebar } from "./components/Sidebar.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import LoginPage from "./pages/Login.tsx";
import { Toaster } from "sonner";
import Subjects from "./pages/Subjects.tsx";
import SubjectDetail from "./pages/Subject.tsx";
import NotFound from "./pages/404.tsx";
import Post from "./pages/Post.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route element={<AppSidebar />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/subjects/:subjectId" element={<SubjectDetail />} />
          <Route path="/subjects/:subjectId/post/:postId" element={<Post />} />
        </Route>
        <Route>
          <Route path="/login" element={<LoginPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
