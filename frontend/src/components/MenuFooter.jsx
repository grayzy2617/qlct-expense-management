import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const MenuFooter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user has ROLE_ADMIN
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const roles = decoded.scope || "";
        setIsAdmin(roles.includes("ROLE_ADMIN"));
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "95%",
        maxWidth: "450px",
        backgroundColor: "#222",
        padding: "10px 0",
        borderRadius: "30px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
        border: "1px solid #333",
        zIndex: 999,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "flex-end",
        }}
      >
        {/* Báo cáo */}
        <button
          onClick={() => navigate("/report")}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            color: isActive("/report") ? "#ffcc00" : "#888",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: "22px", marginBottom: "3px" }}>📊</div>
          <div
            style={{
              fontSize: "11px",
              fontWeight: isActive("/report") ? "bold" : "normal",
            }}
          >
            Báo cáo
          </div>
        </button>

        {/* Tích lũy */}
        <button
          onClick={() => navigate("/saving")}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            color: isActive("/saving") ? "#ffcc00" : "#888",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: "22px", marginBottom: "3px" }}>💰</div>
          <div
            style={{
              fontSize: "11px",
              fontWeight: isActive("/saving") ? "bold" : "normal",
            }}
          >
            Tích lũy
          </div>
        </button>

        {/* Nhập (nút nổi bật) */}
        <button
          onClick={() => navigate("/main")}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              backgroundColor:
                isActive("/main") || isActive("/category") ? "#ffcc00" : "#444",
              color:
                isActive("/main") || isActive("/category") ? "black" : "white",
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "-40px auto 5px auto",
              border: "6px solid #111",
              boxShadow: "0 5px 15px rgba(0,0,0,0.4)",
              transition: "transform 0.2s",
            }}
          >
            <span style={{ fontSize: "28px", fontWeight: "bold" }}>+</span>
          </div>
          <div
            style={{
              fontSize: "11px",
              color:
                isActive("/main") || isActive("/category") ? "#ffcc00" : "#888",
              fontWeight:
                isActive("/main") || isActive("/category") ? "bold" : "normal",
            }}
          >
            Nhập
          </div>
        </button>

        {/* Cài đặt */}
        <button
          onClick={() => navigate("/settings")}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            color: isActive("/settings") ? "#ffcc00" : "#888",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: "22px", marginBottom: "3px" }}>⚙️</div>
          <div
            style={{
              fontSize: "11px",
              fontWeight: isActive("/settings") ? "bold" : "normal",
            }}
          >
            Cài đặt
          </div>
        </button>

        {/* Admin (chỉ hiện với ROLE_ADMIN) */}
        {isAdmin && (
          <button
            onClick={() => navigate("/admin/users")}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              color: isActive("/admin") ? "#ffcc00" : "#888",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div style={{ fontSize: "22px", marginBottom: "3px" }}>👑</div>
            <div
              style={{
                fontSize: "11px",
                fontWeight: isActive("/admin") ? "bold" : "normal",
              }}
            >
              Admin
            </div>
          </button>
        )}
      </div>
    </div>
  );
};

export default MenuFooter;
