import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { savingService } from "../../services/savingService";

const SavingMain = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("ongoing"); // 'ongoing' or 'finished'
  const [savings, setSavings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSavings();
  }, [tab]);

  const loadSavings = async () => {
    setLoading(true);
    try {
      const status = tab === "ongoing";
      const response = await savingService.getSavingsByStatus(status);
      setSavings(response.data || []);
    } catch (error) {
      console.error("Load savings error:", error);
      toast.error("Không thể tải danh sách mục tiêu");
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (savedAmount, limitAmount) => {
    if (!limitAmount || limitAmount === 0) return 0;
    return Math.min((savedAmount / limitAmount) * 100, 100);
  };

  return (
    <div style={{ padding: "10px", paddingBottom: "100px" }}>
      <h2 style={{ textAlign: "center" }}>Mục tiêu tích lũy</h2>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <div
          onClick={() => setTab("ongoing")}
          style={{
            padding: "10px 20px",
            color: tab === "ongoing" ? "#ffcc00" : "#888",
            borderBottom:
              tab === "ongoing" ? "2px solid #ffcc00" : "2px solid transparent",
            fontWeight: tab === "ongoing" ? "bold" : "normal",
            cursor: "pointer",
            textDecoration: "none",
          }}
        >
          Đang thực hiện
        </div>
        <div
          onClick={() => setTab("finished")}
          style={{
            padding: "10px 20px",
            color: tab === "finished" ? "#ffcc00" : "#888",
            borderBottom:
              tab === "finished"
                ? "2px solid #ffcc00"
                : "2px solid transparent",
            fontWeight: tab === "finished" ? "bold" : "normal",
            cursor: "pointer",
            textDecoration: "none",
            marginLeft: "20px",
          }}
        >
          Đã hoàn thành
        </div>
      </div>

      {/* Savings List */}
      {loading ? (
        <div style={{ textAlign: "center", color: "#666", marginTop: "50px" }}>
          Đang tải...
        </div>
      ) : savings.length > 0 ? (
        savings.map((saving) => (
          <div
            key={saving.categoryId}
            onClick={() => navigate(`/saving/detail/${saving.categoryId}`)}
            style={{
              backgroundColor: "#222",
              borderRadius: "12px",
              padding: "15px",
              marginBottom: "15px",
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: "50px",
                height: "50px",
                backgroundColor: "#333",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                marginRight: "15px",
                color: "#ffcc00",
              }}
            >
              💰
            </div>
            <div style={{ flexGrow: 1 }}>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  marginBottom: "5px",
                }}
              >
                {saving.name}
              </div>
              <div style={{ fontSize: "14px", color: "#ccc" }}>
                <span style={{ color: "#ffcc00", fontWeight: "bold" }}>
                  {new Intl.NumberFormat("vi-VN").format(saving.savedAmount)}
                </span>
                {" / "}
                {new Intl.NumberFormat("vi-VN").format(saving.limitAmount)} đ
              </div>
              <div
                style={{
                  height: "6px",
                  backgroundColor: "#444",
                  borderRadius: "3px",
                  marginTop: "8px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    backgroundColor: "#ffcc00",
                    width: `${calculateProgress(saving.savedAmount, saving.limitAmount)}%`,
                  }}
                />
              </div>
            </div>
            <div style={{ fontSize: "20px", color: "#666" }}>›</div>
          </div>
        ))
      ) : (
        <div style={{ textAlign: "center", color: "#666", marginTop: "50px" }}>
          Chưa có mục tiêu nào.
        </div>
      )}

      {/* Add Button */}
      <div
        onClick={() => navigate("/saving/add")}
        style={{
          position: "fixed",
          bottom: "100px",
          right: "20px",
          backgroundColor: "#ffcc00",
          color: "black",
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "30px",
          cursor: "pointer",
          boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
        }}
      >
        +
      </div>
    </div>
  );
};

export default SavingMain;
