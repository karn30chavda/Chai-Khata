import React, { useState } from "react";
import {
  Coffee,
  Trash2,
  Plus,
  Zap,
  AlertTriangle,
  ChevronRight,
  Clock,
  Edit2,
  Check,
  X,
  LogOut,
  Copy,
  Shield,
  User,
  Star,
  Save,
  Lock,
  ArrowLeftCircle,
  Building2,
  Users as UsersIcon,
  Loader2,
  ArrowRight,
} from "lucide-react";

function Settings({
  settings,
  setSettings,
  members = [],
  toggleRole,
  updatePerms,
  onUpdateProfile,
  userData,
  isSuperAdmin,
  isAdmin,
  onLeave,
  onLogout,
  onDeleteGroup,
  onCreateGroup,
  onJoinGroup,
  loading,
}) {
  const [groupName, setGroupName] = useState("");
  const [joinId, setJoinId] = useState("");
  const [newItem, setNewItem] = useState({
    name: "",
    priceHalf: "",
    priceFull: "",
  });
  const [showAdd, setShowAdd] = useState(false);
  const [newTimeSlot, setNewTimeSlot] = useState("");
  const [editingItemId, setEditingItemId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    priceHalf: "",
    priceFull: "",
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(userData?.name || "");

  const [editingPermsUid, setEditingPermsUid] = useState(null);
  const [copied, setCopied] = useState(false);

  const copyGroupId = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(settings.id);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = settings.id;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const handleUpdateProfile = () => {
    onUpdateProfile(profileName);
    setIsEditingProfile(false);
  };

  const addItem = () => {
    if (!newItem.name || !newItem.priceFull) return;
    const item = {
      id: Date.now().toString(),
      name: newItem.name,
      priceHalf: parseFloat(newItem.priceHalf) || 0,
      priceFull: parseFloat(newItem.priceFull) || 0,
      isDaily: false,
    };
    setSettings({
      ...settings,
      items: [...settings.items, item],
    });
    setNewItem({ name: "", priceHalf: "", priceFull: "" });
    setShowAdd(false);
  };

  const startEdit = (item) => {
    setEditingItemId(item.id);
    setEditForm({
      name: item.name,
      priceHalf: item.priceHalf,
      priceFull: item.priceFull,
    });
  };

  const saveEdit = () => {
    const updated = settings.items.map((item) =>
      item.id === editingItemId
        ? {
            ...item,
            name: editForm.name,
            priceHalf: parseFloat(editForm.priceHalf) || 0,
            priceFull: parseFloat(editForm.priceFull) || 0,
          }
        : item,
    );
    setSettings({ ...settings, items: updated });
    setEditingItemId(null);
  };

  const addTimeSlot = () => {
    if (!newTimeSlot || settings.timeSlots?.includes(newTimeSlot)) return;
    const currentSlots = settings.timeSlots || [
      "Morning",
      "Afternoon",
      "Evening",
    ];
    setSettings({
      ...settings,
      timeSlots: [...currentSlots, newTimeSlot],
    });
    setNewTimeSlot("");
  };

  const removeTimeSlot = (slot) => {
    setSettings({
      ...settings,
      timeSlots: settings.timeSlots.filter((s) => s !== slot),
    });
  };

  const removeItem = (id) => {
    setSettings({
      ...settings,
      items: settings.items.filter((item) => item.id !== id),
    });
  };

  const handleCreate = () => {
    onCreateGroup(groupName);
    setGroupName("");
  };

  const handleJoin = () => {
    onJoinGroup(joinId);
    setJoinId("");
  };

  const timeSlots = settings.timeSlots || ["Morning", "Afternoon", "Evening"];

  const permOptions = [
    { key: "canDelete", label: "Delete Entries", color: "#ef4444" },
    { key: "canPayments", label: "Manage Payments", color: "#10b981" },
    { key: "canMenu", label: "Edit Menu", color: "#6366f1" },
    { key: "canSlots", label: "Edit Slot Times", color: "#f59e0b" },
  ];

  return (
    <div className="fade-in" style={{ paddingBottom: "120px" }}>
      <div style={{ marginBottom: "25px" }}>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: 800,
            margin: 0,
            color: "#1e293b",
          }}
        >
          Team Settings
        </h2>
        <p
          style={{ color: "#64748b", fontSize: "0.9rem", margin: "4px 0 0 0" }}
        >
          Manage your office group and members.
        </p>
      </div>

      {/* User Profile Card */}
      <div className="section-label" style={{ marginBottom: "15px" }}>
        MY PROFILE
      </div>
      <div
        className="form-card"
        style={{ marginBottom: "30px", padding: "20px" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <div
              style={{
                width: "50px",
                height: "50px",
                background: "#f1f5f9",
                borderRadius: "15px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#6366f1",
              }}
            >
              <User size={28} />
            </div>
            <div>
              {isEditingProfile ? (
                <input
                  className="time-input"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  style={{
                    fontSize: "1rem",
                    fontWeight: 800,
                    padding: "8px 12px",
                    height: "auto",
                    marginBottom: "4px",
                  }}
                  autoFocus
                />
              ) : (
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: "1.1rem",
                    color: "#1e293b",
                  }}
                >
                  {userData?.name}
                </div>
              )}
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "#64748b",
                  fontWeight: 600,
                }}
              >
                {userData?.email}
              </div>
            </div>
          </div>

          <button
            onClick={() =>
              isEditingProfile
                ? handleUpdateProfile()
                : setIsEditingProfile(true)
            }
            style={{
              background: isEditingProfile ? "#6366f1" : "#f8fafc",
              color: isEditingProfile ? "white" : "#64748b",
              border: isEditingProfile ? "none" : "1px solid #e2e8f0",
              padding: "10px",
              borderRadius: "12px",
              cursor: "pointer",
            }}
          >
            {isEditingProfile ? <Save size={18} /> : <Edit2 size={18} />}
          </button>
        </div>
      </div>

      {/* Group Info Card */}
      {settings.id && (
        <>
          <div className="section-label" style={{ marginBottom: "15px" }}>
            GROUP DETAILS
          </div>
          <div
            className="form-card"
            style={{
              marginBottom: "30px",
              background: "var(--primary-gradient)",
              color: "white",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "10px",
                }}
              >
                <Shield size={20} />
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: "0.8rem",
                    textTransform: "uppercase",
                  }}
                >
                  Group Details
                </span>
              </div>
              {!isSuperAdmin && (
                <button
                  onClick={onLeave}
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    border: "none",
                    color: "white",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    fontSize: "0.7rem",
                    fontWeight: 800,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <ArrowLeftCircle size={14} /> LEAVE TEAM
                </button>
              )}
            </div>
            <div style={{ fontWeight: 800, fontSize: "1.2rem" }}>
              {settings.name}
            </div>
            <div
              onClick={copyGroupId}
              style={{
                marginTop: "15px",
                background: copied ? "#10b981" : "rgba(255,255,255,0.15)",
                padding: "12px",
                borderRadius: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                fontSize: "0.8rem",
                fontWeight: 700,
                transition: "all 0.3s ease",
              }}
            >
              <span>
                {copied ? "COPIED TO CLIPBOARD!" : `TEAM ID: ${settings.id}`}
              </span>
              <Copy size={16} />
            </div>
          </div>
          {isSuperAdmin && (
            <div
              style={{
                marginTop: "12px",
                display: "flex",
                justifyContent: "center",
                marginBottom: "25px",
              }}
            >
              <button
                onClick={onDeleteGroup}
                style={{
                  background: "#fef2f2",
                  border: "2px dashed #fee2e2",
                  color: "#ef4444",
                  fontWeight: 800,
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "14px 30px",
                  borderRadius: "12px",
                  width: "60%",
                  justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(239, 68, 68, 0.1)",
                }}
              >
                <AlertTriangle size={16} /> DELETE GROUP DATA
              </button>
            </div>
          )}
        </>
      )}

      {/* Team Members Section */}
      {settings.id && (
        <>
          <div className="section-label" style={{ marginBottom: "15px" }}>
            TEAM MEMBERS & PERMISSIONS
          </div>
          <div
            className="form-card"
            style={{ padding: "0", overflow: "hidden", marginBottom: "30px" }}
          >
            {members.map((member, index) => (
              <div
                key={member.id || index}
                style={{
                  borderBottom:
                    index === members.length - 1 ? "none" : "1px solid #f1f5f9",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px 20px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "15px",
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "10px",
                        background:
                          member.id === settings.adminUid
                            ? "#fef3c7"
                            : "#f1f5f9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color:
                          member.id === settings.adminUid
                            ? "#d97706"
                            : "#64748b",
                      }}
                    >
                      {member.id === settings.adminUid ? (
                        <Shield size={20} fill="#d97706" />
                      ) : member.role === "admin" ? (
                        <Star size={20} fill="currentColor" />
                      ) : (
                        <User size={20} />
                      )}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: "#1e293b" }}>
                        {member.name} {member.id === userData.id && "(You)"}
                      </div>
                      <div
                        style={{
                          fontSize: "0.7rem",
                          color: "#64748b",
                          fontWeight: 600,
                          textTransform: "uppercase",
                        }}
                      >
                        {member.id === settings.adminUid
                          ? "SUPREME ADMIN"
                          : member.role}
                      </div>
                    </div>
                  </div>

                  {isSuperAdmin && member.id !== settings.adminUid && (
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() =>
                          setEditingPermsUid(
                            editingPermsUid === member.id ? null : member.id,
                          )
                        }
                        style={{
                          background:
                            editingPermsUid === member.id
                              ? "#6366f1"
                              : "#f1f5f9",
                          color:
                            editingPermsUid === member.id ? "white" : "#64748b",
                          border: "none",
                          padding: "8px",
                          borderRadius: "10px",
                          cursor: "pointer",
                        }}
                      >
                        <Lock size={18} />
                      </button>
                      <button
                        onClick={() => toggleRole(member.id, member.role)}
                        style={{
                          background: "none",
                          border: "1px solid #e2e8f0",
                          color: "#6366f1",
                          padding: "6px 12px",
                          borderRadius: "8px",
                          fontSize: "0.7rem",
                          fontWeight: 800,
                          cursor: "pointer",
                        }}
                      >
                        {member.role === "admin" ? "MAKE USER" : "MAKE ADMIN"}
                      </button>
                    </div>
                  )}
                </div>

                {isSuperAdmin && editingPermsUid === member.id && (
                  <div
                    style={{
                      padding: "0 20px 20px",
                      background: "#f8fafc",
                      marginTop: "-5px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 800,
                        color: "#64748b",
                        marginBottom: "10px",
                        textTransform: "uppercase",
                      }}
                    >
                      Allowed Actions:
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "10px",
                      }}
                    >
                      {permOptions.map((opt) => (
                        <div
                          key={opt.key}
                          onClick={() =>
                            updatePerms(
                              member.id,
                              opt.key,
                              !member.permissions?.[opt.key],
                            )
                          }
                          style={{
                            padding: "10px",
                            background: "white",
                            borderRadius: "10px",
                            border: `2px solid ${member.permissions?.[opt.key] ? opt.color : "#e2e8f0"}`,
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            cursor: "pointer",
                            transition: "0.2s",
                          }}
                        >
                          <div
                            style={{
                              width: "16px",
                              height: "16px",
                              borderRadius: "4px",
                              background: member.permissions?.[opt.key]
                                ? opt.color
                                : "#e2e8f0",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {member.permissions?.[opt.key] && (
                              <Check size={14} color="white" />
                            )}
                          </div>
                          <span
                            style={{
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              color: member.permissions?.[opt.key]
                                ? "#1e293b"
                                : "#64748b",
                            }}
                          >
                            {opt.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {!isAdmin && (
        <div
          style={{
            background: "#f5f3ff",
            border: "1px solid #e0e7ff",
            padding: "20px",
            borderRadius: "15px",
            marginBottom: "30px",
            textAlign: "center",
          }}
        >
          <p style={{ color: "#6366f1", fontWeight: 700, margin: 0 }}>
            You have standard access. Some features may be restricted by your
            admin.
          </p>
        </div>
      )}

      {/* Item Management Section */}
      {(isSuperAdmin || userData?.permissions?.canMenu) && (
        <>
          <div className="section-label" style={{ marginBottom: "15px" }}>
            REFRESHMENTS
          </div>
          <div
            className="form-card"
            style={{ padding: "0", overflow: "hidden", marginBottom: "30px" }}
          >
            {settings.items.map((item, index) => (
              <div key={item.id}>
                {editingItemId === item.id ? (
                  <div style={{ padding: "20px", background: "#f8fafc" }}>
                    <div className="field-group">
                      <input
                        className="time-input"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                        placeholder="Item Name"
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        marginBottom: "15px",
                      }}
                    >
                      <input
                        className="time-input"
                        type="number"
                        value={editForm.priceFull}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            priceFull: e.target.value,
                          })
                        }
                        placeholder="Full"
                      />
                      <input
                        className="time-input"
                        type="number"
                        value={editForm.priceHalf}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            priceHalf: e.target.value,
                          })
                        }
                        placeholder="Half"
                      />
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        className="submit-btn"
                        onClick={saveEdit}
                        style={{ flex: 1 }}
                      >
                        SAVE
                      </button>
                      <button
                        className="submit-btn"
                        onClick={() => setEditingItemId(null)}
                        style={{
                          flex: 1,
                          background: "#f1f5f9",
                          color: "#64748b",
                        }}
                      >
                        CANCEL
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "18px 20px",
                      borderBottom:
                        index === settings.items.length - 1 && !showAdd
                          ? "none"
                          : "1px solid #f1f5f9",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                      }}
                    >
                      <div
                        style={{
                          padding: "10px",
                          background: "#f8fafc",
                          borderRadius: "10px",
                          color: "#6366f1",
                        }}
                      >
                        <Coffee size={20} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: "#1e293b" }}>
                          {item.name}
                        </div>
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "#64748b",
                            fontWeight: 600,
                          }}
                        >
                          ₹{item.priceFull} / ₹{item.priceHalf}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "4px" }}>
                      <button
                        onClick={() => startEdit(item)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#64748b",
                          padding: "8px",
                        }}
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#ef4444",
                          padding: "8px",
                        }}
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div
              onClick={() => setShowAdd(!showAdd)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px",
                background: "#f5f3ff",
                cursor: "pointer",
                borderTop: "1px solid #e0e7ff",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  color: "#6366f1",
                  fontWeight: 800,
                  fontSize: "0.9rem",
                }}
              >
                <Plus size={20} /> ADD NEW ITEM
              </div>
              <ChevronRight size={18} color="#6366f1" />
            </div>
          </div>
        </>
      )}

      {(isSuperAdmin || userData?.permissions?.canMenu) && showAdd && (
        <div
          className="form-card fade-in"
          style={{ marginBottom: "30px", border: "2px solid #6366f1" }}
        >
          <div className="field-group">
            <label className="form-label">Name</label>
            <input
              className="time-input"
              placeholder="e.g. Green Tea"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />
          </div>
          <div style={{ display: "flex", gap: "15px" }}>
            <div className="field-group" style={{ flex: 1 }}>
              <label className="form-label">Full (₹)</label>
              <input
                className="time-input"
                type="number"
                value={newItem.priceFull}
                onChange={(e) =>
                  setNewItem({ ...newItem, priceFull: e.target.value })
                }
              />
            </div>
            <div className="field-group" style={{ flex: 1 }}>
              <label className="form-label">Half (₹)</label>
              <input
                className="time-input"
                type="number"
                value={newItem.priceHalf}
                onChange={(e) =>
                  setNewItem({ ...newItem, priceHalf: e.target.value })
                }
              />
            </div>
          </div>
          <button className="submit-btn" onClick={addItem}>
            SAVE ITEM
          </button>
        </div>
      )}

      {(isSuperAdmin || userData?.permissions?.canSlots) && (
        <>
          <div className="section-label" style={{ marginBottom: "15px" }}>
            TIME SLOTS
          </div>
          <div
            className="form-card"
            style={{ padding: "0", overflow: "hidden", marginBottom: "30px" }}
          >
            {timeSlots.map((slot, index) => (
              <div
                key={slot}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 20px",
                  borderBottom:
                    index === timeSlots.length - 1
                      ? "none"
                      : "1px solid #f1f5f9",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                    fontWeight: 600,
                    color: "#1e293b",
                  }}
                >
                  <Clock size={18} color="#64748b" /> {slot}
                </div>
                <button
                  onClick={() => removeTimeSlot(slot)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#ef4444",
                    padding: "8px",
                  }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            <div
              style={{
                padding: "15px 20px",
                background: "#f8fafc",
                borderTop: "1px solid #f1f5f9",
              }}
            >
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  className="time-input"
                  placeholder="e.g. Brunch"
                  value={newTimeSlot}
                  onChange={(e) => setNewTimeSlot(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button
                  onClick={addTimeSlot}
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "10px",
                    background: "#6366f1",
                    color: "white",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Onboarding in Settings - Always available to allow joining multiple teams */}
      <div
        id="onboarding-section"
        className="section-label"
        style={{ marginBottom: "15px" }}
      >
        TEAM ONBOARDING
      </div>

      <div
        className="form-card"
        style={{
          boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
          border: "1px solid #e2e8f0",
          marginBottom: "25px",
          padding: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "25px",
            color: "#6366f1",
          }}
        >
          <div
            style={{
              padding: "10px",
              background: "#f5f3ff",
              borderRadius: "12px",
            }}
          >
            <Building2 size={24} />
          </div>
          <span style={{ fontWeight: 800, fontSize: "1.1rem" }}>
            Create New Office
          </span>
        </div>
        <div className="field-group">
          <label className="form-label">Office / Group Name</label>
          <input
            className="time-input"
            placeholder="e.g. Creative Agency"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            disabled={loading}
            style={{ background: "#f8fafc" }}
          />
        </div>
        <button
          className="submit-btn"
          onClick={handleCreate}
          disabled={loading}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            height: "54px",
          }}
        >
          {loading ? (
            <Loader2 className="spin" size={22} />
          ) : (
            <>
              <Plus size={22} /> CREATE GROUP
            </>
          )}
        </button>
      </div>

      <div
        className="form-card"
        style={{
          boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
          border: "1px solid #e2e8f0",
          marginBottom: "40px",
          padding: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "25px",
            color: "#10b981",
          }}
        >
          <div
            style={{
              padding: "10px",
              background: "#ecfdf5",
              borderRadius: "12px",
            }}
          >
            <UsersIcon size={24} />
          </div>
          <span style={{ fontWeight: 800, fontSize: "1.1rem" }}>
            Join Existing Team
          </span>
        </div>
        <div className="field-group">
          <label className="form-label">Enter Group ID</label>
          <input
            className="time-input"
            placeholder="e.g. CK-A1B2C3"
            value={joinId}
            onChange={(e) => setJoinId(e.target.value.toUpperCase())}
            disabled={loading}
            style={{ background: "#f8fafc" }}
          />
        </div>
        <button
          className="submit-btn"
          onClick={handleJoin}
          disabled={loading}
          style={{
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            boxShadow: "0 10px 25px rgba(16, 185, 129, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            height: "54px",
          }}
        >
          {loading ? (
            <Loader2 className="spin" size={22} />
          ) : (
            <>
              <ArrowRight size={22} /> JOIN GROUP
            </>
          )}
        </button>
      </div>

      <div className="section-label" style={{ color: "#ef4444" }}>
        ACCOUNT ACTIONS
      </div>
      <button
        onClick={onLogout}
        style={{
          width: "100%",
          padding: "18px",
          borderRadius: "18px",
          background: "#fef2f2",
          border: "2px dashed #fee2e2",
          color: "#ef4444",
          fontWeight: 800,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <LogOut size={22} /> SIGN OUT ACCOUNT
      </button>
    </div>
  );
}

export default Settings;
