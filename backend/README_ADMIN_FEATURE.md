# 🚀 HƯỚNG DẪN CHẠY ADMIN FEATURE

## 📋 TỔNG QUAN

Dự án đã được thêm chức năng Admin với phân quyền RBAC (Role-Based Access Control):

- **ROLE_USER**: Người dùng thông thường
- **ROLE_ADMIN**: Quản trị viên hệ thống

---

## 🔧 CÀI ĐẶT & CHẠY

### **Bước 1: Chạy SQL Migration Script**

#### Option 1: Thực thi SQL file trực tiếp

```bash
# Đăng nhập MySQL
mysql -u root -p

# Chọn database
USE expense_manager2;

# Chạy migration script
SOURCE E:/5rd_semester/SpringBoot/QLCT/migration_add_roles.sql
```

#### Option 2: Copy-paste vào MySQL Workbench

1. Mở file `QLCT/migration_add_roles.sql`
2. Copy toàn bộ nội dung
3. Paste vào MySQL Workbench
4. Execute

**Kết quả mong đợi:**

```
username | roles
---------|------------------
admin    | ROLE_ADMIN, ROLE_USER
john_doe | ROLE_USER
...
```

---

### **Bước 2: Cài đặt package cho Frontend**

```bash
cd E:/5rd_semester/SpringBoot/QLCT_FE/my-frontend

# Cài jwt-decode để decode token
npm install jwt-decode
```

---

### **Bước 3: Start Backend**

```bash
cd E:/5rd_semester/SpringBoot/QLCT

# Chạy Spring Boot
mvn spring-boot:run

# Hoặc nếu dùng IDE, chạy main class
```

**Log mong đợi khi khởi động:**

```
✅ Roles initialized: ROLE_USER, ROLE_ADMIN
🔐 Created default admin user with username 'admin' and password 'Admin123@'
⚠️ PLEASE CHANGE THIS PASSWORD IN PRODUCTION!
```

---

### **Bước 4: Start Frontend**

```bash
cd E:/5rd_semester/SpringBoot/QLCT_FE/my-frontend

npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`

---

## 🧪 KIỂM TRA CHỨC NĂNG

### **Test 1: Login với Admin**

1. Truy cập: `http://localhost:5173/login`
2. Login với:
   - Username: `admin`
   - Password: `Admin123@`
3. **Kết quả mong đợi:**
   - Menu footer xuất hiện icon 👑 (Admin)
   - Click vào icon Admin → Chuyển tới `/admin/users`

### **Test 2: Login với User thường**

1. Register user mới hoặc login user khác
2. **Kết quả mong đợi:**
   - Menu footer KHÔNG có icon 👑
   - Nếu cố truy cập `/admin/users` → 403 Forbidden

### **Test 3: API Admin - Danh sách Users**

```bash
# Lấy token sau khi login admin
TOKEN="your_admin_token_here"

# Test API
curl -X GET http://localhost:8080/admin/users \
  -H "Authorization: Bearer $TOKEN"
```

**Response mong đợi:**

```json
{
  "code": 1000,
  "message": "Lấy danh sách người dùng thành công",
  "data": [
    {
      "userId": "123-abc",
      "username": "john_doe",
      "createdAt": "2026-01-15T10:30:00",
      "totalCategories": 5,
      "totalItems": 123,
      "totalSavings": 2
    }
  ]
}
```

### **Test 4: API Admin - Chi tiết User**

```bash
curl -X GET http://localhost:8080/admin/users/123-abc \
  -H "Authorization: Bearer $TOKEN"
```

**Response mong đợi:**

```json
{
  "code": 1000,
  "message": "Lấy chi tiết người dùng thành công",
  "data": {
    "userId": "123-abc",
    "username": "john_doe",
    "createdAt": "2026-01-15T10:30:00",
    "roles": ["ROLE_USER"],
    "statistics": {
      "totalCategories": 5,
      "totalItems": 123,
      "totalSavings": 2,
      "totalIncome": 5000000.0,
      "totalExpense": 3500000.0,
      "balance": 1500000.0
    }
  }
}
```

### **Test 5: Authorization - User không thể truy cập Admin API**

```bash
# Login với user thường → lấy token
USER_TOKEN="user_token_here"

# Try to access admin API
curl -X GET http://localhost:8080/admin/users \
  -H "Authorization: Bearer $USER_TOKEN"
```

**Response mong đợi:**

```json
{
  "code": 1004,
  "message": "Bạn không có quyền thực hiện hành động này"
}
```

---

## 🎨 UI ADMIN

### **Trang 1: User Management** (`/admin/users`)

- Hiển thị bảng danh sách tất cả users
- Thống kê: Tổng số users
- Search box: Tìm kiếm theo username
- Mỗi row hiển thị:
  - Avatar với chữ cái đầu
  - Username
  - Ngày tạo
  - Số categories, items, savings
  - Button "Xem chi tiết"

### **Trang 2: User Detail** (`/admin/users/:userId`)

- Avatar và username
- Badge roles (ADMIN / USER)
- 6 cards thống kê:
  - 📈 Total Income (màu xanh lá)
  - 📉 Total Expense (màu đỏ)
  - 💰 Balance (màu xanh/cam)
  - 📁 Total Categories
  - 📄 Total Items
  - 🐷 Total Savings
