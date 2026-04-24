# 🎯 ADMIN FEATURE - QUICK START GUIDE

## ⚡ CHẠY NGAY (3 BƯỚC)

### 1️⃣ Chạy SQL Migration

```bash
mysql -u root -p
USE expense_manager2;
SOURCE E:/5rd_semester/SpringBoot/QLCT/migration_add_roles.sql
```

### 2️⃣ Install Frontend Package

```bash
cd E:/5rd_semester/SpringBoot/QLCT_FE/my-frontend
npm install jwt-decode
```

### 3️⃣ Start Application

```bash
# Terminal 1: Backend
cd E:/5rd_semester/SpringBoot/QLCT
mvn spring-boot:run

# Terminal 2: Frontend
cd E:/5rd_semester/SpringBoot/QLCT_FE/my-frontend
npm run dev
```

---

## 🧪 TEST NGAY

1. **Login Admin:**
   - URL: `http://localhost:5173/login`
   - Username: `admin`
   - Password: `Admin123@`
   - ✅ Thấy icon 👑 ở menu footer

2. **Click Admin Menu:**
   - Click icon 👑 → Xem danh sách users
   - Click "Xem chi tiết" → Xem statistics user

3. **Test Authorization:**
   - Login user thường → KHÔNG thấy icon 👑
   - Try access `/admin/users` → 403 Forbidden

---

## 📋 CHỨC NĂNG ĐÃ IMPLEMENT

### Backend (Java Spring Boot):

✅ RoleEntity + UserEntity (ManyToMany)  
✅ AdminController với @PreAuthorize("hasRole('ADMIN')")  
✅ AdminService (getAllUsers, getUserDetail)  
✅ JWT chứa roles trong claim "scope"  
✅ Repository methods (countByUser_Id, getSumByUserAndType)  
✅ Auto assign ROLE_USER khi register  
✅ Auto assign ROLE_ADMIN cho user "admin"

### Frontend (React):

✅ UserManagement page (danh sách users)  
✅ UserDetail page (statistics chi tiết)  
✅ Admin menu button (chỉ hiện với ROLE_ADMIN)  
✅ Authorization check (redirect khi 403)

### Database:

✅ Bảng `roles` (ROLE_USER, ROLE_ADMIN)  
✅ Bảng `user_roles` (junction table)  
✅ Migration script với rollback

---

## 🎨 UI PREVIEW

**UserManagement:**

```
┌─────────────────────────────────────┐
│ 👑 Quản lý người dùng               │
├─────────────────────────────────────┤
│ [Search Box]                        │
├─────────────────────────────────────┤
│ Username  │ Ngày tạo │ Stats │ ••• │
│ john_doe  │ 15/01    │  5 3 2│ ▶  │
│ jane_doe  │ 20/01    │  3 2 1│ ▶  │
└─────────────────────────────────────┘
```

**UserDetail:**

```
┌─────────────────────────────────────┐
│ 🙍 john_doe      [ROLE_USER]        │
├─────────────────────────────────────┤
│ 📈 5,000,000 │ 📉 3,500,000 │ 💰 1.5M│
│ 📁 5 cats    │ 📄 123 items│ 🐷 2   │
└─────────────────────────────────────┘
```

---

## 🔐 SECURITY HIGHLIGHTS

✅ **Authentication:** JWT với roles  
✅ **Authorization:** @PreAuthorize check ROLE_ADMIN  
✅ **Ownership:** Mỗi user chỉ xem data của mình  
✅ **Admin Privilege:** Admin xem được data all users (READ-ONLY)

---

## 📖 CHI TIẾT ĐẦY ĐỦ

Xem file: `README_ADMIN_FEATURE.md`

---

**🚀 SẴN SÀNG DEMO!**
