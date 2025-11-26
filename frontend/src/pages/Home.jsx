import React, { useEffect, useState } from "react";
import { useContext } from "react";
import Input from "../components/Input";
import Todos from "../components/Todos";
import AuthContext from "../context/AuthContext";
import TodosContext from "../context/TodosContext";

function Home() {
  const { todos, dispatch } = useContext(TodosContext);
  const { dispatch: Authdispatch, user } = useContext(AuthContext);
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    const fetchTodos = async () => {
      const response = await fetch("http://localhost:5000/api/todos", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const json = await response.json();

      dispatch({ type: "FETCH_TODOS", payload: json });
    };

    fetchTodos();
  }, [dispatch, user.token]);

  const handleClick = () => {
    localStorage.removeItem("user");
    Authdispatch({ type: "LOGOUT" });
    dispatch({ type: "FETCH_TODOS" });
  };

  return (
    <div className="home">
      <div className="header">
        <h1 className="app-title">TASKIFY</h1>
        <div className="header-right">
          <button className="btn-add-task" onClick={() => setShowInput(!showInput)}>
            Add Task +
          </button>
          <span className="user-name">👤 {user.userName}</span>
          <button className="btn-logout" onClick={handleClick}>
            Logout
          </button>
        </div>
      </div>

      {showInput && (
        <div className="input-container">
          <Input />
        </div>
      )}

      <div className="table-container">
        <h2 className="table-title">My Todo Activities</h2>
        <table className="todos-table">
          <thead>
            <tr>
              <th>SERIAL NUMBER</th>
              <th>ACTIVITY NAME</th>
              <th>ACTIVE DURATION</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {todos && todos.map((todo, index) => (
              <Todos key={todo._id} todo={todo} serialNumber={index + 1} />
            ))}
          </tbody>
        </table>
        {(!todos || todos.length === 0) && (
          <div className="no-todos">
            <p>No tasks yet. Add your first task to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
