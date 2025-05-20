// src/components/MessageModal.js
import React from "react";
import "./MessageModal.css";

export default function MessageModal({ type, message, onClose }) {
  if (!message) return null;

  const isError = type === "error";

  return (
    <div className={`modal-container ${isError ? "error" : "success"}`}>
      <div className="modal-box">
        <div className="modal-header">
          <h3>{isError ? "Error" : "Success"}</h3>
          <button onClick={onClose}>✖</button>
        </div>
        <p className="modal-body">{message}</p>
      </div>
    </div>
  );
}
