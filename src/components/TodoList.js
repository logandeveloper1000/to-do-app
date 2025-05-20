import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  getDocs,
} from "firebase/firestore";
import {
  signOut,
  deleteUser,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function TodoList({ user }) {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const navigate = useNavigate();
  const todosRef = collection(db, "users", user.uid, "todos");

  useEffect(() => {
    const q = query(todosRef);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTodos(items);
    });
    return () => unsubscribe();
  }, []);

  const addTodo = async () => {
    if (newTodo.trim() === "") return;
    await addDoc(todosRef, {
      text: newTodo,
      completed: false,
    });
    setNewTodo("");
  };

  const toggleComplete = async (todo) => {
    await updateDoc(doc(todosRef, todo.id), {
      completed: !todo.completed,
    });
  };

  const deleteTodo = async (id) => {
    await deleteDoc(doc(todosRef, id));
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const handleDeleteAccount = () => {
    setConfirmingDelete(true);
  };

  const confirmDeleteAccount = async () => {
    try {
      // Step 1: Delete all user tasks from Firestore
      const userTasksSnapshot = await getDocs(todosRef);
      const deletePromises = userTasksSnapshot.docs.map((docSnap) =>
        deleteDoc(doc(db, "users", user.uid, "todos", docSnap.id))
      );
      await Promise.all(deletePromises);

      // Step 2: Delete the user account
      await deleteUser(auth.currentUser);

      // Step 3: Redirect
      navigate("/signup");
    } catch (error) {
      alert("Error deleting account: " + error.message);
    }
  };

  const incompleteTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user.email}</h1>
        <div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
          <button className="delete-account-btn" onClick={handleDeleteAccount}>
            Delete Account
          </button>
        </div>
      </div>

      {/* Active Tasks */}
      <div className="todo-card">
        <h2>Your Tasks</h2>
        <div className="todo-input">
          <input
            type="text"
            placeholder="Enter a new task"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addTodo();
            }}
          />
          <button onClick={addTodo}>Add</button>
        </div>

        <ul className="todo-list">
          {incompleteTodos.map((todo) => (
            <li key={todo.id}>
              <label>
                <input
                  type="checkbox"
                  checked={false}
                  onChange={() => toggleComplete(todo)}
                />
                <span>{todo.text}</span>
              </label>
              <button
                className="delete-btn"
                onClick={() => deleteTodo(todo.id)}
              >
                ❌
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Completed Tasks */}
      {completedTodos.length > 0 && (
        <div className="todo-card completed-section">
          <h2>Completed Tasks</h2>
          <ul className="todo-list">
            {completedTodos.map((todo) => (
              <li key={todo.id} className="completed">
                <label>
                  <input
                    type="checkbox"
                    checked={true}
                    onChange={() => toggleComplete(todo)}
                  />
                  <span>{todo.text}</span>
                </label>
                <button
                  className="delete-btn"
                  onClick={() => deleteTodo(todo.id)}
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {confirmingDelete && (
        <div className="modal-container error">
          <div className="modal-box">
            <div className="modal-header">
              <h3>Are you sure?</h3>
              <button onClick={() => setConfirmingDelete(false)}>✖</button>
            </div>
            <p className="modal-body">
              Deleting your account will also permanently delete all your tasks and cannot be undone.
            </p>
            <div style={{ marginTop: "15px", display: "flex", gap: "10px", justifyContent: "center" }}>
              <button onClick={confirmDeleteAccount} className="logout-btn">
                Yes, Delete Everything
              </button>
              <button onClick={() => setConfirmingDelete(false)} className="delete-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
