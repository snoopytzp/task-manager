import { BrowserRouter, Routes, Route } from "react-router-dom";

import TasksListPage from "./pages/TasksListPage";
import NewTaskPage from "./pages/NewTaskPage";
import TaskDetailPage from "./pages/TaskDetailPage";
import EditTaskPage from "./pages/EditTaskPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<TasksListPage />} />
        <Route path="tasks" element={<TasksListPage />} />
        <Route path="tasks/new" element={<NewTaskPage />} />
        <Route path="tasks/:id" element={<TaskDetailPage />} />
        <Route path="tasks/:id/edit" element={<EditTaskPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
