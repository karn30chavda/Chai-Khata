import React, { useState } from "react";
import {
  Trash2,
  Calendar,
  Clock,
  Coffee,
  User,
  Edit2,
  Check,
  X,
} from "lucide-react";
import { format, parseISO } from "date-fns";

import CustomDatePicker from "./CustomDatePicker";

function History({ entries, onDelete, onUpdate, isAdmin }) {
  const [editingId, setEditingId] = useState(null);
  const [editDate, setEditDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleEditClick = (entry) => {
    setEditingId(entry.id);
    setEditDate(format(parseISO(entry.date), "yyyy-MM-dd"));
  };

  const handleSave = async (id, entry) => {
    if (!editDate) return;
    try {
      const originalDate = parseISO(entry.date);
      const [y, m, d] = editDate.split("-").map(Number);
      const newProps = new Date(y, m - 1, d);
      // Preserve Original Time
      newProps.setHours(
        originalDate.getHours(),
        originalDate.getMinutes(),
        originalDate.getSeconds(),
      );
      await onUpdate(id, { date: newProps.toISOString() });
      setEditingId(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update date");
    }
  };

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
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    {editingId === entry.id ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          background: "#f1f5f9",
                          padding: "4px 8px",
                          borderRadius: "8px",
                        }}
                      >
                        <Calendar size={14} color="#6366f1" />
                        <div
                          onClick={() => setShowDatePicker(true)}
                          style={{
                            fontSize: "0.75rem",
                            color: "#334155",
                            fontWeight: 700,
                            cursor: "pointer",
                            minWidth: "85px",
                            userSelect: "none",
                          }}
                        >
                          {editDate
                            ? format(parseISO(editDate), "MMM dd, yyyy")
                            : "Select Date"}
                        </div>
                        <button
                          onClick={() => handleSave(entry.id, entry)}
                          style={{
                            background: "#dcfce7",
                            border: "none",
                            cursor: "pointer",
                            color: "#10b981",
                            padding: "4px",
                            borderRadius: "4px",
                            display: "flex",
                          }}
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          style={{
                            background: "#fee2e2",
                            border: "none",
                            cursor: "pointer",
                            color: "#ef4444",
                            padding: "4px",
                            borderRadius: "4px",
                            display: "flex",
                          }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <Calendar size={10} />
                          {format(parseISO(entry.date), "MMM dd, yyyy")}
                        </span>
                        <span>•</span>
                        <span style={{ color: "#8b5cf6", fontWeight: 700 }}>
                          {entry.time}
                        </span>
                        {isAdmin && (
                          <button
                            onClick={() => handleEditClick(entry)}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: "#94a3b8",
                              padding: "4px",
                              display: "flex",
                              opacity: 0.6,
                            }}
                          >
                            <Edit2 size={12} />
                          </button>
                        )}
                      </>
                    )}
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
                    <User size={10} /> {entry.userName || "Unknown"}
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
      <CustomDatePicker
        isOpen={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        selectedDate={editDate}
        onSelect={(date) => {
          setEditDate(format(date, "yyyy-MM-dd"));
        }}
      />
    </div>
  );
}

export default History;
