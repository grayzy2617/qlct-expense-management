import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { categoryService } from "../../services/categoryService";

const CategoryEditForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [name, setName] = useState("");
  const [limit, setLimit] = useState("");
  const [type, setType] = useState("EXPENSE");
  const [loading, setLoading] = useState(false);
  const [returnData, setReturnData] = useState(null);

  useEffect(() => {
    if (location.state) {
      const { category, returnData: rd } = location.state;
      if (category) {
        setName(category.name || "");
        setType(category.type || "EXPENSE");

        // Format limit if exists
        if (category.limitAmount) {
          const formattedLimit = new Intl.NumberFormat("en-US").format(
            category.limitAmount,
          );
          setLimit(formattedLimit);
        }
      }
      if (rd) {
        setReturnData(rd);
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
        categoryName: name.trim(), // Backend expects 'categoryName'
        type: type,
      };

      // Only add limit for EXPENSE type
      if (type === "EXPENSE") {
        if (limit) {
          const cleanLimit = parseFloat(limit.replace(/,/g, ""));
          if (!isNaN(cleanLimit) && cleanLimit > 0) {
            categoryData.limitAmount = cleanLimit;
          }
        } else {
          categoryData.limitAmount = 0; // No limit
        }
      }

      console.log("📤 Sending category update:", categoryData);

      await categoryService.updateCategory(id, categoryData);
      toast.success("Cập nhật danh mục thành công!");
      navigate("/category/manage", { state: { returnData } });
    } catch (error) {
      console.error("Update category error:", error);
      toast.error(
        error.response?.data?.message || "Cập nhật danh mục thất bại",
      );
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
      <h2>Chỉnh sửa danh mục</h2>

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
              placeholder="Không giới hạn"
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
          {loading ? "Đang cập nhật..." : "Cập nhật danh mục"}
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

export default CategoryEditForm;
