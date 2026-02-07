import React, { useState } from "react";
import { Minus, Plus, Clock, ArrowRight, Coffee, CupSoda } from "lucide-react";

function EntryForm({ items, timeSlots, onAdd }) {
  const [selectedItemId, setSelectedItem] = useState("");

  const effectiveSelectedId =
    items.find((i) => i.id === selectedItemId)?.id || items[0]?.id || "";

  const [size, setSize] = useState("full");
  const [quantity, setQuantity] = useState(1);

  const getCurrentDefaultTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return timeSlots[0] || "Morning";
    if (hour < 17) return timeSlots[1] || "Afternoon";
    return timeSlots[2] || "Evening";
  };

  const [time, setTime] = useState(getCurrentDefaultTime());

  const selectedTime = timeSlots.includes(time)
    ? time
    : getCurrentDefaultTime();

  const selectedItem = items.find((i) => i.id === effectiveSelectedId);
  const price =
    size === "full" ? selectedItem?.priceFull : selectedItem?.priceHalf;
  const total = (price || 0) * quantity;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedItem) return;
    onAdd({
      itemId: effectiveSelectedId,
      itemName: selectedItem.name,
      size,
      quantity,
      time: selectedTime,
      price: price,
    });
  };

  if (items.length === 0) {
    return (
      <div
        className="form-card fade-in"
        style={{ textAlign: "center", padding: "40px 20px" }}
      >
        <Coffee size={48} color="#cbd5e1" style={{ marginBottom: "20px" }} />
        <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#1e293b" }}>
          No Menu Items Found
        </h2>
        <p style={{ color: "#64748b", fontSize: "0.9rem", marginTop: "10px" }}>
          Go to the <b>Settings</b> tab to add your refreshments first.
        </p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Main Form Card */}
      <div className="form-card">
        <h2 className="form-title">New Entry</h2>

        <form onSubmit={handleSubmit}>
          {/* Item Selector */}
          <div className="field-group">
            <label className="form-label">Choose Item</label>
            <div className="item-selector">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`item-option ${effectiveSelectedId === item.id ? "active" : ""}`}
                  onClick={() => setSelectedItem(item.id)}
                >
                  {item.name}
                </div>
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div className="field-group">
            <label className="form-label">Select Size</label>
            <div className="size-selector">
              <div
                className={`size-option ${size === "full" ? "active" : ""}`}
                onClick={() => setSize("full")}
              >
                <Coffee size={18} /> Full Cup
              </div>
              <div
                className={`size-option ${size === "half" ? "active" : ""}`}
                onClick={() => setSize("half")}
              >
                <CupSoda size={18} /> Half Cup
              </div>
            </div>
          </div>

          {/* Qty & Total row */}
          <div className="field-group qty-total-row">
            <div>
              <label className="form-label">Quantity</label>
              <div className="stepper">
                <button
                  type="button"
                  className="stepper-btn"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  <Minus size={16} />
                </button>
                <div className="qty-display">{quantity}</div>
                <button
                  type="button"
                  className="stepper-btn"
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <label className="form-label">Total Amount</label>
              <div className="total-amount">₹{total}</div>
            </div>
          </div>

          {/* Time Slot - Now Interactive and Custom */}
          <div className="field-group">
            <label className="form-label">Time Slot</label>
            <div
              className="item-selector"
              style={{ background: "#f8fafc", padding: "4px" }}
            >
              {timeSlots.map((slot) => (
                <div
                  key={slot}
                  className={`item-option ${selectedTime === slot ? "active" : ""}`}
                  onClick={() => setTime(slot)}
                  style={{ fontSize: "0.8rem", padding: "8px" }}
                >
                  {slot}
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="submit-btn"
            style={{ marginTop: "10px" }}
            disabled={!selectedItem}
          >
            Log {quantity} {selectedItem?.name} • ₹{total}{" "}
            <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default EntryForm;
