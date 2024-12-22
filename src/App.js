import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editingTodo, setEditingTodo] = useState(null);
  const [editedText, setEditedText] = useState("");

  useEffect(() => {
    fetch("/api/todos")
      .then((response) => response.json())
      .then((data) => setTodos(data));
  }, []);

  const handleAdd = () => {
    if (newTodo.trim()) {
      fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newTodo.trim() }),
      }).then(() => {
        setNewTodo("");
        fetch("/api/todos")
          .then((response) => response.json())
          .then((data) => setTodos(data));
      });
    }
  };

  const handleEdit = (todo) => {
    setEditingTodo(todo.id);
    setEditedText(todo.text);
  };

  const handleUpdate = (id) => {
    if (editedText.trim()) {
      fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: editedText.trim() }),
      }).then(() => {
        setEditingTodo(null);
        setEditedText("");
        fetch("/api/todos")
          .then((response) => response.json())
          .then((data) => setTodos(data));
      });
    }
  };

  const handleDelete = (id) => {
    fetch(`/api/todos/${id}`, { method: "DELETE" }).then(() => {
      fetch("/api/todos")
        .then((response) => response.json())
        .then((data) => setTodos(data));
    });
  };

  return (
    <div className="App">
      <h1>To-Do App</h1>
      <div className="input-container">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new to-do"
        />
        <button onClick={handleAdd}>Add</button>
      </div>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className="todo-item">
            {editingTodo === todo.id ? (
              <input
                type="text"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
              />
            ) : (
              <span>{todo.text}</span>
            )}
            {editingTodo === todo.id ? (
              <button onClick={() => handleUpdate(todo.id)}>Update</button>
            ) : (
              <button onClick={() => handleEdit(todo)}>Edit</button>
            )}
            <button onClick={() => handleDelete(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

