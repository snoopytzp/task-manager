import Header from "../components/Header";
import AddTaskForm from "../components/AddTaskForm";
import shellStyles from "./PageShell.module.css";

function NewTaskPage() {
  return (
    <div className={shellStyles.page}>
        <Header />
        <main className={shellStyles.content}>
          <AddTaskForm />
        </main>
    </div>
  );
}

export default NewTaskPage;