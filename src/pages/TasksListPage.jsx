import Header from "../components/Header";
import FilterBar from "../components/FilterBar";
import TaskList from "../components/Tasklist";
import shellStyles from "./PageShell.module.css";

function TasksListPage() {

  return (
    <div className={shellStyles.page}>
        <Header />
        <main className={shellStyles.content}>
          <FilterBar />
          <TaskList />
        </main>
    </div>
  );
}

export default TasksListPage;