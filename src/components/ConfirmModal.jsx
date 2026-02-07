import React from "react";
import { AlertTriangle, X } from "lucide-react";

function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger",
}) {
  if (!isOpen) return null;

  const getColors = () => {
    switch (type) {
      case "danger":
        return { primary: "#ef4444", bg: "#fef2f2" };
      case "warning":
        return { primary: "#f59e0b", bg: "#fffbeb" };
      default:
        return { primary: "#6366f1", bg: "#f5f3ff" };
    }
  };

  const colors = getColors();

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        className="fade-in"
        style={{
          background: "white",
          borderRadius: "24px",
          width: "100%",
          maxWidth: "400px",
          padding: "30px",
          boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "-10px",
          }}
        >
          <button
            onClick={onCancel}
            style={{
              background: "none",
              border: "none",
              color: "#94a3b8",
              cursor: "pointer",
            }}
          >
            <X size={24} />
          </button>
        </div>

        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "20px",
              background: colors.bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: colors.primary,
              margin: "0 auto 20px",
            }}
          >
            <AlertTriangle size={32} />
          </div>

          <h3
            style={{
              fontSize: "1.4rem",
              fontWeight: 800,
              color: "#1e293b",
              marginBottom: "10px",
            }}
          >
            {title}
          </h3>
          <p
            style={{
              color: "#64748b",
              fontSize: "0.95rem",
              lineHeight: "1.5",
              marginBottom: "30px",
            }}
          >
            {message}
          </p>

          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={onCancel}
              style={{
                flex: 1,
                padding: "14px",
                borderRadius: "14px",
                border: "2px solid #f1f5f9",
                background: "white",
                color: "#64748b",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              style={{
                flex: 1,
                padding: "14px",
                borderRadius: "14px",
                border: "none",
                background: colors.primary,
                color: "white",
                fontWeight: 800,
                cursor: "pointer",
                boxShadow: `0 8px 20px ${colors.primary}40`,
              }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
