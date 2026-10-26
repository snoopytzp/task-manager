import { useContext, useState } from "react";
import { TaskContext } from "../contexts/TaskContext";
import { Link } from "react-router-dom";
import styles from "./AddTaskForm.module.css";

function AddTaskForm({ backTo = "/tasks" }) {
  const { addTask, pending } = useContext(TaskContext);
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
  });

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim() || !form.description.trim()) {
      return;
    }

    const newTask = {
      title: form.title.trim(),
      description: form.description.trim(),
      status: form.status,
      priority: form.priority,
    };

    const created = await addTask(newTask);
    if (created) resetForm();
  };

  const isSubmitDisabled = pending || !form.title.trim() || !form.description.trim();

  return (
    <form className={styles.formRoot} onSubmit={handleSubmit}>
      <h2 className={styles.name}>Add Task</h2>

      <div className={styles.section}>
        <div className={styles.fieldRow}>
          <label className={styles.fieldLabel} htmlFor="task-title">Title</label>
        <input
          id="task-title"
          type="text"
          name="title"
          className={styles.fieldControl}
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Enter task title"
          required
        />
        </div>

        <div className={styles.fieldRow}>
          <label className={styles.fieldLabel} htmlFor="task-description">Description</label>
        <textarea
          id="task-description"
          name="description"
          className={styles.fieldControl}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Enter task description"
          rows={4}
          required
        />
        </div>

        <div className={styles.fieldRow}>
          <label className={styles.fieldLabel} htmlFor="task-status">Status</label>
          <select
            id="task-status"
            name="status"
            className={styles.fieldControl}
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="todo">Todo</option>
            <option value="in-progress">In-Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div className={styles.fieldRow}>
          <label className={styles.fieldLabel} htmlFor="task-priority">Priority</label>
          <select
            id="task-priority"
            name="priority"
            className={styles.fieldControl}
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div className={styles.editActions}>
        <button type="submit" className={styles.saveButton} disabled={isSubmitDisabled}>
          Add Task
        </button>
        <Link to={backTo} className={styles.cancelButton}>
          Back
        </Link>
      </div>
    </form>
  );
}

export default AddTaskForm;

