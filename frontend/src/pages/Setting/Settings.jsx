import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authService } from "../../services/authService";

const Settings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    setLoading(true);
    try {
      const response = await authService.getCurrentUser();
      setUser(response.data);
    } catch (error) {
      console.error("Load user info error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!window.confirm("Bạn có chắc muốn đăng xuất?")) return;

    try {
      await authService.logout();
      toast.success("Đăng xuất thành công!");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Still logout on client side even if API fails
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#111",
        color: "white",
        minHeight: "100vh",
        paddingBottom: "100px",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "20px",
          textAlign: "center",
          fontSize: "20px",
          fontWeight: "bold",
          borderBottom: "1px solid #222",
        }}
      >
        Cài đặt
      </div>

      {/* Profile Section */}
      {!loading && user && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#222",
            margin: "20px",
            padding: "15px",
            borderRadius: "12px",
          }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              backgroundColor: "#ffcc00",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              fontWeight: "bold",
              color: "black",
              marginRight: "15px",
            }}
          >
            {user.username?.substring(0, 1).toUpperCase() || "U"}
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: "18px" }}>
              {user.username || "User"}
            </h3>
            <p style={{ margin: "5px 0 0 0", color: "#888", fontSize: "14px" }}>
              Tài khoản quản lý chi tiêu
            </p>
          </div>
        </div>
      )}

      {/* Settings Group */}
      <div
        style={{
          margin: "20px",
          backgroundColor: "#222",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <div style={{ borderBottom: "1px solid #333" }}>
          <button
            onClick={() => navigate("/settings/custom-start-day")}
            style={{
              width: "100%",
              background: "none",
              border: "none",
              padding: "15px",
              color: "white",
              fontSize: "16px",
              textAlign: "left",
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#333")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            📅 Tùy chỉnh ngày bắt đầu tháng
            <span
              style={{ color: "#666", fontSize: "20px", fontWeight: "bold" }}
            >
              ›
            </span>
          </button>
        </div>

        <div>
          <button
            onClick={() => navigate("/category/manage")}
            style={{
              width: "100%",
              background: "none",
              border: "none",
              padding: "15px",
              color: "white",
              fontSize: "16px",
              textAlign: "left",
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#333")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            📂 Quản lý danh mục
            <span
              style={{ color: "#666", fontSize: "20px", fontWeight: "bold" }}
            >
              ›
            </span>
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div
        style={{
          margin: "20px",
          backgroundColor: "#222",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            background: "none",
            border: "none",
            padding: "15px",
            color: "#ff4d4d",
            fontSize: "16px",
            textAlign: "left",
            cursor: "pointer",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight: "bold",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#333")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          🚪 Đăng xuất
          <span style={{ color: "#666", fontSize: "20px", fontWeight: "bold" }}>
            ›
          </span>
        </button>
      </div>
    </div>
  );
};

export default Settings;
