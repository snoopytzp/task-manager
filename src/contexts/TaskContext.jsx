import { createContext, useReducer, useEffect, useState } from "react";
import { taskReducer, initialState} from "../reducers/taskReducer";
import { taskApi, toTask } from "../taskApi";

const TASK_METADATA = "taskMgr.TaskMetadata";

export const TaskContext = createContext();

export function TaskProvider({children}){
  const [metadata] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(TASK_METADATA) || "[]");
      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [state, dispatch] = useReducer(taskReducer, initialState);
  const {tasks, filter, priorityFilter} = state;
  const filteredTasks = tasks.filter((t) => filter.toLowerCase() === "all" || t.status.toLowerCase() === filter.toLowerCase()).filter((t) => priorityFilter.toLowerCase() === "all" || t.priority.toLowerCase() === priorityFilter.toLowerCase());

  useEffect(() => {
    const controller = new AbortController();
    const loadTasks = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await taskApi.list(controller.signal);
        const saved = new Map(metadata.map((task, index) => [task.id, { ...task, index }]));
        const loadedTasks = data.map((task) => toTask(task, saved.get(task.id)));
        loadedTasks.sort((first, second) =>
          (saved.get(first.id)?.index ?? Infinity) - (saved.get(second.id)?.index ?? Infinity)
        );
        if (!controller.signal.aborted) {
          dispatch({ type: "SET_TASKS", payload: loadedTasks });
        }
      } catch (err) {
        if (!controller.signal.aborted) setError(err.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    loadTasks();
    return () => controller.abort();
  }, [metadata, retryCount]);

  useEffect(() => {
    if (loading || error) return;
    try {
      localStorage.setItem(TASK_METADATA, JSON.stringify(
        tasks.map(({ id, status, priority }) => ({ id, status, priority }))
      ));
    } catch {
      return;
    }
  }, [tasks, loading, error]);

  const runMutation = async (operation) => {
    setPending(true);
    setError("");
    try {
      return await operation();
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setPending(false);
    }
  };

  const addTask = (taskData) => runMutation(async () => {
    const created = await taskApi.create(taskData);
    const task = toTask(created, taskData);
    dispatch({ type: "ADD_TASK", payload: task });
    return task;
  });

  const deleteTask = (taskId) => runMutation(async () => {
    await taskApi.remove(taskId);
    dispatch({ type: "DELETE_TASK", payload: taskId });
    return true;
  });

  const setFilter = (filter) => dispatch({ type: "SET_FILTER", payload: filter });
  const setPriorityFilter = (priorityFilter) => dispatch({ type: "SET_PRIORITY_FILTER", payload: priorityFilter });

  const updateTask = (updatedTask) => runMutation(async () => {
    const updated = await taskApi.update(updatedTask);
    const task = toTask(updated || await taskApi.get(updatedTask.id), updatedTask);
    dispatch({ type: "UPDATE_TASK", payload: task });
    return task;
  });

  const moveTask = ({ draggedTaskId, targetTaskId = null, targetStatus = null }) => runMutation(async () => {
    const draggedTask = tasks.find((task) => task.id === draggedTaskId);
    if (!draggedTask) return null;

    if (targetStatus && targetStatus !== draggedTask.status) {
      const updatedTask = { ...draggedTask, status: targetStatus };
      const updated = targetStatus === "done"
        ? await taskApi.complete(draggedTaskId)
        : await taskApi.update(updatedTask);
      dispatch({
        type: "UPDATE_TASK",
        payload: toTask(updated || await taskApi.get(draggedTaskId), updatedTask),
      });
    }
    dispatch({
      type: "MOVE_TASK",
      payload: { draggedTaskId, targetTaskId, targetStatus },
    });
    return true;
  });

  return (
    <TaskContext.Provider
      value={{
        tasks,
        filteredTasks,
        filter,
        priorityFilter,
        loading,
        error,
        pending,
        addTask,
        deleteTask,
        setFilter,
        setPriorityFilter,
        updateTask,
        moveTask
      }}
    >
      {loading ? <p role="status">Loading tasks...</p> : null}
      {error ? (
        <div role="alert">
          <p>{error}</p>
          <button type="button" disabled={pending} onClick={() => setRetryCount((count) => count + 1)}>
            Retry loading tasks
          </button>
        </div>
      ) : null}
      {!loading ? children : null}
    </TaskContext.Provider>
  );
}