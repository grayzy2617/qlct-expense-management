import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { savingService } from "../../services/savingService";
import { itemService } from "../../services/itemService";

const SavingDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [saving, setSaving] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("deposit"); // 'deposit' or 'withdraw'
  const [isEdit, setIsEdit] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  // Form states
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [day, setDay] = useState("");

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [savingRes, itemsRes] = await Promise.all([
        savingService.getSavingById(id),
        itemService.getItemsByCategoryId(id),
      ]);

      setSaving(savingRes.data);
      setTransactions(itemsRes.data || []);
    } catch (error) {
      console.error("Load data error:", error);
      toast.error("Không thể tải dữ liệu");
      navigate("/saving");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    try {
      await savingService.toggleStatus(id);
      toast.success("Cập nhật trạng thái thành công!");
      loadData();
    } catch (error) {
      console.error("Toggle status error:", error);
      toast.error("Không thể cập nhật trạng thái");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Bạn có chắc muốn xóa vĩnh viễn mục tiêu này?")) return;

    try {
      await savingService.deleteSaving(id);
      toast.success("Xóa mục tiêu thành công!");
      navigate("/saving");
    } catch (error) {
      console.error("Delete saving error:", error);
      toast.error("Không thể xóa mục tiêu");
    }
  };

  const openTransactionModal = (type) => {
    setModalType(type);
    setIsEdit(false);
    setAmount("");
    setDescription("");
    const now = new Date();
    setDay(formatDateTimeLocal(now));
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setCurrentItem(item);
    setIsEdit(true);
    setModalType(item.amount > 0 ? "deposit" : "withdraw");
    setAmount(new Intl.NumberFormat("en-US").format(Math.abs(item.amount)));
    setDescription(item.description || "");
    setDay(item.createdAt ? formatDateTimeLocal(new Date(item.createdAt)) : "");
    setShowModal(true);
  };

  const formatDateTimeLocal = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${d}T${hours}:${minutes}`;
  };

  const formatCurrency = (value) => {
    const number = value.replace(/\D/g, "");
    if (!number) return "";
    return new Intl.NumberFormat("en-US").format(number);
  };

  const handleAmountChange = (e) => {
    setAmount(formatCurrency(e.target.value));
  };

  const handleTransactionSubmit = async (e) => {
    e.preventDefault();

    const cleanAmount = parseFloat(amount.replace(/,/g, ""));
    if (isNaN(cleanAmount) || cleanAmount <= 0) {
      toast.error("Số tiền không hợp lệ");
      return;
    }

    try {
      // Convert datetime-local to ISO format for backend
      const createdAtISO = day
        ? new Date(day).toISOString()
        : new Date().toISOString();

      const itemData = {
        categoryID: id,
        amount: modalType === "deposit" ? cleanAmount : -cleanAmount,
        description: description || "",
        createdAt: createdAtISO,
      };

      console.log("📤 Sending item data:", itemData);

      if (isEdit && currentItem) {
        await itemService.updateItem(currentItem.id, itemData);
        toast.success("Cập nhật giao dịch thành công!");
      } else {
        await itemService.createItem(itemData);
        toast.success("Thêm giao dịch thành công!");
      }

      setShowModal(false);
      loadData();
    } catch (error) {
      console.error("Transaction error:", error);
      toast.error("Lưu giao dịch thất bại");
    }
  };

  const handleDeleteTransaction = async (itemId) => {
    if (!window.confirm("Bạn có chắc muốn xóa giao dịch này?")) return;

    try {
      await itemService.deleteItem(itemId);
      toast.success("Xóa giao dịch thành công!");
      loadData();
    } catch (error) {
      console.error("Delete transaction error:", error);
      toast.error("Không thể xóa giao dịch");
    }
  };

  if (loading || !saving) {
    return (
      <div style={{ textAlign: "center", color: "#666", marginTop: "50px" }}>
        Đang tải...
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#111",
        minHeight: "100vh",
        paddingBottom: "100px",
      }}
    >
      {/* Header Menu */}
      <div
        style={{
          textAlign: "right",
          padding: "10px 20px",
          backgroundColor: "#000",
        }}
      >
        <span
          onClick={() => navigate("/saving")}
          style={{ color: "#aaa", marginRight: "15px", cursor: "pointer" }}
        >
          ❮ Quay lại
        </span>
        {saving.status ? (
          <>
            <span
              onClick={() => navigate("/saving/add", { state: { saving } })}
              style={{ color: "#aaa", marginRight: "15px", cursor: "pointer" }}
            >
              🖊 Sửa
            </span>
            <span
              onClick={handleToggleStatus}
              style={{ color: "#aaa", cursor: "pointer" }}
            >
              🏁 Kết thúc
            </span>
          </>
        ) : (
          <>
            <span
              onClick={handleDelete}
              style={{ color: "#aaa", marginRight: "15px", cursor: "pointer" }}
            >
              🗑 Xóa
            </span>
            <span
              onClick={handleToggleStatus}
              style={{ color: "#aaa", cursor: "pointer" }}
            >
              🔄 Mở lại
            </span>
          </>
        )}
      </div>

      {/* Saving Info */}
      <div
        style={{
          padding: "20px",
          textAlign: "center",
          background: "#222",
          borderBottom: "1px solid #333",
        }}
      >
        <div style={{ fontSize: "18px" }}>{saving.name}</div>
        <div
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            color: "#ffcc00",
            margin: "10px 0",
          }}
        >
          {new Intl.NumberFormat("vi-VN").format(saving.savedAmount)} đ
        </div>
        <div style={{ color: "#888", fontSize: "14px" }}>
          Mục tiêu: {new Intl.NumberFormat("vi-VN").format(saving.limitAmount)}{" "}
          đ
        </div>
        <div style={{ color: "#888", fontSize: "14px" }}>
          Còn lại:{" "}
          {new Intl.NumberFormat("vi-VN").format(
            saving.limitAmount - saving.savedAmount,
          )}{" "}
          đ
        </div>
      </div>

      {/* Action Buttons */}
      {saving.status && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            padding: "20px",
            background: "#000",
          }}
        >
          <button
            onClick={() => openTransactionModal("deposit")}
            style={{
              background: "#333",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: "pointer",
              width: "45%",
            }}
          >
            <div style={{ fontSize: "20px", marginBottom: "5px" }}>📥</div>
            Gửi vào
          </button>
          <button
            onClick={() => openTransactionModal("withdraw")}
            style={{
              background: "#333",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: "pointer",
              width: "45%",
            }}
          >
            <div style={{ fontSize: "20px", marginBottom: "5px" }}>📤</div>
            Rút ra
          </button>
        </div>
      )}

      {/* Transactions List */}
      <div style={{ padding: "15px" }}>
        <h4 style={{ color: "#666", marginBottom: "10px" }}>
          Lịch sử giao dịch
        </h4>
        {transactions.length > 0 ? (
          transactions.map((item) => (
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
              <div>
                <div>{item.description || "Giao dịch"}</div>
                <div style={{ color: "#666", fontSize: "12px" }}>
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleString("vi-VN")
                    : ""}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "16px",
                    marginRight: "10px",
                    color: item.amount >= 0 ? "#00e676" : "#ff4d4d",
                  }}
                >
                  {item.amount >= 0 ? "+" : ""}
                  {new Intl.NumberFormat("vi-VN").format(item.amount)}
                </div>
                {saving.status && (
                  <button
                    onClick={() => openEditModal(item)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#666",
                      fontSize: "20px",
                      cursor: "pointer",
                    }}
                  >
                    ⋮
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: "center", color: "#666" }}>
            Chưa có giao dịch nào
          </div>
        )}
      </div>

      {/* Transaction Modal */}
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{
            display: "flex",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.8)",
            alignItems: "flex-end",
            justifyContent: "center",
            zIndex: 300,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#222",
              width: "100%",
              padding: "20px",
              paddingBottom: "100px",
              borderRadius: "20px 20px 0 0",
            }}
          >
            <h3>
              {isEdit
                ? "Chỉnh sửa giao dịch"
                : modalType === "deposit"
                  ? "Gửi tiền vào quỹ"
                  : "Rút tiền từ quỹ"}
            </h3>
            <form onSubmit={handleTransactionSubmit}>
              <input
                type="text"
                value={amount}
                onChange={handleAmountChange}
                placeholder="Nhập số tiền"
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom: "10px",
                  background: "#111",
                  border: "1px solid #333",
                  color: "white",
                  borderRadius: "8px",
                  boxSizing: "border-box",
                }}
              />
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ghi chú thêm"
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom: "10px",
                  background: "#111",
                  border: "1px solid #333",
                  color: "white",
                  borderRadius: "8px",
                  boxSizing: "border-box",
                }}
              />
              <input
                type="datetime-local"
                value={day}
                onChange={(e) => setDay(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom: "10px",
                  background: "#111",
                  border: "1px solid #333",
                  color: "white",
                  borderRadius: "8px",
                  boxSizing: "border-box",
                  colorScheme: "dark",
                }}
              />
              {isEdit && (
                <button
                  type="button"
                  onClick={() => handleDeleteTransaction(currentItem.id)}
                  style={{
                    width: "100%",
                    padding: "15px",
                    borderRadius: "8px",
                    border: "none",
                    fontWeight: "bold",
                    cursor: "pointer",
                    background: "#ff4d4d",
                    color: "white",
                    marginBottom: "10px",
                  }}
                >
                  XÓA GIAO DỊCH
                </button>
              )}
              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "15px",
                  borderRadius: "8px",
                  border: "none",
                  fontWeight: "bold",
                  cursor: "pointer",
                  background: isEdit
                    ? "#ffcc00"
                    : modalType === "deposit"
                      ? "#00e676"
                      : "#ff4d4d",
                  color: isEdit ? "black" : "white",
                }}
              >
                {isEdit
                  ? "CẬP NHẬT"
                  : modalType === "deposit"
                    ? "GỬI VÀO"
                    : "RÚT RA"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavingDetail;
