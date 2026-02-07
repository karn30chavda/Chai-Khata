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
  Plus,
} from "lucide-react";
import EntryForm from "./EntryForm";

function GroupManager({
  onSwitch,
  groupId,
  groupSettings,
  onAddEntry,
  onGoToSettings,
}) {
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
        {/* Add New Team Button */}
        <div
          onClick={() => onGoToSettings?.()}
          style={{
            padding: "12px",
            borderRadius: "100px",
            background: "white",
            color: "#6366f1",
            border: "1px dashed #6366f1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
            transition: "all 0.2s",
            boxShadow: "0 4px 6px rgba(0,0,0,0.02)",
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.9)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <Plus size={20} />
        </div>
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
          className="form-card fade-in"
          style={{
            padding: "60px 20px",
            textAlign: "center",
            background: "white",
            borderRadius: "24px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.03)",
            marginBottom: "40px",
            border: "1px solid #f1f5f9",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              background: "#f5f3ff",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 25px",
              color: "#6366f1",
            }}
          >
            <Coffee size={40} />
          </div>
          <h2
            style={{
              fontWeight: 900,
              color: "#1e293b",
              fontSize: "1.5rem",
              marginBottom: "10px",
            }}
          >
            Chai-Khata
          </h2>
          <p
            style={{ color: "#64748b", marginBottom: "30px", fontSize: "1rem" }}
          >
            Your premium office brew companion.
          </p>
          <button
            onClick={() => onGoToSettings?.()}
            style={{
              padding: "16px 32px",
              borderRadius: "16px",
              fontWeight: 800,
              cursor: "pointer",
              fontSize: "1rem",
              background: "white",
              color: "#6366f1",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 6px rgba(0,0,0,0.02)",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              margin: "0 auto",
            }}
          >
            Go to Settings <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* Clean Home State */}
    </div>
  );
}

export default GroupManager;
