import React, { useState, useMemo, useEffect } from "react";
import {
  Coffee,
  PlusSquare,
  History as HistoryIcon,
  BarChart3,
  Settings as SettingsIcon,
  LogOut,
  ShieldCheck,
  LayoutGrid,
  CheckCircle2,
} from "lucide-react";
import { startOfMonth, endOfMonth, isWithinInterval, parseISO } from "date-fns";
import { db } from "./firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
  writeBatch,
  getDocs,
  arrayRemove,
  setDoc,
  arrayUnion,
} from "firebase/firestore";
import { useAuth } from "./context/AuthContext";
import EntryForm from "./components/EntryForm";
import History from "./components/History";
import MonthlyReport from "./components/MonthlyReport";
import Settings from "./components/Settings";
import Auth from "./components/Auth";
import GroupManager from "./components/GroupManager";
import ConfirmModal from "./components/ConfirmModal";

function App() {
  const { currentUser, userData, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("groups");
  const [entries, setEntries] = useState([]);
  const [payments, setPayments] = useState([]);
  const [members, setMembers] = useState([]);
  const [groupSettings, setGroupSettings] = useState({
    items: [],
    timeSlots: [],
    adminUid: "",
  });
  const [loading, setLoading] = useState(true);

  const groupId = userData?.groupId;
  const isSuperAdmin =
    currentUser?.uid &&
    groupSettings?.adminUid &&
    currentUser.uid === groupSettings.adminUid;

  const permissions = userData?.permissions || {};
  const hasPerm = (p) => permissions[p] === true || isSuperAdmin;

  // Use activeTab directly for rendering
  const displayTab = activeTab;

  // Fix: Stop loading if user is logged in but has no office yet
  useEffect(() => {
    if (currentUser && !groupId) {
      setLoading(false);
    }
  }, [currentUser, groupId]);

  // Sync loading state when group changes
  const [prevGroupId, setPrevGroupId] = useState(groupId);
  if (groupId !== prevGroupId) {
    setPrevGroupId(groupId);
    if (groupId) {
      setLoading(true);
      // Reset settings immediately to prevent permission leakage from prev group
      setGroupSettings({
        items: [],
        timeSlots: [],
        adminUid: "",
      });
    } else {
      // Clear all state when group is removed
      setEntries([]);
      setPayments([]);
      setMembers([]);
      setGroupSettings({
        items: [],
        timeSlots: [],
        adminUid: "",
      });
      setLoading(false);
    }
  }

  // Confirm Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    type: "danger",
  });

  useEffect(() => {
    if (!currentUser || !groupId) return;

    const unsubEntries = onSnapshot(
      query(collection(db, "entries"), where("groupId", "==", groupId)),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setEntries(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
        setLoading(false);
      },
    );

    const unsubPayments = onSnapshot(
      query(collection(db, "payments"), where("groupId", "==", groupId)),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setPayments(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
      },
    );

    const unsubSettings = onSnapshot(doc(db, "groups", groupId), (doc) => {
      if (doc.exists()) setGroupSettings({ ...doc.data(), id: doc.id });
    });

    const unsubMembers = onSnapshot(
      query(collection(db, "users"), where("groupId", "==", groupId)),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setMembers(data);
      },
    );

    return () => {
      unsubEntries();
      unsubPayments();
      unsubSettings();
      unsubMembers();
    };
  }, [groupId, currentUser]);

  const showConfirm = (config) => {
    setConfirmModal({
      ...config,
      isOpen: true,
      onConfirm: () => {
        config.onConfirm();
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const addEntry = async (entry) => {
    if (!groupId) return;
    await addDoc(collection(db, "entries"), {
      ...entry,
      groupId,
      userUid: currentUser.uid,
      userName: userData.name,
      date: new Date().toISOString(),
    });
    setActiveTab("history");
  };

  const deleteEntry = async (id) => {
    if (!hasPerm("canDelete")) return alert("No permission");
    showConfirm({
      title: "Delete Entry",
      message:
        "Are you sure you want to remove this refreshment entry? this cannot be undone.",
      onConfirm: async () => {
        await deleteDoc(doc(db, "entries", id));
      },
    });
  };

  const recordPayment = async (amount) => {
    if (!hasPerm("canPayments")) return alert("No permission");
    await addDoc(collection(db, "payments"), {
      amount: parseFloat(amount),
      groupId,
      recordedBy: userData.name,
      date: new Date().toISOString(),
    });
  };

  const updateSettings = async (newSettings) => {
    if (!hasPerm("canMenu") && !hasPerm("canSlots"))
      return alert("No permission");
    await updateDoc(doc(db, "groups", groupId), {
      items: newSettings.items,
      timeSlots: newSettings.timeSlots,
    });
  };

  const deleteGroup = async () => {
    if (!isSuperAdmin) return;
    showConfirm({
      title: "Delete Group Entirely",
      message:
        "CRITICAL: This will delete ALL entries, payments, and the group itself. This is irreversible.",
      onConfirm: async () => {
        setLoading(true);
        const batch = writeBatch(db);

        // 1. Delete Entries
        const qEntries = await getDocs(
          query(collection(db, "entries"), where("groupId", "==", groupId)),
        );
        qEntries.forEach((d) => batch.delete(d.ref));

        // 2. Delete Payments
        const qPayments = await getDocs(
          query(collection(db, "payments"), where("groupId", "==", groupId)),
        );
        qPayments.forEach((d) => batch.delete(d.ref));

        const qUsers = await getDocs(
          query(
            collection(db, "users"),
            where("groups", "array-contains", groupId),
          ),
        );
        qUsers.forEach((u) => {
          const uData = u.data();
          const remainingGroups = (uData.groups || []).filter(
            (g) => g !== groupId,
          );
          const nextId = remainingGroups.length > 0 ? remainingGroups[0] : null;
          batch.update(u.ref, {
            groupId: nextId,
            groups: arrayRemove(groupId),
          });
        });

        // 4. Delete Group doc
        batch.delete(doc(db, "groups", groupId));

        await batch.commit();
        setActiveTab("groups");
      },
    });
  };

  const updateUserPerms = async (uid, permKey, value) => {
    if (!isSuperAdmin) return;
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);
    const currentPerms = userDoc.data()?.permissions || {};
    await updateDoc(userRef, {
      permissions: { ...currentPerms, [permKey]: value },
    });
  };

  const toggleUserRole = async (uid, currentRole) => {
    if (!isSuperAdmin) return;
    await updateDoc(doc(db, "users", uid), {
      role: currentRole === "admin" ? "user" : "admin",
    });
  };

  const leaveGroup = async () => {
    if (isSuperAdmin) return alert("Super admin cannot leave.");
    showConfirm({
      title: "Leave Team",
      message:
        "Are you sure you want to leave this office group? You will lose access to the history.",
      onConfirm: async () => {
        const userRef = doc(db, "users", currentUser.uid);
        const groupRef = doc(db, "groups", groupId);

        const remainingGroups = (userData?.groups || []).filter(
          (g) => g !== groupId,
        );
        const nextGroupId =
          remainingGroups.length > 0 ? remainingGroups[0] : null;

        await updateDoc(userRef, {
          groupId: nextGroupId,
          groups: arrayRemove(groupId),
        });
        await updateDoc(groupRef, { members: arrayRemove(currentUser.uid) });
        setActiveTab("groups");
      },
    });
  };

  const handleLogout = () => {
    showConfirm({
      title: "Logout",
      message: "Are you sure you want to sign out from your account?",
      confirmText: "Logout",
      type: "warning",
      onConfirm: logout,
    });
  };

  const generateId = () => {
    return "CK-" + Math.random().toString(36).substr(2, 6).toUpperCase();
  };

  const handleCreateGroup = async (groupName) => {
    if (!groupName.trim()) return alert("Please enter name");
    setLoading(true);
    const newGroupId = generateId();
    try {
      await setDoc(doc(db, "groups", newGroupId), {
        id: newGroupId,
        name: groupName.trim(),
        adminUid: currentUser.uid,
        members: [currentUser.uid],
        items: [
          {
            id: "1",
            name: "Chai",
            priceHalf: 10,
            priceFull: 15,
            isDaily: true,
          },
          {
            id: "2",
            name: "Coffee",
            priceHalf: 15,
            priceFull: 25,
            isDaily: true,
          },
        ],
        timeSlots: ["Morning", "Afternoon", "Evening"],
      });
      await setDoc(
        doc(db, "users", currentUser.uid),
        { groupId: newGroupId, groups: arrayUnion(newGroupId), role: "admin" },
        { merge: true },
      );
      setActiveTab("groups");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async (joinId) => {
    const cleanId = joinId.trim();
    if (!cleanId) return alert("Enter ID");
    setLoading(true);
    try {
      const groupRef = doc(db, "groups", cleanId);
      const groupSnap = await getDoc(groupRef);
      if (!groupSnap.exists()) throw new Error("Group not found");
      await updateDoc(groupRef, { members: arrayUnion(currentUser.uid) });
      await setDoc(
        doc(db, "users", currentUser.uid),
        { groupId: cleanId, groups: arrayUnion(cleanId), role: "user" },
        { merge: true },
      );
      setActiveTab("groups");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const totals = useMemo(() => {
    const totalSpent = entries.reduce(
      (acc, curr) => acc + curr.price * curr.quantity,
      0,
    );
    const totalPaid = payments.reduce((acc, curr) => acc + curr.amount, 0);
    const now = new Date();
    const monthlyTotal = entries
      .filter((e) =>
        isWithinInterval(parseISO(e.date), {
          start: startOfMonth(now),
          end: endOfMonth(now),
        }),
      )
      .reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
    return {
      totalSpent,
      totalPaid,
      balance: Math.max(0, totalSpent - totalPaid),
      monthlyTotal,
    };
  }, [entries, payments]);

  const updateUserProfile = async (newName) => {
    if (!newName.trim()) return;
    await updateDoc(doc(db, "users", currentUser.uid), {
      name: newName.trim(),
    });
  };

  const handleSwitchTeam = async (id) => {
    setLoading(true);
    await updateDoc(doc(db, "users", currentUser.uid), { groupId: id });
    setLoading(false);
  };

  if (!currentUser) return <Auth />;
  if (loading && groupId)
    return (
      <div
        style={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8fafc",
          color: "#6366f1",
          fontWeight: 800,
        }}
      >
        Loading Team Data...
      </div>
    );

  return (
    <div className="app-container">
      {groupId && (
        <header className="header-card">
          <div className="header-left">
            <div className="header-title">
              <h1 style={{ fontSize: "1.2rem" }}>{groupSettings.name}</h1>
              <p style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                {userData.name}{" "}
                {(userData?.role === "admin" || isSuperAdmin) && (
                  <ShieldCheck size={12} color="#6366f1" />
                )}
              </p>
            </div>
          </div>
          <div className="header-right">
            <span>BALANCE DUE</span>
            <div
              className="amount"
              style={{ color: totals.balance > 0 ? "#ef4444" : "#10b981" }}
            >
              ₹{totals.balance}
            </div>
          </div>
        </header>
      )}

      <main style={{ marginTop: groupId ? "0" : "20px" }}>
        {displayTab === "groups" && (
          <GroupManager
            onLogout={handleLogout}
            onSwitch={handleSwitchTeam}
            groupId={groupId}
            groupSettings={groupSettings}
            onAddEntry={addEntry}
            totals={totals}
            onGoToSettings={() => {
              setActiveTab("settings");
              setTimeout(() => {
                document
                  .getElementById("onboarding-section")
                  ?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
          />
        )}

        {displayTab === "settings" && (
          <Settings
            settings={groupSettings}
            setSettings={updateSettings}
            members={members}
            toggleRole={toggleUserRole}
            updatePerms={updateUserPerms}
            onUpdateProfile={updateUserProfile}
            userData={userData}
            isSuperAdmin={isSuperAdmin}
            isAdmin={userData?.role === "admin"}
            onLeave={leaveGroup}
            onLogout={handleLogout}
            onDeleteGroup={deleteGroup}
            onCreateGroup={handleCreateGroup}
            onJoinGroup={handleJoinGroup}
            loading={loading}
          />
        )}

        {/* Tabs that require an office */}
        {(displayTab === "history" || displayTab === "report") && !groupId && (
          <div
            className="form-card fade-in"
            style={{
              padding: "60px 20px",
              textAlign: "center",
              background: "white",
              borderRadius: "24px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.03)",
              marginTop: "20px",
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
              style={{
                color: "#64748b",
                marginBottom: "30px",
                fontSize: "1rem",
              }}
            >
              Connect with your team to start tracking{" "}
              {displayTab === "history" ? "logs" : "reports"}.
            </p>

            <button
              onClick={() => setActiveTab("settings")}
              style={{
                background: "var(--primary-gradient)",
                color: "white",
                border: "none",
                padding: "16px 32px",
                borderRadius: "16px",
                fontWeight: 800,
                cursor: "pointer",
                fontSize: "1rem",
                boxShadow: "0 10px 25px rgba(99, 102, 241, 0.3)",
                transition: "transform 0.2s",
              }}
              onMouseDown={(e) =>
                (e.currentTarget.style.transform = "scale(0.95)")
              }
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              Get Started
            </button>
          </div>
        )}

        {groupId && (
          <>
            {displayTab === "history" && (
              <History
                entries={entries}
                onDelete={deleteEntry}
                isAdmin={hasPerm("canDelete")}
              />
            )}
            {displayTab === "report" && (
              <MonthlyReport
                entries={entries}
                payments={payments}
                onRecordPayment={recordPayment}
                isAdmin={hasPerm("canPayments")}
              />
            )}
          </>
        )}
      </main>

      <nav className="bottom-nav">
        <div
          className={`nav-item ${activeTab === "groups" ? "active" : ""}`}
          onClick={() => setActiveTab("groups")}
        >
          <div className="nav-icon-bg">
            <LayoutGrid size={24} />
          </div>
          <span>HOME</span>
        </div>
        <div
          className={`nav-item ${activeTab === "history" ? "active" : ""}`}
          onClick={() => setActiveTab("history")}
        >
          <div className="nav-icon-bg">
            <HistoryIcon size={24} />
          </div>
          <span>HISTORY</span>
        </div>
        <div
          className={`nav-item ${activeTab === "report" ? "active" : ""}`}
          onClick={() => setActiveTab("report")}
        >
          <div className="nav-icon-bg">
            <BarChart3 size={24} />
          </div>
          <span>REPORT</span>
        </div>
        <div
          className={`nav-item ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          <div className="nav-icon-bg">
            <SettingsIcon size={24} />
          </div>
          <span>SETTINGS</span>
        </div>
      </nav>

      <ConfirmModal
        {...confirmModal}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}

export default App;
