# Expense Management System

A full-stack personal expense management application built with ASP.NET Core Web API and React.

## 📋 Overview

This project is a comprehensive expense tracking system that allows users to manage their personal finances, categorize expenses, track income/expense transactions, and generate financial reports. It features secure authentication (JWT), role-based access control, and a modern responsive UI.

## 📁 Project Structure

```
qlct-expense-management/
├── backend/           # ASP.NET Core 10 Web API
└── frontend/          # React + Vite UI
```

## 🚀 Tech Stack

### Backend
- **ASP.NET Core Web API** (.NET 10)
- **C#**
- **Entity Framework Core** (ORM)
- **Pomelo EntityFrameworkCore MySql** (MySQL Database provider)
- **Mapster** (Object Mapping)
- **JWT Bearer Authentication**
- **BCrypt.Net-Next** (Password Hashing compatible with previous Spring Boot data)

### Frontend

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Routing**: React Router
- **State Management**: React Hooks

## ✨ Features

### Core Functionality

- ✅ User registration and authentication
- ✅ JWT-based authentication with refresh token mechanism
- ✅ Category management (Income/Expense)
- ✅ Transaction tracking with detailed records
- ✅ Financial reports and statistics
- ✅ Savings goal tracking
- ✅ Admin panel for user management
- ✅ Role-based access control (USER/ADMIN)
- ✅ Responsive UI with mobile support

### Security Features

- Password encryption using BCrypt
- JWT token-based authentication
- Automatic token refresh
- Protected routes and endpoints
- Input validation and sanitization

### Performance Optimization

- **Database Indexing**: Strategic indexes on frequently queried columns
  - Single-column indexes: `user_id`, `category_id`, `created_at`
  - Composite indexes: `(user_id, created_at)`, `(user_id, category_id, created_at)`
  - Performance improvement: ~1000x faster queries on large datasets
- **Query Optimization**: Custom JPA queries for complex operations
- **Batch Processing**: Hibernate batch inserts with batch_size=50
- See detailed documentation in [backend/DATABASE_INDEXING_GUIDE.md](backend/DATABASE_INDEXING_GUIDE.md)

## 🛠️ Installation & Setup

### Prerequisites

- .NET 10 SDK
- Node.js 16 or higher
- MySQL 8.0
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**

```bash
cd backend
```

2. **Create MySQL database**

```sql
CREATE DATABASE expense_manager2;
```

3. **Configure application settings**

Configure `appsettings.json` or `appsettings.Development.json` with your settings:
   - Database connection string
   - JWT secret key

4. **Run the backend**

```bash
dotnet run
```

Backend will be available at: `http://localhost:5033`

### Frontend Setup

1. **Navigate to frontend directory**

```bash
cd frontend
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

```bash
cp .env.example .env
```

4. **Start development server**

```bash
npm run dev
```

Frontend will be available at: `http://localhost:5173`

## 🔐 Security Notes

⚠️ **IMPORTANT**:

- `backend/appsettings.json` contains sensitive data and should be excluded from version control if needed
- `frontend/.env` contains environment-specific configuration and should not be committed
- Always generate a new JWT secret key for production environments
- Never commit real credentials or API keys

## ðŸ—ï¸ Architecture

### Backend Architecture

- **Controller Layer**: RESTful API endpoints
- **Service Layer**: Business logic implementation
- **Repository Layer**: Database access with Entity Framework Core
- **Security Layer**: JWT authentication and authorization
- **Exception Handling**: Global exception handler with custom HTTP responses

### Frontend Architecture

- **Component-based**: Reusable React components
- **Service Layer**: API integration with Axios
- **Protected Routes**: Authentication-based routing
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## 🧪 Testing

### Backend Tests

```bash
cd backend
dotnet test
```

### Frontend Tests

```bash
cd frontend
npm run test
```

## 📦 Production Build

### Backend

```bash
cd backend
dotnet publish -c Release -o out
dotnet out/QLCT.dll
```

### Frontend

```bash
cd frontend
npm run build
# Build output will be in dist/ directory
```

## 🌐 API Documentation

API endpoints are organized as follows:

- `/auth/**` - Authentication endpoints (login, register, refresh token)
- `/api/categories/**` - Category management
- `/api/items/**` - Transaction management
- `/api/savings/**` - Savings management
- `/api/admin/**` - Admin operations
- `/api/users/**` - User profile management

## 📝 Future Enhancements

- 🔄 Dashboard with advanced analytics and charts
- 🔄 Export reports to PDF/Excel
- 🔄 Email notifications for budget limits
- 🔄 Budget planning and forecasting
- 🔄 Multi-currency support
- 🔄 Recurring transactions

## 👨‍💻 Author

This project was developed for learning purposes and as part of my portfolio for Java Backend / Full-stack internship applications.

**Contact:**

- GitHub: [@grayzy2617](https://github.com/grayzy2617)
- Email: phat058zz@gmail.com
- LinkedIn: [Phat Tran](https://www.linkedin.com/in/phat-tran-553585365)

## 📄 License

This project is for educational and portfolio purposes only.
