import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { itemService } from "../../services/itemService";
import { categoryService } from "../../services/categoryService";

const DetailCategory = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const location = useLocation();

  const [category, setCategory] = useState(null);
  const [items, setItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [type, setType] = useState("EXPENSE");

  // Validate categoryId
  useEffect(() => {
    if (!categoryId) {
      console.error("❌ CategoryId is undefined!");
      toast.error("Không tìm thấy danh mục");
      navigate("/report");
    }
  }, [categoryId, navigate]);

  useEffect(() => {
    if (location.state) {
      setMonth(location.state.month || new Date().getMonth() + 1);
      setYear(location.state.year || new Date().getFullYear());
      setType(location.state.type || "EXPENSE");
    }
  }, [location.state]);

  useEffect(() => {
    if (categoryId) {
      loadData();
    }
  }, [categoryId, month, year]);

  const loadData = async () => {
    try {
      const [categoryRes, itemsRes, sumRes] = await Promise.all([
        categoryService.getCategoryById(categoryId),
        itemService.getItemsByCategoryAndRange(categoryId, month, year),
        itemService.getSumByCategoryAndRange(categoryId, month, year),
      ]);

      setCategory(categoryRes.data);
      setItems(itemsRes.data || []);
      setTotalAmount(sumRes.data || 0);
    } catch (error) {
      console.error("Load category detail error:", error);
      toast.error("Không thể tải dữ liệu");
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm("Bạn có chắc muốn xóa giao dịch này?")) return;

    try {
      await itemService.deleteItem(itemId);
      toast.success("Xóa giao dịch thành công!");
      loadData();
    } catch (error) {
      console.error("Delete item error:", error);
      toast.error("Không thể xóa giao dịch");
    }
  };

  const handleEdit = (item) => {
    navigate("/main", {
      state: {
        itemData: {
          type: category.type,
          amount: Math.abs(item.amount),
          description: item.description,
          createdAt: item.createdAt,
          categoryId: categoryId,
          itemId: item.id,
        },
      },
    });
  };

  // Group items by date
  const groupItemsByDate = (items) => {
    const groups = {};
    items.forEach((item) => {
      const date = item.createdAt
        ? new Date(item.createdAt).toLocaleDateString("vi-VN")
        : "Không rõ ngày";
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(item);
    });
    return groups;
  };

  return (
    <div
      style={{
        backgroundColor: "#111",
        minHeight: "100vh",
        color: "white",
        paddingBottom: "100px",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "20px",
          background: "#222",
          borderBottom: "1px solid #333",
        }}
      >
        <button
          onClick={() => navigate("/report")}
          style={{
            background: "none",
            border: "none",
            color: "#ffcc00",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          ← Quay lại
        </button>
        <h2 style={{ textAlign: "center", marginTop: "10px" }}>
          {category?.name || "Chi tiết danh mục"}
        </h2>
        <div
          style={{
            textAlign: "center",
            fontSize: "24px",
            fontWeight: "bold",
            color: "#ffcc00",
            marginTop: "10px",
          }}
        >
          {new Intl.NumberFormat("vi-VN").format(totalAmount)} đ
        </div>
        {category?.limitAmount > 0 && (
          <div style={{ textAlign: "center", fontSize: "14px", color: "#888" }}>
            Hạn mức:{" "}
            {new Intl.NumberFormat("vi-VN").format(category.limitAmount)} đ
          </div>
        )}
      </div>

      {/* Items List */}
      <div style={{ padding: "15px" }}>
        {items.length > 0 ? (
          (() => {
            const groupedItems = groupItemsByDate(items);
            return Object.entries(groupedItems).map(([date, itemsInDate]) => (
              <div key={date} style={{ marginBottom: "20px" }}>
                <div
                  style={{
                    padding: "10px 15px",
                    background: "#222",
                    fontWeight: "bold",
                    fontSize: "14px",
                    color: "#aaa",
                    borderRadius: "8px",
                    marginBottom: "8px",
                  }}
                >
                  {date}
                </div>
                {itemsInDate.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "15px 0",
                      borderBottom: "1px solid #222",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: "bold", fontSize: "15px" }}>
                        {item.description || "Giao dịch"}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#888",
                          marginTop: "2px",
                        }}
                      >
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleTimeString(
                              "vi-VN",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )
                          : ""}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div
                        style={{
                          fontWeight: "bold",
                          fontSize: "16px",
                          marginRight: "10px",
                        }}
                      >
                        {new Intl.NumberFormat("vi-VN").format(
                          Math.abs(item.amount),
                        )}
                      </div>
                      <button
                        onClick={() => handleEdit(item)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#ffcc00",
                          fontSize: "16px",
                          cursor: "pointer",
                          marginRight: "5px",
                        }}
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#ff4d4d",
                          fontSize: "16px",
                          cursor: "pointer",
                        }}
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ));
          })()
        ) : (
          <div
            style={{ textAlign: "center", color: "#666", marginTop: "40px" }}
          >
            Không có giao dịch nào trong tháng này
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailCategory;
