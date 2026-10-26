export const initialState = {
    tasks: [],
    filter: 'all',
    priorityFilter: 'all',
};

export function taskReducer(state, action) {
  switch (action.type) {
    case "SET_TASKS":
        return {
            ...state,
            tasks: action.payload,
        };
    case "ADD_TASK":
        return {
            ...state,
            tasks: [...state.tasks, action.payload],
        };
    case "DELETE_TASK":
        return {
            ...state,
            tasks: state.tasks.filter((c) => c.id !== action.payload),
        };
    case "SET_FILTER":
        return {
            ...state,
            filter: action.payload,
        };
    case "UPDATE_TASK":
        return {
            ...state,
            tasks: state.tasks.map((task) =>
                task.id === action.payload.id ? action.payload : task
            ),
        };
    case "SET_PRIORITY_FILTER":
        return {
            ...state,
            priorityFilter: action.payload,
        };
    case "MOVE_TASK": {
        const { draggedTaskId, targetTaskId = null, targetStatus = null } = action.payload;
        const draggedIndex = state.tasks.findIndex((task) => task.id === draggedTaskId);

        if (draggedIndex < 0) {
            return state;
        }

        const nextTasks = [...state.tasks];
        const [draggedTask] = nextTasks.splice(draggedIndex, 1);
        const updatedDraggedTask = targetStatus
            ? { ...draggedTask, status: targetStatus }
            : draggedTask;

        if (targetTaskId !== null) {
            const targetIndex = nextTasks.findIndex((task) => task.id === targetTaskId);

            if (targetIndex < 0) {
                return {
                    ...state,
                    tasks: [...nextTasks, updatedDraggedTask],
                };
            }

            nextTasks.splice(targetIndex, 0, updatedDraggedTask);
            return {
                ...state,
                tasks: nextTasks,
            };
        }

        if (!targetStatus) {
            return {
                ...state,
                tasks: [...nextTasks, updatedDraggedTask],
            };
        }

        let insertIndex = nextTasks.length;
        for (let i = nextTasks.length - 1; i >= 0; i -= 1) {
            if (nextTasks[i].status === targetStatus) {
                insertIndex = i + 1;
                break;
            }
        }

        nextTasks.splice(insertIndex, 0, updatedDraggedTask);
        return {
            ...state,
            tasks: nextTasks,
        };
    }
    default:
      return state;
  }
}
