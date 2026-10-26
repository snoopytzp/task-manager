import {useState, useContext, useEffect} from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { TaskContext } from "../contexts/TaskContext";
import { taskApi, toTask } from "../taskApi";
import styles from "./EditTaskForm.module.css";

function EditTaskForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { tasks, updateTask, pending } = useContext(TaskContext);
    const fetchedTask = tasks.find((task) => task.id === Number(id));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
      title: fetchedTask?.title || "",
      description: fetchedTask?.description || "",
      status: fetchedTask?.status || "todo",
      priority: fetchedTask?.priority || "medium"
    });

    useEffect(() => {
      const controller = new AbortController();
      const loadTask = async () => {
        setLoading(true);
        setError("");
        try {
          const task = await taskApi.get(id, controller.signal);
          if (!controller.signal.aborted) {
            setForm((previous) => {
              const loadedTask = toTask(task, previous);
              return {
                title: loadedTask.title,
                description: loadedTask.description || "",
                status: loadedTask.status,
                priority: loadedTask.priority,
              };
            });
          }
        } catch (err) {
          if (!controller.signal.aborted) setError(err.message);
        } finally {
          if (!controller.signal.aborted) setLoading(false);
        }
      };
      loadTask();
      return () => controller.abort();
    }, [id]);

    const handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedTask = {
            id: Number(id),
            ...form,
        };
        const saved = await updateTask(updatedTask);
        if (saved) navigate(`/tasks/${id}`);
    }

    if (loading) return <p role="status">Loading task...</p>;

    if (error) {
      return (
        <div className={styles.panel}>
          <p role="alert">{error}</p>
          <Link to="/tasks">Back to Tasks</Link>
        </div>
      );
    }

    return(
      <div className={styles.panel}>
      <h2 className={styles.name}>Edit Tasks</h2>

      <form onSubmit={handleSubmit}>
        <div className={styles.section}>
          <div className={styles.fieldRow}>
            <label className={styles.fieldLabel} htmlFor="title">
              Title
            </label>
            <input
              id="title"
              name="title"
              className={styles.fieldControl}
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.fieldRow}>
            <label className={styles.fieldLabel} htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className={styles.fieldControl}
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.fieldRow}>
            <label className={styles.fieldLabel} htmlFor="status">
              Status
            </label>
            <select
              id="status"
              name="status"
              className={styles.fieldControl}
              value={form.status}
              onChange={handleChange}
            >
              <option value="todo">To-Do</option>
              <option value="in-progress">In-Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div className={styles.fieldRow}>
            <label className={styles.fieldLabel} htmlFor="priority">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              className={styles.fieldControl}
              value={form.priority}
              onChange={handleChange}
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        <div className={styles.editActions}>
          <button type="submit" className={styles.saveButton} disabled={pending}>
            Save
          </button>
          <Link to={`/tasks/${id}`} className={styles.cancelButton}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
export default EditTaskForm;