- Phần "Tóm tắt hoạt động":
  - Tỷ lệ chi tiêu/thu nhập
  - Trung bình giao dịch
  - Giao dịch/category

---

## 📂 CẤU TRÚC FILE MỚI

### **Backend:**

```
QLCT/
├── src/main/java/com/
│   ├── entity/
│   │   ├── RoleEntity.java ✅ NEW
│   │   └── UserEntity.java ✅ UPDATED (thêm roles)
│   ├── repository/
│   │   ├── RoleRepository.java ✅ NEW
│   │   ├── CategoryRepository.java ✅ UPDATED
│   │   ├── ItemRepository.java ✅ UPDATED
│   │   └── SavingRepository.java ✅ UPDATED
│   ├── dto/admin/ ✅ NEW
│   │   └── response/
│   │       ├── UserListItemResponse.java
│   │       ├── UserDetailResponse.java
│   │       └── UserStatistics.java
│   ├── service/
│   │   ├── AdminService.java ✅ NEW
│   │   ├── UserService.java ✅ UPDATED
│   │   └── AuthenticationService.java ✅ UPDATED (thêm roles vào JWT)
│   ├── controller/
│   │   └── AdminController.java ✅ NEW
│   └── config/
│       ├── ApplicationInitConfig.java ✅ UPDATED
│       └── CustomJwtDecoder.java ✅ UPDATED
└── migration_add_roles.sql ✅ NEW
```

### **Frontend:**

```
QLCT_FE/my-frontend/src/
├── pages/Admin/ ✅ NEW
│   ├── UserManagement.jsx
│   └── UserDetail.jsx
├── components/
│   └── MenuFooter.jsx ✅ UPDATED (thêm Admin menu)
└── App.jsx ✅ UPDATED (thêm admin routes)
```

---

## 🔐 BẢO MẬT

### **Backend Security:**

- ✅ JWT chứa roles trong claim `scope`
- ✅ `@PreAuthorize("hasRole('ADMIN')")` trên AdminController
- ✅ Spring Security tự động convert scope → authorities
- ✅ Ownership validation giữ nguyên ở tất cả endpoints khác

### **Frontend Security:**

- ✅ Admin menu chỉ hiện với ROLE_ADMIN (decode JWT)
- ✅ Redirect về trang chủ nếu 403 Forbidden
- ✅ Toast error message khi unauthorized

---

## 🎯 DEMO CHO NHÀ PHỎNG VẤN

### **Scenario 1: Phân quyền cơ bản**

```
1. Login với admin → Thấy menu Admin 👑
2. Login với user → KHÔNG thấy menu Admin
3. Admin có thể xem danh sách users
4. User không thể truy cập /admin/users (403)
```

### **Scenario 2: Thống kê user**

```
1. Admin click vào user "john_doe"
2. Xem được:
   - Tổng thu nhập: 5,000,000 VND
   - Tổng chi tiêu: 3,500,000 VND
   - Số dư: 1,500,000 VND
   - 5 categories, 123 items, 2 savings
3. Các thống kê này được tính real-time từ DB
```

### **Scenario 3: Security**

```
Interviewer: "User A có thể xem data của User B không?"
You: "Không, vì:
      1. Ownership validation ở tất cả endpoints
      2. Admin chỉ có thể VIEW, không thể EDIT user data
      3. JWT chứa roles, Spring Security verify tự động"
```

---

## 🐛 TROUBLESHOOTING

### **Lỗi: Admin menu không hiện**

```bash
# Check token có roles không
1. F12 → Application → Local Storage → token
2. Paste vào https://jwt.io
3. Xem claim "scope" có "ROLE_ADMIN" không?
```

### **Lỗi: 403 Forbidden khi call API**

```bash
# Check token có hợp lệ không
curl -X POST http://localhost:8080/auth/introspect \
  -H "Content-Type: application/json" \
  -d '{"token": "your_token"}'

# Response phải là: {"active": true}
```

### **Lỗi: npm install jwt-decode fails**

```bash
npm install jwt-decode --legacy-peer-deps
```

---

## ✅ CHECKLIST HOÀN THÀNH

- [x] Tạo Entity RoleEntity
- [x] Cập nhật UserEntity với roles (ManyToMany)
- [x] Tạo RoleRepository
- [x] Tạo AdminService với 2 methods
- [x] Tạo AdminController với @PreAuthorize
- [x] Cập nhật ApplicationInitConfig (tạo roles, assign cho admin)
- [x] Cập nhật UserService (assign ROLE_USER khi register)
- [x] Cập nhật AuthenticationService (thêm roles vào JWT)
- [x] Cập nhật Repository methods (countByUser_Id, getSumByUserAndType)
- [x] Tạo UI UserManagement.jsx
- [x] Tạo UI UserDetail.jsx
- [x] Cập nhật MenuFooter.jsx (Admin button)
- [x] Cập nhật App.jsx (Admin routes)
- [x] Tạo SQL migration script
- [x] Viết README.md chi tiết

---

## 📞 SUPPORT

Nếu gặp lỗi, check:

1. Backend log: `mvn spring-boot:run`
2. Frontend console: F12
3. Database: Chạy lại migration script
4. Token: Verify tại jwt.io

---

**🎉 CHÚC BẠN DEMO THÀNH CÔNG!**
