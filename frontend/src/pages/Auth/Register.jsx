import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { authService } from "../../services/authService";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (password !== confirmPassword) {
      toast.error("Mật khẩu không khớp!");
      return;
    }

    if (password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    setLoading(true);

    try {
      await authService.register({ username, password, confirmPassword });
      toast.success("Đăng ký thành công!");
      navigate("/login?msg=registered");
    } catch (error) {
      console.error("Register error:", error);
      const errorMsg = error.response?.data?.message || "Đăng ký thất bại";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        backgroundColor: "#111",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        margin: 0,
      }}
    >
      <div
        style={{
          backgroundColor: "#222",
          padding: "40px 30px",
          borderRadius: "20px",
          boxShadow: "0px 10px 30px rgba(0,0,0,0.5)",
          width: "100%",
          maxWidth: "350px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            marginBottom: "30px",
            color: "#ffcc00",
            fontSize: "28px",
          }}
        >
          Tạo tài khoản
        </h2>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              marginBottom: "20px",
              textAlign: "left",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#aaa",
                fontSize: "14px",
              }}
            >
              Tên đăng nhập
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#111",
                border: "1px solid #333",
                borderRadius: "8px",
                color: "white",
                fontSize: "16px",
                boxSizing: "border-box",
                transition: "border-color 0.3s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#ffcc00")}
              onBlur={(e) => (e.target.style.borderColor = "#333")}
            />
          </div>

          <div
            style={{
              marginBottom: "20px",
              textAlign: "left",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#aaa",
                fontSize: "14px",
              }}
            >
              Mật khẩu
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#111",
                border: "1px solid #333",
                borderRadius: "8px",
                color: "white",
                fontSize: "16px",
                boxSizing: "border-box",
                transition: "border-color 0.3s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#ffcc00")}
              onBlur={(e) => (e.target.style.borderColor = "#333")}
            />
          </div>

          <div
            style={{
              marginBottom: "20px",
              textAlign: "left",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#aaa",
                fontSize: "14px",
              }}
            >
              Nhập lại mật khẩu
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#111",
                border: "1px solid #333",
                borderRadius: "8px",
                color: "white",
                fontSize: "16px",
                boxSizing: "border-box",
                transition: "border-color 0.3s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#ffcc00")}
              onBlur={(e) => (e.target.style.borderColor = "#333")}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              backgroundColor: loading ? "#ccc" : "#ffcc00",
              color: "black",
              padding: "12px",
              border: "none",
              borderRadius: "8px",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "16px",
              fontWeight: "bold",
              marginTop: "10px",
              transition: "transform 0.1s",
            }}
            onMouseDown={(e) =>
              !loading && (e.target.style.transform = "scale(0.98)")
            }
            onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
          >
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>

        <div
          style={{
            marginTop: "20px",
            fontSize: "14px",
            color: "#888",
          }}
        >
          Đã có tài khoản?{" "}
          <Link
            to="/login"
            style={{
              color: "#ffcc00",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
