import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  User,
  Calendar,
  Shield,
  TrendingUp,
  TrendingDown,
  Wallet,
  FolderOpen,
  FileText,
  PiggyBank,
} from "lucide-react";

const UserDetail = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userDetail, setUserDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserDetail();
  }, [userId]);

  const fetchUserDetail = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8080/admin/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.code === 1000) {
        setUserDetail(response.data.data);
      }
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error("Bạn không có quyền truy cập");
        navigate("/admin/users");
      } else {
        toast.error("Lỗi khi tải thông tin người dùng");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!userDetail) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Không tìm thấy thông tin người dùng</p>
      </div>
    );
  }

  const { username, createdAt, roles, statistics } = userDetail;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/admin/users")}
          className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 hover:text-blue-600 rounded-xl shadow-sm hover:shadow-md mb-6 transition-all border border-gray-200 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Quay lại danh sách</span>
        </button>

        {/* User Info Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border border-gray-100">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-semibold">
                {username.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {username}
                </h1>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Tham gia: {new Date(createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              </div>
            </div>

            {/* Roles Badge */}
            <div className="flex flex-wrap gap-2">
              {roles.map((role, index) => (
                <span
                  key={index}
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                    role === "ROLE_ADMIN"
                      ? "bg-red-100 text-red-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  {role === "ROLE_ADMIN" ? "Admin" : "User"}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {/* Total Income */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm font-medium text-green-600">
                Thu nhập
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {formatCurrency(statistics.totalIncome)}
            </p>
            <p className="text-sm text-gray-500">Tổng thu nhập</p>
          </div>

          {/* Total Expense */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-sm font-medium text-red-600">Chi tiêu</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {formatCurrency(statistics.totalExpense)}
            </p>
            <p className="text-sm text-gray-500">Tổng chi tiêu</p>
          </div>

          {/* Balance */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div
                className={`p-3 rounded-lg ${
                  statistics.balance >= 0 ? "bg-blue-100" : "bg-orange-100"
                }`}
              >
                <Wallet
                  className={`w-6 h-6 ${
                    statistics.balance >= 0
                      ? "text-blue-600"
                      : "text-orange-600"
                  }`}
                />
              </div>
              <span
                className={`text-sm font-medium ${
                  statistics.balance >= 0 ? "text-blue-600" : "text-orange-600"
                }`}
              >
                Số dư
              </span>
            </div>
            <p
              className={`text-2xl font-bold mb-1 ${
                statistics.balance >= 0 ? "text-gray-900" : "text-orange-600"
              }`}
            >
              {formatCurrency(statistics.balance)}
            </p>
            <p className="text-sm text-gray-500">Số dư hiện tại</p>
          </div>

          {/* Categories */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FolderOpen className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-purple-600">
                Danh mục
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {statistics.totalCategories}
            </p>
            <p className="text-sm text-gray-500">Tổng danh mục</p>
          </div>

          {/* Items */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FileText className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-sm font-medium text-yellow-600">
                Giao dịch
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {statistics.totalItems}
            </p>
            <p className="text-sm text-gray-500">Tổng giao dịch</p>
          </div>

          {/* Savings */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <PiggyBank className="w-6 h-6 text-indigo-600" />
              </div>
              <span className="text-sm font-medium text-indigo-600">
                Tiết kiệm
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {statistics.totalSavings}
            </p>
            <p className="text-sm text-gray-500">Mục tiêu tiết kiệm</p>
          </div>
        </div>

        {/* Activity Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Tóm tắt hoạt động
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Tỷ lệ chi tiêu / thu nhập</span>
              <span className="font-semibold text-gray-900">
                {statistics.totalIncome > 0
                  ? (
                      (statistics.totalExpense / statistics.totalIncome) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Trung bình giao dịch</span>
              <span className="font-semibold text-gray-900">
                {formatCurrency(
                  statistics.totalItems > 0
                    ? (statistics.totalIncome + statistics.totalExpense) /
                        statistics.totalItems
                    : 0,
                )}
              </span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-600">
                Giao dịch trung bình mỗi danh mục
              </span>
              <span className="font-semibold text-gray-900">
                {statistics.totalCategories > 0
                  ? (
                      statistics.totalItems / statistics.totalCategories
                    ).toFixed(1)
                  : 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
