import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import {
  LayoutGrid,
  Coffee,
  CheckCircle2,
  TrendingUp,
  Wallet,
  Building2,
  Users,
  PlusSquare,
  ArrowRight,
} from "lucide-react";
import EntryForm from "./EntryForm";

function GroupManager({ onSwitch, groupId, groupSettings, onAddEntry }) {
  const [myTeams, setMyTeams] = useState([]);
  const { currentUser, userData } = useAuth();

  useEffect(() => {
    async function fetchMyTeams() {
      if (!currentUser) return;
      const q = query(
        collection(db, "groups"),
        where("members", "array-contains", currentUser.uid),
      );
      const querySnapshot = await getDocs(q);
      const teams = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMyTeams(teams);
    }
    fetchMyTeams();
  }, [currentUser, userData]);

  return (
    <div
      className="fade-in"
      style={{
        padding: "0 4px",
        maxWidth: "600px",
        margin: "0 auto",
        paddingBottom: "120px",
      }}
    >
      {/* Tab Switcher Style for Teams */}
      <div
        className="section-label"
        style={{ marginBottom: "15px", marginTop: "10px" }}
      >
        <LayoutGrid size={14} color="#6366f1" /> SELECT OFFICE
      </div>
      <div
        style={{
          display: "flex",
          gap: "10px",
          overflowX: "auto",
          marginBottom: "30px",
          padding: "5px 2px 15px",
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {myTeams.map((team) => (
          <div
            key={team.id}
            onClick={() => onSwitch?.(team.id)}
            style={{
              padding: "12px 24px",
              borderRadius: "100px",
              background: groupId === team.id ? "#6366f1" : "white",
              color: groupId === team.id ? "white" : "#64748b",
              fontWeight: 800,
              fontSize: "0.85rem",
              whiteSpace: "nowrap",
              boxShadow:
                groupId === team.id
                  ? "0 10px 20px rgba(99, 102, 241, 0.25)"
                  : "0 4px 6px rgba(0,0,0,0.04)",
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              border: groupId === team.id ? "none" : "1px solid #f1f5f9",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {groupId === team.id && <CheckCircle2 size={16} />}
            {team.name}
          </div>
        ))}
        {myTeams.length === 0 && (
          <div
            style={{ color: "#94a3b8", fontSize: "0.9rem", padding: "10px" }}
          >
            No teams yet.
          </div>
        )}
      </div>

      {/* Primary Action Section */}
      {groupId ? (
        <div style={{ marginBottom: "40px" }}>
          <EntryForm
            items={groupSettings?.items || []}
            timeSlots={groupSettings?.timeSlots || []}
            onAdd={onAddEntry}
          />
        </div>
      ) : (
        <div
          className="form-card"
          style={{
            padding: "40px 20px",
            textAlign: "center",
            background: "#f1f5f9",
            border: "2px dashed #cbd5e1",
            marginBottom: "40px",
          }}
        >
          <Building2
            size={48}
            color="#94a3b8"
            style={{ marginBottom: "15px" }}
          />
          <h3 style={{ fontWeight: 800, color: "#475569" }}>
            No Office Selected
          </h3>
          <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
            Select one of your teams above to start adding entries.
          </p>
        </div>
      )}
    </div>
  );
}

export default GroupManager;
