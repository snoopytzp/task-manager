import { useContext } from "react";
import {TaskContext} from "../contexts/TaskContext";
import styles from "./FilterBar.module.css";

function FilterBar(){
    const { filter, setFilter, priorityFilter, setPriorityFilter } = useContext(TaskContext);

    const Status_filters = [
      { key: "all", label: "All" },
      { key: "todo", label: "ToDo" },
      { key: "in-progress", label: "In-Progress" },
      { key: "done", label: "Done" },
    ];

    const Priority_filters = [
      { key: "all", label: "All" },
      { key: "high", label: "High" },
      { key: "medium", label: "Medium" },
      { key: "low", label: "Low" },
    ];

    return (
        <div className={styles.filterBar}>
            <div className={styles.divider}>
                Priority:
                {Priority_filters.map((filterOption) => (
                    <button
                        key={filterOption.key}
                        className={`${styles.filterPill} ${priorityFilter === filterOption.key ? styles.active : ""}`}
                        onClick={() => setPriorityFilter(filterOption.key)}
                    >
                        {filterOption.label}
                    </button>
                    ))}
            </div>
            <div className={styles.divider}>
                Status:
                {Status_filters.map((filterOption) => (
                    <button
                        key={filterOption.key}
                        className={`${styles.filterPill} ${filter === filterOption.key ? styles.active : ""}`}
                        onClick={() => setFilter(filterOption.key)}
                    >
                        {filterOption.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default FilterBar