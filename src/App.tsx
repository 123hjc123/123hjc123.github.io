import { Navigate, Route, Routes } from "react-router";
import type { ReactElement } from "react";
import Course from "./pages/Course";
import Lesson from "./pages/Lesson";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { isAuthed } from "@/lib/auth";

function RequireAuth({ children }: { children: ReactElement }) {
  return isAuthed() ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/course" element={<RequireAuth><Course /></RequireAuth>} />
      <Route path="/course/lesson/:lessonId" element={<RequireAuth><Lesson /></RequireAuth>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
