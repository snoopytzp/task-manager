const configuredBase = (
  import.meta.env?.VITE_API_BASE_URL ||
  "https://module3-taskflow-api-production-9bee.up.railway.app/api"
).replace(/\/+$/, "");

export const API_BASE = import.meta.env?.DEV ? "/api" : configuredBase;

let taskFields = ["status", "priority"];

function rememberFields(task) {
  if (task) {
    taskFields = ["status", "priority", "completed"].filter((field) => Object.hasOwn(task, field));
  }
  return task;
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, options);

  if (!response.ok) {
    throw new Error(`Task request failed (${response.status}). Please try again.`);
  }

  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export function toTask(task, metadata = {}) {
  return {
    ...task,
    status: task.status || (task.completed ? "done" : metadata.status === "in-progress" ? "in-progress" : "todo"),
    priority: task.priority || metadata.priority || "medium",
  };
}

function taskOptions(task, method) {
  return {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: task.title,
      description: task.description,
      ...Object.fromEntries(taskFields.map((field) => [
        field,
        field === "completed" ? task.status === "done" : task[field],
      ])),
    }),
  };
}

export const taskApi = {
  list: async (signal) => {
    const tasks = await request("/tasks", { signal });
    rememberFields(tasks[0]);
    return tasks;
  },
  get: async (id, signal) => rememberFields(await request(`/tasks/${encodeURIComponent(id)}`, { signal })),
  create: (task) => request("/tasks", taskOptions(task, "POST")),
  update: (task) => request(`/tasks/${encodeURIComponent(task.id)}`, taskOptions(task, "PUT")),
  remove: (id) => request(`/tasks/${encodeURIComponent(id)}`, { method: "DELETE" }),
  complete: (id) => request(`/tasks/${encodeURIComponent(id)}/complete`, { method: "PUT" }),
};