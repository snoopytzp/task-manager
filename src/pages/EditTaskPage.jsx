import Header from "../components/Header";
import EditTaskForm from "../components/EditTaskForm";
import shellStyles from "./PageShell.module.css";

function EditTaskPage() {
  return (
    <div className={shellStyles.page}>
      <Header />
      <main className={shellStyles.content}>
        <EditTaskForm />
      </main>
    </div>
  );
}

export default EditTaskPage;