import React, { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import MessageModal from "../components/MessageModal";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modal, setModal] = useState({ type: "", message: "" });
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault(); // Prevent page reload
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setModal({ type: "success", message: "Account created successfully!" });
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (error) {
      const msg = error.message.replace("Firebase:", "").trim();
      setModal({ type: "error", message: msg });
    }
  };

  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setModal({ type: "success", message: "Signed up with Google!" });
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
        <h2>Sign Up</h2>
        <form onSubmit={handleSignup}>
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
          <button type="submit">Sign Up</button>
        </form>
        <button onClick={handleGoogleSignup} style={{ marginTop: '10px' }}>
          Sign up with Google
        </button>
        <p>
          Already have an account? <Link to="/login">Log in here</Link>
        </p>
      </div>
      <MessageModal type={modal.type} message={modal.message} onClose={() => setModal({ type: "", message: "" })} />
    </div>
  );
}
