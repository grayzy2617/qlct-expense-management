import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { categoryService } from "../../services/categoryService";
import { itemService } from "../../services/itemService";

const Main = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [type, setType] = useState("EXPENSE");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [day, setDay] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [itemId, setItemId] = useState("");

  // Load categories when type changes
  useEffect(() => {
    loadCategories();
  }, [type]);

  // Set default datetime
  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const date = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    setDay(`${year}-${month}-${date}T${hours}:${minutes}`);
  }, []);

  // Load state from navigation if editing
  useEffect(() => {
    if (location.state) {
      const { itemData } = location.state;
      if (itemData) {
        setType(itemData.type || "EXPENSE");
        // Format amount with commas when loading
        const formattedAmount = itemData.amount
          ? new Intl.NumberFormat("en-US").format(Math.abs(itemData.amount))
          : "";
        setAmount(formattedAmount);
        setDescription(itemData.description || "");
        // Convert ISO string back to datetime-local format
        if (itemData.createdAt) {
          const date = new Date(itemData.createdAt);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const dateNum = String(date.getDate()).padStart(2, "0");
          const hours = String(date.getHours()).padStart(2, "0");
          const minutes = String(date.getMinutes()).padStart(2, "0");
          setDay(`${year}-${month}-${dateNum}T${hours}:${minutes}`);
        }
        setSelectedCategory(itemData.categoryId || "");
        setItemId(itemData.itemId || "");
      }
    }
  }, [location.state]);

  const loadCategories = async () => {
    try {
      const response = await categoryService.getCategoriesByType(type);
      setCategories(response.data || []);

      // Auto select first category if none selected
      if (response.data && response.data.length > 0 && !selectedCategory) {
        setSelectedCategory(response.data[0].id);
      }
    } catch (error) {
      console.error("Load categories error:", error);
      toast.error("Không thể tải danh mục");
    }
  };

  const formatCurrency = (value) => {
    const number = value.replace(/\D/g, "");
    if (!number) return "";
    return new Intl.NumberFormat("en-US").format(number);
  };

  const handleAmountChange = (e) => {
    const formatted = formatCurrency(e.target.value);
    setAmount(formatted);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCategory) {
      toast.error("Vui lòng chọn danh mục");
      return;
    }

    const cleanAmount = parseFloat(amount.replace(/,/g, ""));
    if (isNaN(cleanAmount) || cleanAmount <= 0) {
      toast.error("Số tiền không hợp lệ");
      return;
    }

    setLoading(true);

    try {
      // Convert datetime-local to ISO format for backend
      const createdAtISO = day
        ? new Date(day).toISOString()
        : new Date().toISOString();

      const itemData = {
        amount: cleanAmount,
        description: description || "",
        categoryID: selectedCategory,
        createdAt: createdAtISO,
      };

      if (itemId) {
        // Update existing item
        await itemService.updateItem(itemId, itemData);
        toast.success("Cập nhật giao dịch thành công!");
      } else {
        // Create new item
        await itemService.createItem(itemData);
        toast.success("Lưu giao dịch thành công!");
      }

      // Reset form
      setAmount("");
      setDescription("");
      setItemId("");

      // Reload current date time
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const date = String(now.getDate()).padStart(2, "0");
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      setDay(`${year}-${month}-${date}T${hours}:${minutes}`);
    } catch (error) {
      console.error("Save item error:", error);
      toast.error(error.response?.data?.message || "Lưu giao dịch thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setAmount("");
    setDescription("");
    setItemId("");
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const date = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    setDay(`${year}-${month}-${date}T${hours}:${minutes}`);
  };

  const goToCategoryManager = () => {
    navigate("/category/manage", {
      state: {
        returnData: {
          type,
          amount,
          description,
          day,
          categoryId: selectedCategory,
          itemId,
        },
      },
    });
  };

  return (
    <div style={{ paddingBottom: "80px" }}>
      {/* Tabs */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          padding: "20px 0",
          backgroundColor: "#111",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <button
          onClick={() => setType("EXPENSE")}
          style={{
            padding: "10px 25px",
            border: "none",
            borderRadius: "20px",
            color: type === "EXPENSE" ? "black" : "#888",
            backgroundColor: type === "EXPENSE" ? "#ffcc00" : "#222",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "all 0.3s",
            boxShadow:
              type === "EXPENSE" ? "0 0 10px rgba(255, 204, 0, 0.4)" : "none",
          }}
        >
          Tiền chi
        </button>
        <button
          onClick={() => setType("INCOME")}
          style={{
            padding: "10px 25px",
            border: "none",
            borderRadius: "20px",
            color: type === "INCOME" ? "black" : "#888",
            backgroundColor: type === "INCOME" ? "#ffcc00" : "#222",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "all 0.3s",
            boxShadow:
              type === "INCOME" ? "0 0 10px rgba(255, 204, 0, 0.4)" : "none",
          }}
        >
          Tiền thu
        </button>
      </div>

      {/* Form */}
      <div style={{ padding: "0 20px", maxWidth: "600px", margin: "0 auto" }}>
        <form onSubmit={handleSubmit}>
          {/* Amount Input */}
          <input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            placeholder="0"
            required
            autoFocus
            style={{
              fontSize: "32px",
              color: "#ffcc00",
              fontWeight: "bold",
              textAlign: "center",
              width: "100%",
              background: "none",
              border: "none",
              outline: "none",
              margin: "10px 0",
            }}
          />
          <div
            style={{
              textAlign: "center",
              color: "#666",
              marginBottom: "20px",
              fontSize: "14px",
            }}
          >
            VNĐ
          </div>

          {/* Description */}
          <div
            style={{
              backgroundColor: "#222",
              borderRadius: "12px",
              padding: "15px",
              marginBottom: "15px",
            }}
          >
            <div
              style={{
                fontSize: "13px",
                color: "#888",
                marginBottom: "5px",
                fontWeight: "bold",
              }}
            >
              Ghi chú
            </div>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ví dụ: Ăn sáng, Cafe..."
              style={{
                background: "none",
                border: "none",
                color: "white",
                fontSize: "18px",
                width: "100%",
                outline: "none",
              }}
            />
          </div>

          {/* DateTime */}
          <div
            style={{
              backgroundColor: "#222",
              borderRadius: "12px",
              padding: "15px",
              marginBottom: "15px",
            }}
          >
            <div
              style={{
                fontSize: "13px",
                color: "#888",
                marginBottom: "5px",
                fontWeight: "bold",
              }}
            >
              Thời gian
            </div>
            <input
              type="datetime-local"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              style={{
                background: "none",
                border: "none",
                color: "white",
                fontSize: "18px",
                width: "100%",
                outline: "none",
                colorScheme: "dark",
              }}
            />
          </div>

          {/* Categories */}
          <div style={{ marginTop: "20px" }}>
            <div
              style={{
                color: "#888",
                fontSize: "14px",
                marginBottom: "10px",
                textAlign: "center",
              }}
            >
              Danh mục
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "10px",
                maxHeight: "250px",
                overflowY: "auto",
                paddingBottom: "10px",
              }}
            >
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    style={{
                      backgroundColor:
                        selectedCategory === cat.id
                          ? "rgba(255, 204, 0, 0.2)"
                          : "#222",
                      borderRadius: "10px",
                      padding: "15px 5px",
                      cursor: "pointer",
                      textAlign: "center",
                      border:
                        selectedCategory === cat.id
                          ? "2px solid #ffcc00"
                          : "2px solid transparent",
                      transition: "all 0.2s",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "80px",
                    }}
                  >
                    <div style={{ fontSize: "24px", color: "#ffcc00" }}>
                      {cat.name.substring(0, 1).toUpperCase()}
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        marginTop: "5px",
                        color: "#ddd",
                      }}
                    >
                      {cat.name}
                    </div>
                  </div>
                ))
              ) : (
                <div
                  style={{
                    gridColumn: "1/-1",
                    textAlign: "center",
                    color: "#666",
                    padding: "20px",
                  }}
                >
                  Chưa có danh mục nào
                </div>
              )}
            </div>

            <div
              onClick={goToCategoryManager}
              style={{
                display: "block",
                textAlign: "center",
                color: "#ffcc00",
                textDecoration: "none",
                fontSize: "13px",
                marginTop: "15px",
                padding: "10px",
                cursor: "pointer",
              }}
            >
              ⚙ Quản lý danh mục
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ marginTop: "20px", paddingBottom: "20px" }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "16px",
                backgroundColor: loading ? "#ccc" : "#ffcc00",
                color: "black",
                border: "none",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 4px 15px rgba(255, 204, 0, 0.3)",
                transition: "transform 0.1s",
              }}
              onMouseDown={(e) =>
                !loading && (e.currentTarget.style.transform = "scale(0.98)")
              }
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              {loading
                ? "Đang lưu..."
                : itemId
                  ? "CẬP NHẬT GIAO DỊCH"
                  : "LƯU GIAO DỊCH"}
            </button>

            {itemId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "16px",
                  marginTop: "15px",
                  backgroundColor: "#333",
                  color: "#ccc",
                  border: "1px solid #444",
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                Hủy bỏ chỉnh sửa
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Main;
