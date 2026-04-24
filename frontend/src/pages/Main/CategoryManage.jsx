import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { categoryService } from "../../services/categoryService";

const CategoryManage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [type, setType] = useState("EXPENSE");
  const [categories, setCategories] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [returnData, setReturnData] = useState(null);

  useEffect(() => {
    if (location.state?.returnData) {
      setReturnData(location.state.returnData);
      if (location.state.returnData.type) {
        setType(location.state.returnData.type);
      }
    }
  }, [location.state]);

  useEffect(() => {
    loadCategories();
  }, [type]);

  const loadCategories = async () => {
    try {
      const response = await categoryService.getCategoriesByType(type);
      setCategories(response.data || []);
    } catch (error) {
      console.error("Load categories error:", error);
      toast.error("Không thể tải danh mục");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa danh mục này?")) {
      return;
    }

    try {
      await categoryService.deleteCategory(id);
      toast.success("Xóa danh mục thành công!");
      loadCategories();
    } catch (error) {
      console.error("Delete category error:", error);
      toast.error(error.response?.data?.message || "Xóa danh mục thất bại");
    }
  };

  const handleBack = () => {
    if (returnData) {
      navigate("/main", { state: { itemData: returnData } });
    } else {
      navigate("/main");
    }
  };

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleEdit = (category) => {
    navigate(`/category/edit/${category.id}`, {
      state: { category, returnData },
    });
  };

  const handleAddCategory = () => {
    navigate("/category/add", {
      state: { type, returnData },
    });
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
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          marginBottom: "20px",
        }}
      >
        {/* Back Button */}
        <button
          onClick={handleBack}
          style={{
            position: "absolute",
            left: 0,
            backgroundColor: "#222",
            color: "white",
            border: "none",
            borderRadius: "10px",
            padding: "8px 14px",
            cursor: "pointer",
            transition: "background 0.3s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#444")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#222")}
        >
          ⬅ Quay lại
        </button>

        {/* Type Tabs */}
        <div>
          <button
            onClick={() => setType("EXPENSE")}
            style={{
              backgroundColor: type === "EXPENSE" ? "#ffcc00" : "#222",
              border: "none",
              color: type === "EXPENSE" ? "#000" : "#aaa",
              padding: "8px 16px",
              borderRadius: "10px",
              margin: "0 5px",
              cursor: "pointer",
              fontWeight: type === "EXPENSE" ? "bold" : "normal",
              transition: "background 0.3s",
            }}
          >
            Chi tiêu
          </button>
          <button
            onClick={() => setType("INCOME")}
            style={{
              backgroundColor: type === "INCOME" ? "#ffcc00" : "#222",
              border: "none",
              color: type === "INCOME" ? "#000" : "#aaa",
              padding: "8px 16px",
              borderRadius: "10px",
              margin: "0 5px",
              cursor: "pointer",
              fontWeight: type === "INCOME" ? "bold" : "normal",
              transition: "background 0.3s",
            }}
          >
            Thu nhập
          </button>
        </div>
      </div>

      {/* Add Button */}
      <button
        onClick={handleAddCategory}
        style={{
          display: "block",
          width: "100%",
          backgroundColor: "#222",
          border: "1px solid #555",
          color: "white",
          padding: "12px",
          borderRadius: "10px",
          textAlign: "center",
          cursor: "pointer",
          marginTop: "20px",
        }}
      >
        + Thêm danh mục
      </button>

      {/* Categories List */}
      <div>
        {categories.length > 0 ? (
          categories.map((cat) => (
            <div
              key={cat.id}
              style={{
                backgroundColor: "#1b1b1b",
                padding: "10px",
                borderRadius: "12px",
                margin: "10px 0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <span>{cat.name}</span>
              </div>
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => toggleMenu(cat.id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#aaa",
                    fontSize: "28px",
                    lineHeight: 1,
                    padding: "5px",
                    cursor: "pointer",
                  }}
                >
                  ⋮
                </button>
                {openMenuId === cat.id && (
                  <div
                    style={{
                      position: "absolute",
                      backgroundColor: "#333",
                      borderRadius: "10px",
                      right: 0,
                      top: "20px",
                      padding: "5px 0",
                      zIndex: 10,
                      minWidth: "120px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                    }}
                  >
                    <button
                      onClick={() => {
                        setOpenMenuId(null);
                        handleEdit(cat);
                      }}
                      style={{
                        display: "block",
                        width: "100%",
                        background: "none",
                        border: "none",
                        color: "white",
                        textAlign: "left",
                        padding: "10px 15px",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#444")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      Chỉnh sửa
                    </button>
                    <button
                      onClick={() => {
                        setOpenMenuId(null);
                        handleDelete(cat.id);
                      }}
                      style={{
                        display: "block",
                        width: "100%",
                        background: "none",
                        border: "none",
                        color: "white",
                        textAlign: "left",
                        padding: "10px 15px",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#444")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      Xóa
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", color: "#666", marginTop: "40px" }}>
            Không có danh mục nào.
          </p>
        )}
      </div>

      {/* Click outside to close menu */}
      {openMenuId && (
        <div
          onClick={() => setOpenMenuId(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 5,
          }}
        />
      )}
    </div>
  );
};

export default CategoryManage;
