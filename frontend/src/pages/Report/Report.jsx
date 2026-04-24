import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { itemService } from "../../services/itemService";
import { categoryService } from "../../services/categoryService";

const Report = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState("MONTH"); // DAY, MONTH, YEAR
  const [type, setType] = useState("EXPENSE");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const [categories, setCategories] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [dailyItems, setDailyItems] = useState([]);
  const [dateRange, setDateRange] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [mode, type, month, year]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load date range description
      const dateRangeRes = await itemService.getDateRange(mode, month, year);
      setDateRange(dateRangeRes.data?.description || "");

      if (mode === "YEAR") {
        // Load data for entire year using new API
        const [expenseRes, incomeRes, categoriesRes] = await Promise.all([
          itemService.getSumByTypeAndYear("EXPENSE", year),
          itemService.getSumByTypeAndYear("INCOME", year),
          categoryService.getCategoriesByTypeAndYear(type, year),
        ]);

        setTotalExpense(expenseRes.data || 0);
        setTotalIncome(incomeRes.data || 0);
        setCategories(categoriesRes.data || []);
      } else {
        // Load data for specific month (DAY or MONTH mode)
        const [expenseRes, incomeRes] = await Promise.all([
          itemService.getSumByTypeAndRange("EXPENSE", month, year),
          itemService.getSumByTypeAndRange("INCOME", month, year),
        ]);

        setTotalExpense(expenseRes.data || 0);
        setTotalIncome(incomeRes.data || 0);

        // Load categories with amounts
        const categoriesRes = await categoryService.getCategoriesByTypeAndRange(
          type,
          month,
          year,
        );
        setCategories(categoriesRes.data || []);

        // Load daily items if in DAY mode
        if (mode === "DAY") {
          const itemsRes = await itemService.getItemsByTypeAndRange(
            type,
            month,
            year,
          );
          setDailyItems(itemsRes.data || []);
        }
      }
    } catch (error) {
      console.error("Load report data error:", error);
      toast.error("Không thể tải dữ liệu báo cáo");
    } finally {
      setLoading(false);
    }
  };

  const handleMonthChange = (e) => {
    const [y, m] = e.target.value.split("-");
    setYear(parseInt(y));
    setMonth(parseInt(m));
  };

  const totalBalance = totalIncome - totalExpense;

  // Group items by date for DAY mode
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

  const handleEditItem = (item) => {
    navigate("/main", {
      state: {
        itemToEdit: item,
        categoryId: item.categoryID,
      },
    });
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm("Bạn có chắc muốn xóa giao dịch này?")) {
      try {
        await itemService.deleteItem(itemId);
        toast.success("Xóa giao dịch thành công");
        loadData(); // Reload data
      } catch (error) {
        console.error("Delete item error:", error);
        toast.error("Không thể xóa giao dịch");
      }
    }
  };

  return (
    <div style={{ paddingBottom: "100px" }}>
      {/* Mode Selector */}
      <div style={{ textAlign: "center", padding: "12px" }}>
        {["DAY", "MONTH", "YEAR"].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              backgroundColor: mode === m ? "gold" : "#333",
              color: mode === m ? "black" : "white",
              padding: "8px 10px",
              border: "none",
              marginRight: "5px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {m === "DAY"
              ? "Hàng Ngày"
              : m === "MONTH"
                ? "Hàng Tháng"
                : "Hàng Năm"}
          </button>
        ))}
      </div>

      {/* Date Range Display */}
      {dateRange && (
        <div
          style={{
            textAlign: "center",
            marginTop: "10px",
            color: "#aaa",
            fontSize: "13px",
          }}
        >
          {dateRange}
        </div>
      )}

      {/* Date Chooser */}
      <div style={{ textAlign: "center", marginTop: "10px" }}>
        <label style={{ color: "#aaa" }}>Thời gian: </label>
        {mode !== "YEAR" && (
          <input
            type="month"
            value={`${year}-${String(month).padStart(2, "0")}`}
            onChange={handleMonthChange}
            style={{
              padding: "5px",
              background: "#333",
              color: "white",
              border: "1px solid #555",
              borderRadius: "4px",
            }}
          />
        )}
        {mode === "YEAR" && (
          <select
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            style={{
              padding: "5px",
              background: "#333",
              color: "white",
              border: "1px solid #555",
              borderRadius: "4px",
            }}
          >
            {Array.from(
              { length: 11 },
              (_, i) => new Date().getFullYear() - 5 + i,
            ).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Summary */}
      <div style={{ textAlign: "center", marginTop: "18px", fontSize: "15px" }}>
        <div style={{ marginBottom: "5px" }}>
          Chi tiêu:{" "}
          <span style={{ color: "#ff4d4d", fontWeight: "bold" }}>
            -{new Intl.NumberFormat("vi-VN").format(totalExpense)}đ
          </span>
        </div>
        <div style={{ marginBottom: "5px" }}>
          Thu nhập:{" "}
          <span style={{ color: "#00BFFF", fontWeight: "bold" }}>
            +{new Intl.NumberFormat("vi-VN").format(totalIncome)}đ
          </span>
        </div>
        <div>
          Số dư:{" "}
          <span
            style={{
              color: totalBalance >= 0 ? "#4cd137" : "#ff4d4d",
              fontWeight: "bold",
            }}
          >
            {totalBalance >= 0 ? "+" : ""}
            {new Intl.NumberFormat("vi-VN").format(totalBalance)}đ
          </span>
        </div>
      </div>

      {/* Type Switcher */}
      <div style={{ textAlign: "center", marginTop: "15px" }}>
        <button
          onClick={() => setType("EXPENSE")}
          style={{
            backgroundColor: type === "EXPENSE" ? "gold" : "#333",
            color: type === "EXPENSE" ? "black" : "white",
            padding: "8px 20px",
            border: "none",
            marginRight: "6px",
            fontWeight: "bold",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Chi tiêu
        </button>
        <button
          onClick={() => setType("INCOME")}
          style={{
            backgroundColor: type === "INCOME" ? "gold" : "#333",
            color: type === "INCOME" ? "black" : "white",
            padding: "8px 20px",
            border: "none",
            fontWeight: "bold",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Thu nhập
        </button>
      </div>

      {/* Content */}
      <div
        style={{
          margin: "20px",
          background: "#111",
          padding: "0 12px",
          borderRadius: "12px",
          paddingBottom: "60px",
        }}
      >
        {loading ? (
          <div style={{ textAlign: "center", color: "#666", padding: "40px" }}>
            Đang tải...
          </div>
        ) : mode === "DAY" ? (
          // Day mode: show daily items grouped by date
          dailyItems.length > 0 ? (
            (() => {
              const groupedItems = groupItemsByDate(dailyItems);
              return Object.entries(groupedItems).map(([date, items]) => (
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
                  {items.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "12px 15px",
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
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
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
                          onClick={() => handleEditItem(item)}
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
                          onClick={() => handleDeleteItem(item.id)}
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
              style={{ textAlign: "center", color: "#666", padding: "40px" }}
            >
              Không có giao dịch nào
            </div>
          )
        ) : // Month/Year mode: show categories
        categories.length > 0 ? (
          categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() =>
                navigate(`/report/category/${cat.id}`, {
                  state: { month, year, type },
                })
              }
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "15px 0",
                borderBottom: "1px solid #222",
                cursor: "pointer",
              }}
            >
              <div>
                <div style={{ fontWeight: "bold" }}>{cat.name}</div>
                {mode !== "YEAR" && cat.limitAmount > 0 && (
                  <div style={{ fontSize: "13px", color: "#666" }}>
                    Hạn mức:{" "}
                    {new Intl.NumberFormat("vi-VN").format(cat.limitAmount)}
                  </div>
                )}
              </div>
              <div>
                <div style={{ fontWeight: "bold", textAlign: "right" }}>
                  {new Intl.NumberFormat("vi-VN").format(cat.spentSum || 0)} đ
                </div>
                {mode !== "YEAR" && cat.limitAmount > 0 && (
                  <div
                    style={{
                      fontSize: "12px",
                      color:
                        cat.spentSum > cat.limitAmount ? "#ff4d4d" : "#4cd137",
                    }}
                  >
                    {cat.spentSum > cat.limitAmount
                      ? "Vượt hạn mức"
                      : "Trong hạn mức"}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: "center", color: "#666", padding: "40px" }}>
            Không có dữ liệu
          </div>
        )}
      </div>
    </div>
  );
};

export default Report;
