import React, { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isWithinInterval,
  parseISO,
} from "date-fns";
import {
  Download,
  TrendingUp,
  PieChart,
  CheckCircle2,
  IndianRupee,
  Calendar,
  Zap,
  Star,
  Activity,
} from "lucide-react";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "white",
          padding: "10px 15px",
          border: "none",
          borderRadius: "12px",
          boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
          borderLeft: "4px solid #6366f1",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "0.7rem",
            fontWeight: 800,
            color: "#64748b",
          }}
        >
          DATE: {label} {format(new Date(), "MMM")}
        </p>
        <p
          style={{
            margin: 0,
            fontSize: "1.1rem",
            fontWeight: 800,
            color: "#1e293b",
          }}
        >
          ₹{payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

function MonthlyReport({ entries, payments = [], onRecordPayment, isAdmin }) {
  const [paymentAmount, setPaymentAmount] = useState("");
  const [showPayModal, setShowPayModal] = useState(false);

  const chartData = useMemo(() => {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);
    const daysInMonth = eachDayOfInterval({ start, end });
    return daysInMonth.map((day) => {
      const dailyTotal = entries
        .filter((e) => isSameDay(parseISO(e.date), day))
        .reduce((sum, e) => sum + e.price * e.quantity, 0);
      return { name: format(day, "dd"), total: dailyTotal };
    });
  }, [entries]);

  const stats = useMemo(() => {
    const totalSpent = entries.reduce(
      (acc, curr) => acc + curr.price * curr.quantity,
      0,
    );
    const totalPaid = payments.reduce((acc, curr) => acc + curr.amount, 0);
    const activeDays = chartData.filter((d) => d.total > 0).length;

    // Calculate Average (only for days with entries)
    const avgSpend = activeDays > 0 ? Math.round(totalSpent / activeDays) : 0;

    // Find Top Item
    const itemTotals = {};
    entries.forEach((e) => {
      itemTotals[e.itemName] =
        (itemTotals[e.itemName] || 0) + e.price * e.quantity;
    });
    const topItemEntry = Object.entries(itemTotals).sort(
      (a, b) => b[1] - a[1],
    )[0];
    const topItem = topItemEntry ? topItemEntry[0] : "None";

    return {
      totalSpent,
      totalPaid,
      balance: Math.max(0, totalSpent - totalPaid),
      activeDays,
      avgSpend,
      topItem,
    };
  }, [entries, payments, chartData]);

  const itemDistribution = useMemo(() => {
    const dist = {};
    entries.forEach((e) => {
      dist[e.itemName] = (dist[e.itemName] || 0) + e.price * e.quantity;
    });
    return Object.entries(dist)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [entries]);

  const handlePay = () => {
    if (!paymentAmount || isNaN(paymentAmount)) return;
    onRecordPayment(paymentAmount);
    setPaymentAmount("");
    setShowPayModal(false);
  };

  return (
    <div className="fade-in">
      <style>
        {`
          @media print {
            .no-print { display: none !important; }
            .print-only { display: block !important; }
            body { background: white !important; }
            .app-container { padding: 0 !important; }
            .form-card { border: none !important; box-shadow: none !important; padding: 0 !important; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background: #f8fafc !important; color: #1e293b !important; -webkit-print-color-adjust: exact; }
            td, th { border: 1px solid #e2e8f0; padding: 12px; text-align: left; }
          }
          /* Fix for black border when clicking chart */
          .recharts-wrapper, .recharts-surface, .recharts-wrapper *, .recharts-surface * {
            outline: none !important;
            box-shadow: none !important;
            -webkit-tap-highlight-color: transparent;
          }
        `}
      </style>

      <div
        className="no-print"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
        }}
      >
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, margin: 0 }}>
          Analytics
        </h2>
        <button
          className="nav-icon-bg"
          style={{
            border: "none",
            background: "#f5f3ff",
            color: "#6366f1",
            cursor: "pointer",
          }}
          onClick={() => window.print()}
        >
          <Download size={20} />
        </button>
      </div>

      {/* Balance Card */}
      <div
        className="form-card no-print"
        style={{
          background:
            stats.balance > 0
              ? "linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)"
              : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          color: "white",
          marginBottom: "25px",
          padding: "24px",
          boxShadow: "0 10px 25px rgba(244, 63, 94, 0.2)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "0.8rem",
                fontWeight: 700,
                opacity: 0.9,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {stats.balance > 0 ? "Pending Balance" : "All Settled"}
            </div>
            <div
              style={{ fontSize: "2.5rem", fontWeight: 800, margin: "4px 0" }}
            >
              ₹{stats.balance}
            </div>
          </div>
          {isAdmin && (
            <button
              style={{
                background: "white",
                color: stats.balance > 0 ? "#e11d48" : "#059669",
                border: "none",
                padding: "10px 16px",
                borderRadius: "12px",
                fontWeight: 800,
                fontSize: "0.8rem",
                cursor: "pointer",
              }}
              onClick={() => {
                setPaymentAmount(stats.balance.toString());
                setShowPayModal(true);
              }}
            >
              RECORD PAYMENT
            </button>
          )}
        </div>
        <div
          style={{
            marginTop: "15px",
            paddingTop: "15px",
            borderTop: "1px solid rgba(255,255,255,0.2)",
            display: "flex",
            gap: "20px",
          }}
        >
          <div>
            <div style={{ fontSize: "0.65rem", fontWeight: 700, opacity: 0.8 }}>
              TOTAL SPENT
            </div>
            <div style={{ fontWeight: 800 }}>₹{stats.totalSpent}</div>
          </div>
          <div>
            <div style={{ fontSize: "0.65rem", fontWeight: 700, opacity: 0.8 }}>
              TOTAL PAID
            </div>
            <div style={{ fontWeight: 800 }}>₹{stats.totalPaid}</div>
          </div>
        </div>
      </div>

      {isAdmin && showPayModal && (
        <div
          className="form-card fade-in no-print"
          style={{ marginBottom: "25px", border: "2px solid #6366f1" }}
        >
          <div className="section-label">RECORD NEW PAYMENT</div>
          <div className="field-group">
            <label className="form-label">Amount Paid</label>
            <div style={{ position: "relative" }}>
              <input
                className="time-input"
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                style={{
                  background: "white",
                  border: "2px solid #f1f5f9",
                  paddingLeft: "40px",
                }}
              />
              <IndianRupee
                size={18}
                style={{
                  position: "absolute",
                  left: "15px",
                  top: "18px",
                  color: "#6366f1",
                }}
              />
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              className="submit-btn"
              onClick={handlePay}
              style={{ flex: 1 }}
            >
              CONFIRM PAYMENT
            </button>
            <button
              className="submit-btn"
              onClick={() => setShowPayModal(false)}
              style={{
                flex: 1,
                background: "#f1f5f9",
                color: "#64748b",
                boxShadow: "none",
              }}
            >
              CANCEL
            </button>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div
        className="no-print"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "15px",
          marginBottom: "25px",
        }}
      >
        <div
          className="form-card"
          style={{ padding: "15px", borderBottom: "4px solid #f59e0b" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#64748b",
              fontSize: "0.7rem",
              fontWeight: 800,
              marginBottom: "8px",
            }}
          >
            <Activity size={14} color="#f59e0b" /> AVG DAILY
          </div>
          <div
            style={{ fontSize: "1.2rem", fontWeight: 800, color: "#1e293b" }}
          >
            ₹{stats.avgSpend}
          </div>
        </div>
        <div
          className="form-card"
          style={{ padding: "15px", borderBottom: "4px solid #8b5cf6" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#64748b",
              fontSize: "0.7rem",
              fontWeight: 800,
              marginBottom: "8px",
            }}
          >
            <Star size={14} color="#8b5cf6" /> TOP ITEM
          </div>
          <div
            style={{
              fontSize: "1.2rem",
              fontWeight: 800,
              color: "#1e293b",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {stats.topItem}
          </div>
        </div>
      </div>

      {/* Charts & Breakdown */}
      <div
        className="form-card no-print"
        style={{ marginBottom: "25px", overflow: "hidden" }}
      >
        <div className="section-label" style={{ marginBottom: "20px" }}>
          <TrendingUp size={14} color="#6366f1" /> SPENDING TREND
        </div>
        <div style={{ height: "200px", width: "100%", minWidth: 0 }}>
          <ResponsiveContainer width="100%" height="100%" aspect={2}>
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="name"
                hide={false}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }}
                interval={4}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#6366f1"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorTotal)"
                activeDot={{ r: 6, strokeWidth: 0, fill: "#6366f1" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="form-card no-print">
        <div className="section-label" style={{ marginBottom: "20px" }}>
          <PieChart size={14} color="#6366f1" /> ITEM BREAKDOWN
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {itemDistribution.length > 0 ? (
            itemDistribution.map((item, i) => (
              <div key={i}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <span
                    style={{
                      fontWeight: 700,
                      color: "#1e293b",
                      fontSize: "0.9rem",
                    }}
                  >
                    {item.name}
                  </span>
                  <span style={{ fontWeight: 800, color: "#6366f1" }}>
                    ₹{item.value}
                  </span>
                </div>
                <div
                  style={{
                    height: "6px",
                    background: "#f1f5f9",
                    borderRadius: "10px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${(item.value / stats.totalSpent) * 100}%`,
                      background: "var(--primary-gradient)",
                      borderRadius: "10px",
                    }}
                  ></div>
                </div>
              </div>
            ))
          ) : (
            <p
              style={{
                color: "#64748b",
                textAlign: "center",
                fontSize: "0.9rem",
              }}
            >
              No data available for breakdown.
            </p>
          )}
        </div>
      </div>

      <div className="form-card no-print" style={{ marginTop: "25px" }}>
        <div className="section-label" style={{ marginBottom: "20px" }}>
          <CheckCircle2 size={14} color="#10b981" /> PAYMENT HISTORY
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {payments.length > 0 ? (
            payments.map((p) => (
              <div
                key={p.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 15px",
                  background: "#f8fafc",
                  borderRadius: "12px",
                  borderLeft: "4px solid #10b981",
                }}
              >
                <div>
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: "0.9rem",
                      color: "#1e293b",
                    }}
                  >
                    ₹{p.amount} Paid
                  </div>
                  <div
                    style={{
                      fontSize: "0.7rem",
                      color: "#64748b",
                      fontWeight: 600,
                    }}
                  >
                    {format(parseISO(p.date), "MMM dd, yyyy • hh:mm a")}
                  </div>
                </div>
                <div
                  style={{
                    textAlign: "right",
                    fontSize: "0.6rem",
                    color: "#94a3b8",
                    fontWeight: 700,
                  }}
                >
                  BY: {p.recordedBy}
                </div>
              </div>
            ))
          ) : (
            <p
              style={{
                color: "#64748b",
                textAlign: "center",
                fontSize: "0.9rem",
              }}
            >
              No payments recorded yet.
            </p>
          )}
        </div>
      </div>

      <div className="print-only" style={{ marginTop: "20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "20px",
            borderBottom: "3px solid #6366f1",
            paddingBottom: "10px",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "1.8rem",
                fontWeight: 800,
                color: "#1e293b",
                margin: 0,
              }}
            >
              CHAI KHATA REPORT
            </h2>
            <p style={{ color: "#64748b", fontWeight: 700, margin: 0 }}>
              {format(new Date(), "MMMM yyyy")} Statement
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{ fontSize: "0.7rem", fontWeight: 800, color: "#94a3b8" }}
            >
              GENERATED ON
            </div>
            <div style={{ fontWeight: 800, color: "#1e293b" }}>
              {format(new Date(), "dd MMM, yyyy")}
            </div>
          </div>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc", textAlign: "left" }}>
              <th
                style={{
                  padding: "12px",
                  border: "1px solid #e2e8f0",
                  fontWeight: 800,
                }}
              >
                DRINK / ITEM
              </th>
              <th
                style={{
                  padding: "12px",
                  border: "1px solid #e2e8f0",
                  fontWeight: 800,
                }}
              >
                DATE
              </th>
              <th
                style={{
                  padding: "12px",
                  border: "1px solid #e2e8f0",
                  fontWeight: 800,
                }}
              >
                TIME SLOT
              </th>
              <th
                style={{
                  padding: "12px",
                  border: "1px solid #e2e8f0",
                  fontWeight: 800,
                  textAlign: "right",
                }}
              >
                AMOUNT
              </th>
            </tr>
          </thead>
          <tbody>
            {entries
              .filter((e) =>
                isWithinInterval(parseISO(e.date), {
                  start: startOfMonth(new Date()),
                  end: endOfMonth(new Date()),
                }),
              )
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((e) => (
                <tr key={e.id}>
                  <td
                    style={{
                      padding: "12px",
                      border: "1px solid #e2e8f0",
                      fontWeight: 700,
                    }}
                  >
                    {e.itemName} {e.size === "half" ? "(Half)" : ""}
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #e2e8f0" }}>
                    {format(parseISO(e.date), "dd/MM/yyyy")}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      border: "1px solid #e2e8f0",
                      textTransform: "capitalize",
                    }}
                  >
                    {e.time || "N/A"}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      border: "1px solid #e2e8f0",
                      fontWeight: 800,
                      textAlign: "right",
                    }}
                  >
                    ₹{e.price * e.quantity}
                  </td>
                </tr>
              ))}
          </tbody>
          <tfoot>
            <tr style={{ background: "#f5f3ff", fontWeight: 800 }}>
              <td
                colSpan="3"
                style={{
                  padding: "15px",
                  textAlign: "right",
                  border: "1px solid #e2e8f0",
                }}
              >
                MONTHLY TOTAL SPENDING:
              </td>
              <td
                style={{
                  padding: "15px",
                  textAlign: "right",
                  border: "1px solid #e2e8f0",
                  fontSize: "1.1rem",
                  color: "#6366f1",
                }}
              >
                ₹{stats.totalSpent}
              </td>
            </tr>
            <tr style={{ background: "#f0fdf4", fontWeight: 800 }}>
              <td
                colSpan="3"
                style={{
                  padding: "15px",
                  textAlign: "right",
                  border: "1px solid #e2e8f0",
                }}
              >
                TOTAL PAID:
              </td>
              <td
                style={{
                  padding: "15px",
                  textAlign: "right",
                  border: "1px solid #e2e8f0",
                  color: "#10b981",
                }}
              >
                ₹{stats.totalPaid}
              </td>
            </tr>
            <tr
              style={{
                background: stats.balance > 0 ? "#fff1f2" : "#f0fdf4",
                fontWeight: 800,
              }}
            >
              <td
                colSpan="3"
                style={{
                  padding: "15px",
                  textAlign: "right",
                  border: "1px solid #e2e8f0",
                }}
              >
                {stats.balance > 0 ? "PENDING BALANCE:" : "BALANCE SETTLED:"}
              </td>
              <td
                style={{
                  padding: "15px",
                  textAlign: "right",
                  border: "1px solid #e2e8f0",
                  color: stats.balance > 0 ? "#e11d48" : "#10b981",
                }}
              >
                ₹{stats.balance}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default MonthlyReport;
