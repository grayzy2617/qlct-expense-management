import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { savingService } from "../../services/savingService";

const SavingAddForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [viewInReport, setViewInReport] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    // Set default start date
    const now = new Date();
    const formatted = formatDateTimeLocal(now);
    setStartDate(formatted);

    // Check if editing
    if (location.state?.saving) {
      const saving = location.state.saving;
      setIsEdit(true);
      setName(saving.name || "");
      setTarget(new Intl.NumberFormat("en-US").format(saving.limitAmount || 0));
      setStartDate(
        saving.startDate
          ? formatDateTimeLocal(new Date(saving.startDate))
          : formatted,
      );
      setEndDate(
        saving.endDate ? formatDateTimeLocal(new Date(saving.endDate)) : "",
      );
      setViewInReport(saving.viewInReport || false);
    }
  }, [location.state]);

  const formatDateTimeLocal = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const formatCurrency = (value) => {
    const number = value.replace(/\D/g, "");
    if (!number) return "";
    return new Intl.NumberFormat("en-US").format(number);
  };

  const handleTargetChange = (e) => {
    const formatted = formatCurrency(e.target.value);
    setTarget(formatted);
  };

  const selectDuration = (months) => {
    const start = startDate ? new Date(startDate) : new Date();
    if (!startDate) {
      setStartDate(formatDateTimeLocal(start));
    }

    const end = new Date(start);
    end.setMonth(end.getMonth() + months);
    end.setHours(23, 59, 0, 0);

    setEndDate(formatDateTimeLocal(end));
    setShowDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanTarget = parseFloat(target.replace(/,/g, ""));
    if (isNaN(cleanTarget) || cleanTarget <= 0) {
      toast.error("Số tiền không hợp lệ");
      return;
    }

    setLoading(true);

    try {
      // Convert datetime-local to ISO format
      const startDateISO = startDate ? new Date(startDate).toISOString() : null;
      const endDateISO = endDate ? new Date(endDate).toISOString() : null;

      const savingData = {
        name: name.trim(),
        limitAmount: cleanTarget,
        startDate: startDateISO,
        endDate: endDateISO,
        viewInReport: viewInReport,
      };

      console.log("📤 Sending saving data:", savingData);

      if (isEdit && id) {
        await savingService.updateSaving(id, savingData);
        toast.success("Cập nhật mục tiêu thành công!");
      } else {
        await savingService.createSaving(savingData);
        toast.success("Tạo mục tiêu thành công!");
      }

      navigate("/saving");
    } catch (error) {
      console.error("Save saving error:", error);
      toast.error(error.response?.data?.message || "Lưu mục tiêu thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#111",
        color: "white",
        padding: "20px",
        minHeight: "100vh",
      }}
    >
      <h2 style={{ textAlign: "center" }}>
        {isEdit ? "Chỉnh sửa mục tiêu" : "Mục tiêu tích lũy mới"}
      </h2>

      <form onSubmit={handleSubmit}>
        <label
          style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}
        >
          Tên mục tiêu
        </label>
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ví dụ: Mua Laptop Gaming"
            required
            style={{
              width: "100%",
              padding: "12px",
              background: "#222",
              border: "1px solid #444",
              color: "white",
              borderRadius: "8px",
              boxSizing: "border-box",
              fontSize: "16px",
            }}
          />
        </div>

        <label
          style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}
        >
          Số tiền cần tích lũy (VNĐ)
        </label>
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            value={target}
            onChange={handleTargetChange}
            placeholder="0"
            required
            style={{
              width: "100%",
              padding: "12px",
              background: "#222",
              border: "1px solid #444",
              color: "white",
              borderRadius: "8px",
              boxSizing: "border-box",
              fontSize: "16px",
            }}
          />
        </div>

        <label
          style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}
        >
          Ngày bắt đầu
        </label>
        <div style={{ marginBottom: "20px" }}>
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              background: "#222",
              border: "1px solid #444",
              color: "white",
              borderRadius: "8px",
              boxSizing: "border-box",
              fontSize: "16px",
              colorScheme: "dark",
            }}
          />
        </div>

        <label
          style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}
        >
          Dự kiến hoàn thành
        </label>
        <div style={{ position: "relative", marginBottom: "20px" }}>
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              paddingRight: "40px",
              background: "#222",
              border: "1px solid #444",
              color: "white",
              borderRadius: "8px",
              boxSizing: "border-box",
              fontSize: "16px",
              colorScheme: "dark",
            }}
          />
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            style={{
              position: "absolute",
              right: "5px",
              top: "12px",
              background: "none",
              border: "none",
              color: "#ffcc00",
              fontSize: "18px",
              cursor: "pointer",
              padding: "5px 10px",
            }}
          >
            ▼
          </button>

          {showDropdown && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "100%",
                backgroundColor: "#333",
                minWidth: "160px",
                boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.5)",
                borderRadius: "8px",
                zIndex: 20,
                overflow: "hidden",
                border: "1px solid #444",
              }}
            >
              {[1, 3, 6, 12, 24, 60].map((months) => (
                <div
                  key={months}
                  onClick={() => selectDuration(months)}
                  style={{
                    color: "white",
                    padding: "12px 16px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#444")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  {months === 1
                    ? "1 Tháng"
                    : months === 12
                      ? "1 Năm"
                      : months === 24
                        ? "2 Năm"
                        : months === 60
                          ? "5 Năm"
                          : `${months} Tháng`}
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
            background: "#222",
            padding: "15px",
            borderRadius: "8px",
            border: "1px solid #333",
          }}
        >
          <span>Hiển thị trong báo cáo tổng?</span>
          <input
            type="checkbox"
            checked={viewInReport}
            onChange={(e) => setViewInReport(e.target.checked)}
            style={{ width: "20px", height: "20px", margin: 0 }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "15px",
            background: loading ? "#666" : "#ffcc00",
            color: "black",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            fontSize: "16px",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background 0.3s",
          }}
        >
          {loading ? "Đang lưu..." : isEdit ? "CẬP NHẬT" : "TẠO MỤC TIÊU"}
        </button>
      </form>

      <div
        onClick={() => navigate("/saving")}
        style={{
          color: "#888",
          textAlign: "center",
          marginTop: "20px",
          cursor: "pointer",
        }}
      >
        Quay lại danh sách
      </div>

      {/* Close dropdown when clicking outside */}
      {showDropdown && (
        <div
          onClick={() => setShowDropdown(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10,
          }}
        />
      )}
    </div>
  );
};

export default SavingAddForm;
