import React, { useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  parseISO,
} from "date-fns";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

function CustomDatePicker({ isOpen, onClose, selectedDate, onSelect }) {
  const [currentMonth, setCurrentMonth] = useState(
    selectedDate
      ? typeof selectedDate === "string"
        ? parseISO(selectedDate)
        : selectedDate
      : new Date(),
  );

  if (!isOpen) return null;

  const renderHeader = () => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          padding: "0 10px",
        }}
      >
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#64748b",
            padding: "5px",
          }}
        >
          <ChevronLeft size={20} />
        </button>
        <span
          style={{
            fontSize: "1rem",
            fontWeight: 800,
            color: "#1e293b",
          }}
        >
          {format(currentMonth, "MMMM yyyy")}
        </span>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#64748b",
            padding: "5px",
          }}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const dateFormat = "EEEEE"; // S, M, T, W, T, F, S
    const startDate = startOfWeek(currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div
          key={i}
          style={{
            textAlign: "center",
            fontWeight: 700,
            fontSize: "0.75rem",
            color: "#94a3b8",
            marginBottom: "10px",
          }}
        >
          {format(addDays(startDate, i), dateFormat)}
        </div>,
      );
    }
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
        {days}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d");
        const cloneDay = day;
        const isSelected = selectedDate
          ? isSameDay(
              day,
              typeof selectedDate === "string"
                ? parseISO(selectedDate)
                : selectedDate,
            )
          : false;
        const isCurrentMonth = isSameMonth(day, monthStart);

        days.push(
          <div
            key={day}
            onClick={() => {
              onSelect(cloneDay);
              onClose();
            }}
            style={{
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              borderRadius: "12px",
              background: isSelected
                ? "var(--primary-gradient)"
                : "transparent",
              color: isSelected
                ? "white"
                : isCurrentMonth
                  ? "#1e293b"
                  : "#cbd5e1",
              fontWeight: isSelected ? 800 : 600,
              fontSize: "0.9rem",
              margin: "2px",
              opacity: isCurrentMonth ? 1 : 0.5,
              transition: "all 0.2s",
            }}
          >
            {formattedDate}
          </div>,
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div
          key={day}
          style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}
        >
          {days}
        </div>,
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.4)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        backdropFilter: "blur(4px)",
      }}
      onClick={onClose}
    >
      <div
        className="fade-in"
        style={{
          background: "white",
          borderRadius: "24px",
          width: "100%",
          maxWidth: "350px",
          padding: "24px",
          boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "10px",
          }}
        >
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "none",
              cursor: "pointer",
              color: "#64748b",
            }}
          >
            <X size={20} />
          </button>
        </div>
        {renderHeader()}
        {renderDays()}
        {renderCells()}
      </div>
    </div>
  );
}

export default CustomDatePicker;
