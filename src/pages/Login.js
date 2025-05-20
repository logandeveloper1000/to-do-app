import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import MessageModal from "../components/MessageModal";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modal, setModal] = useState({ type: "", message: "" });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent page reload
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setModal({ type: "success", message: "Logged in successfully!" });
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (error) {
      const msg = error.message.replace("Firebase:", "").trim();
      setModal({ type: "error", message: msg });
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setModal({ type: "success", message: "Logged in with Google!" });
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (error) {
      const msg = error.message.replace("Firebase:", "").trim();
      setModal({ type: "error", message: msg });
    }
  };

  return (
    <div>
      <h1 className="app-title">To Do List App</h1>
      <div className="auth-container">
        <h2>Log In</h2>
        <form onSubmit={handleLogin}>
          <input
            className="auth-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="auth-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Log In</button>
        </form>
        <button onClick={handleGoogleLogin} style={{ marginTop: '10px' }}>
          Sign in with Google
        </button>
        <p>
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </p>
      </div>
      <MessageModal type={modal.type} message={modal.message} onClose={() => setModal({ type: "", message: "" })} />
    </div>
  );
}
