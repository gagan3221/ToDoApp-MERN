import React, { useContext, useState } from "react";
import { IoClose } from "react-icons/io5";
import AuthContext from "../context/AuthContext";
import TodosContext from "../context/TodosContext";

function AddTaskModal({ onClose }) {
  const [todo, setTodo] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { dispatch } = useContext(TodosContext);
  const { user } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!todo.trim()) {
      setError("Task name cannot be empty");
      return;
    }

    setError("");
    setIsLoading(true);

    const response = await fetch("http://localhost:5000/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ todo }),
    });

    const json = await response.json();
    setIsLoading(false);

    if (!response.ok) {
      setError(json.error || "Failed to create task");
      console.log(json.error);
    }

    if (response.ok) {
      dispatch({ type: "CREATE_TODO", payload: json });
      setTodo("");
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="add-task-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add New Task</h3>
          <button className="close-button" onClick={onClose}>
            <IoClose size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Task Name</label>
              <input
                type="text"
                placeholder="Enter your task name..."
                value={todo}
                onChange={(e) => setTodo(e.target.value)}
                autoFocus
              />
            </div>

            {error && (
              <div className="error-message">
                <span>⚠️ {error}</span>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button 
              type="button" 
              className="btn-cancel" 
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-submit"
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTaskModal;

