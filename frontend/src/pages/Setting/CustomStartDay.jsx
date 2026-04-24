import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { monthRangeService } from "../../services/monthRangeService";

const CustomStartDay = () => {
  const navigate = useNavigate();
  const [startDay, setStartDay] = useState(1);
  const [targetMonth, setTargetMonth] = useState(1); // Tháng mà user chọn
  const [loading, setLoading] = useState(false);
  const [dateRangePreview, setDateRangePreview] = useState("");

  useEffect(() => {
    loadStartDay();
  }, []);

  useEffect(() => {
    calculateDateRange();
  }, [startDay]);

  const calculateDateRange = () => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // Calculate start date
    const startDate = new Date(currentYear, currentMonth - 1, startDay);

    // Calculate end date (next month, startDay - 1)
    let endMonth = currentMonth === 12 ? 1 : currentMonth + 1;
    let endYear = currentMonth === 12 ? currentYear + 1 : currentYear;
    const endDate = new Date(endYear, endMonth - 1, startDay - 1);

    // Handle case where startDay > days in end month
    if (endDate.getMonth() !== endMonth - 1) {
      endDate.setDate(0); // Set to last day of previous month
    }

    const formatDate = (date) => {
      return `${date.getDate()}/${date.getMonth() + 1}`;
    };

    setDateRangePreview(`${formatDate(startDate)} - ${formatDate(endDate)}`);
  };

  const loadStartDay = async () => {
    try {
      const response = await monthRangeService.getStartDay();
      setStartDay(response.data || 1);
    } catch (error) {
      console.error("Load start day error:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (startDay < 1 || startDay > 31) {
      toast.error("Ngày bắt đầu phải từ 1 đến 31");
      return;
    }

    setLoading(true);

    try {
      const now = new Date();
      const currentMonth = now.getMonth() + 1;

      // Generate months data for the update
      const monthsData = {
        startDay: startDay,
        baseMonth: currentMonth, // Tháng hiện tại
        targetMonth: targetMonth, // Tháng mà user chọn
      };

      await monthRangeService.updateCustomMonths(monthsData);
      toast.success("Cập nhật ngày bắt đầu thành công!");
      navigate("/settings");
    } catch (error) {
      console.error("Update start day error:", error);
      toast.error(error.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#111",
        color: "white",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <h2>Tùy chỉnh ngày bắt đầu tháng</h2>

      <div
        style={{
          backgroundColor: "#222",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px",
          fontSize: "14px",
          color: "#aaa",
        }}
      >
        ℹ️ Chọn ngày bắt đầu của tháng tài chính. Ví dụ: nếu bạn chọn ngày 5,
        thì tháng của bạn sẽ chạy từ ngày 5 tháng này đến ngày 4 tháng sau.
      </div>

      {/* Date Range Preview */}
      {dateRangePreview && (
        <div
          style={{
            backgroundColor: "#2a2a2a",
            padding: "15px",
            borderRadius: "8px",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "13px", color: "#aaa", marginBottom: "8px" }}>
            📅 Khoảng thời gian:
          </div>
          <div
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: "#ffcc00",
              marginBottom: "15px",
            }}
          >
            {dateRangePreview}
          </div>
          <div
            style={{
              fontSize: "13px",
              color: "#aaa",
              marginBottom: "10px",
            }}
          >
            Bạn muốn gọi khoảng thời gian này là tháng nào?
          </div>
          <div
            style={{ display: "flex", gap: "10px", justifyContent: "center" }}
          >
            <button
              type="button"
              onClick={() => setTargetMonth(new Date().getMonth() + 1)}
              style={{
                padding: "10px 20px",
                background:
                  targetMonth === new Date().getMonth() + 1
                    ? "#ffcc00"
                    : "#444",
                color:
                  targetMonth === new Date().getMonth() + 1 ? "#000" : "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Tháng {new Date().getMonth() + 1}
            </button>
            <button
              type="button"
              onClick={() => {
                const nextMonth =
                  new Date().getMonth() === 11 ? 1 : new Date().getMonth() + 2;
                setTargetMonth(nextMonth);
              }}
              style={{
                padding: "10px 20px",
                background:
                  targetMonth !== new Date().getMonth() + 1
                    ? "#ffcc00"
                    : "#444",
                color:
                  targetMonth !== new Date().getMonth() + 1 ? "#000" : "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Tháng{" "}
              {new Date().getMonth() === 11 ? 1 : new Date().getMonth() + 2}
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: "bold",
            color: "#ccc",
          }}
        >
          Ngày bắt đầu
        </label>
        <input
          type="number"
          min="1"
          max="31"
          value={startDay}
          onChange={(e) => setStartDay(parseInt(e.target.value))}
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
            marginBottom: "20px",
          }}
        />

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
          {loading ? "Đang cập nhật..." : "LƯU THAY ĐỔI"}
        </button>
      </form>

      <button
        onClick={() => navigate("/settings")}
        style={{
          display: "inline-block",
          marginTop: "20px",
          color: "#ccc",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        ← Quay lại
      </button>
    </div>
  );
};

export default CustomStartDay;
