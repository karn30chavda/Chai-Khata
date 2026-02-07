import React from "react";
import { Trash2, Calendar, Clock, Coffee, User } from "lucide-react";
import { format, parseISO } from "date-fns";

function History({ entries, onDelete, isAdmin }) {
  if (entries.length === 0) {
    return (
      <div className="form-card text-center" style={{ padding: "60px 20px" }}>
        <Coffee size={48} color="#cbd5e1" style={{ margin: "0 auto 20px" }} />
        <h3 style={{ color: "#1a1a1a", marginBottom: "8px" }}>
          No entries found
        </h3>
        <p style={{ color: "#64748b" }}>Your office activity log is empty!</p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "20px" }}>
        Timeline
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="form-card"
            style={{ padding: "18px 20px", marginBottom: "0" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "15px" }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    background: entry.itemName.toLowerCase().includes("chai")
                      ? "#fff7ed"
                      : "#ebf5ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: entry.itemName.toLowerCase().includes("chai")
                      ? "#f97316"
                      : "#3b82f6",
                  }}
                >
                  <Coffee size={24} />
                </div>
                <div>
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: "1rem",
                      color: "#1e293b",
                    }}
                  >
                    {entry.itemName}
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#64748b",
                      fontWeight: 600,
                      marginTop: "2px",
                    }}
                  >
                    {format(parseISO(entry.date), "MMM dd • hh:mm a")}
                  </div>
                  <div
                    style={{
                      fontSize: "0.65rem",
                      color: "#6366f1",
                      fontWeight: 800,
                      marginTop: "4px",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <User size={10} /> {entry.userName || "Unknown"} •{" "}
                    {entry.time}
                  </div>
                </div>
              </div>

              <div
                style={{
                  textAlign: "right",
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: "1.1rem",
                      color: "#6366f1",
                    }}
                  >
                    ₹{entry.price * entry.quantity}
                  </div>
                  <div
                    style={{
                      fontSize: "0.65rem",
                      color: "#94a3b8",
                      fontWeight: 700,
                    }}
                  >
                    {entry.quantity} UNIT
                  </div>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => onDelete(entry.id)}
                    style={{
                      background: "#fef2f2",
                      border: "none",
                      color: "#ef4444",
                      padding: "10px",
                      borderRadius: "10px",
                      cursor: "pointer",
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default History;
