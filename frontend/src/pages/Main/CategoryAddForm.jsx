import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { categoryService } from "../../services/categoryService";

const CategoryAddForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [name, setName] = useState("");
  const [limit, setLimit] = useState("");
  const [type, setType] = useState("EXPENSE");
  const [loading, setLoading] = useState(false);
  const [returnData, setReturnData] = useState(null);

  useEffect(() => {
    if (location.state) {
      if (location.state.type) {
        setType(location.state.type);
      }
      if (location.state.returnData) {
        setReturnData(location.state.returnData);
      }
    }
  }, [location.state]);

  const formatCurrency = (value) => {
    const number = value.replace(/\D/g, "");
    if (!number) return "";
    return new Intl.NumberFormat("en-US").format(number);
  };

  const handleLimitChange = (e) => {
    const formatted = formatCurrency(e.target.value);
    setLimit(formatted);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const categoryData = {
        name: name.trim(),
        type: type,
      };

      // Only add limit for EXPENSE type
      if (type === "EXPENSE" && limit) {
        const cleanLimit = parseFloat(limit.replace(/,/g, ""));
        if (!isNaN(cleanLimit) && cleanLimit > 0) {
          categoryData.limitAmount = cleanLimit;
        }
      }

      await categoryService.createCategory(categoryData);
      toast.success("Thêm danh mục thành công!");
      navigate("/category/manage", { state: { returnData } });
    } catch (error) {
      console.error("Add category error:", error);
      toast.error(error.response?.data?.message || "Thêm danh mục thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/category/manage", { state: { returnData } });
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
      <h2>Thêm danh mục mới</h2>

      <form onSubmit={handleSubmit}>
        <label
          style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}
        >
          Tên danh mục
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nhập tên danh mục"
          required
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #333",
            backgroundColor: "#222",
            color: "white",
            marginBottom: "20px",
            boxSizing: "border-box",
          }}
        />

        {type === "EXPENSE" && (
          <>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "bold",
              }}
            >
              Hạn mức chi tiêu (VNĐ)
            </label>
            <input
              type="text"
              value={limit}
              onChange={handleLimitChange}
              placeholder="Ví dụ: 2,000,000 (Không bắt buộc)"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #333",
                backgroundColor: "#222",
                color: "white",
                marginBottom: "10px",
                boxSizing: "border-box",
              }}
            />
            <small
              style={{
                color: "#888",
                display: "block",
                marginBottom: "20px",
              }}
            >
              Nhập số tiền tối đa bạn muốn chi cho mục này mỗi tháng.
            </small>
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            display: "block",
            width: "100%",
            padding: "12px",
            backgroundColor: loading ? "#666" : "#444",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Đang lưu..." : "Lưu danh mục"}
        </button>
      </form>

      <button
        onClick={handleBack}
        style={{
          display: "inline-block",
          marginTop: "20px",
          color: "#ccc",
          textDecoration: "none",
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
      >
        ← Quay lại
      </button>
    </div>
  );
};

export default CategoryAddForm;
