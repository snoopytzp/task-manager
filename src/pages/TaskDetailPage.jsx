import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { TaskContext } from "../contexts/TaskContext";
import { taskApi, toTask } from "../taskApi";
import Header from "../components/Header";
import styles from "./TaskDetailPage.module.css";
import shellStyles from "./PageShell.module.css";

function TaskDetailPage() {
  const { id } = useParams();
  const { tasks, moveTask, pending } = useContext(TaskContext);
  const [serverTask, setServerTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const taskId = Number(id);
  const metadata = tasks.find((item) => item.id === taskId);
  const task = serverTask ? toTask(serverTask, metadata) : null;

  useEffect(() => {
    const controller = new AbortController();
    const loadTask = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await taskApi.get(id, controller.signal);
        if (!controller.signal.aborted) setServerTask(data);
      } catch (err) {
        if (!controller.signal.aborted) setError(err.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    loadTask();
    return () => controller.abort();
  }, [id]);

  if (loading) return <p role="status">Loading task...</p>;

  if (error || !task) {
    return (
      <div className={shellStyles.page}>
        <Header />
        <main className={shellStyles.content}>
          <div className={styles.panel}>
            <h2 className={styles.name}>Unable to load task</h2>
            <p role="alert" className={styles.notFoundText}>{error || "The requested task does not exist."}</p>
            <Link to="/tasks">Back to Tasks</Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={shellStyles.page}>
      <Header />
      <main className={shellStyles.content}>
        <div className={styles.panel}>
          <h2 className={styles.name}>Task details</h2>

          <div className={styles.section}>
            <div className={styles.fieldRow}>
              <span className={styles.fieldLabel}>ID</span>
              <span className={styles.fieldValue}>{task.id}</span>
            </div>
            <div className={styles.fieldRow}>
              <span className={styles.fieldLabel}>Title</span>
              <span className={styles.fieldValue}>{task.title}</span>
            </div>
            <div className={styles.fieldRow}>
              <span className={styles.fieldLabel}>Description</span>
              <span className={styles.fieldValue}>{task.description}</span>
            </div>
            <div className={styles.fieldRow}>
              <span className={styles.fieldLabel}>Status</span>
              <span className={styles.fieldValue}>{task.status}</span>
            </div>
            <div className={styles.fieldRow}>
              <span className={styles.fieldLabel}>Priority</span>
              <span className={styles.fieldValue}>{task.priority}</span>
            </div>
          </div>

          <div className={styles.actions}>
            {task.status !== "done" ? (
              <button
                type="button"
                className={styles.editButton}
                disabled={pending}
                onClick={async () => {
                  const saved = await moveTask({ draggedTaskId: task.id, targetStatus: "done" });
                  if (saved) setServerTask((previous) => ({ ...previous, status: "done", completed: true }));
                }}
              >
                Mark complete
              </button>
            ) : null}
            <Link to={`/tasks/${id}/edit`} className={styles.editButton}>
              Edit
            </Link>
            <Link to="/tasks" className={styles.cancelButton}>
              Back
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default TaskDetailPage;