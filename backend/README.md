# QLCT Backend - Expense Management System

Spring Boot REST API for personal expense management with JWT authentication and optimized database performance.

## 📋 Overview

This is the backend service for the QLCT Expense Management System. It provides a RESTful API with secure authentication, comprehensive expense tracking, and optimized database queries using strategic indexing.

## 🚀 Technology Stack

### Core Framework

- **Spring Boot 3.x** - Main application framework
- **Spring Data JPA** - ORM and database abstraction
- **Hibernate** - JPA implementation
- **Maven** - Build and dependency management

### Security

- **Spring Security** - Security framework
- **JWT (JSON Web Tokens)** - Stateless authentication
- **BCrypt** - Password hashing

### Database

- **MySQL 8.0** - Primary database
- **Strategic Indexing** - Performance optimization (see [DATABASE_INDEXING_GUIDE.md](DATABASE_INDEXING_GUIDE.md))

### Additional Libraries

- **Lombok** - Reduce boilerplate code
- **MapStruct** - Object mapping
- **Validation API** - Input validation

## 🏗️ Architecture

### Project Structure

```
src/
├── main/
│   ├── java/com/
│   │   ├── config/             # Security, JWT, Web configurations
│   │   ├── controller/         # REST API endpoints
│   │   ├── dto/                # Data Transfer Objects
│   │   ├── entity/             # JPA Entities
│   │   ├── exception/          # Exception handling
│   │   ├── mapper/             # DTO-Entity mappers
│   │   ├── repository/         # Data access layer
│   │   ├── service/            # Business logic
│   │   └── validator/          # Custom validators
│   └── resources/
│       ├── application.properties.example
│       └── application.properties (gitignored)
└── test/                       # Unit and integration tests
```

### Layer Architecture

```
Controller → Service → Repository → Database
     ↓          ↓
    DTO    →  Entity
```

## ✨ Key Features

### Authentication & Authorization

- JWT-based authentication with access and refresh tokens
- Automatic token refresh mechanism
- Role-based access control (USER, ADMIN)
- Secure password storage with BCrypt

### Core Functionality

- **User Management**: Registration, profile updates, password changes
- **Category Management**: Create and organize expense/income categories
- **Transaction Tracking**: Record and manage financial transactions
- **Savings Goals**: Set and track savings targets
- **Financial Reports**: Generate statistics and summaries
- **Admin Panel**: User management and system administration

### Performance Optimization

- **Database Indexing**: Strategic indexes on frequently queried columns
  - Single-column indexes: `user_id`, `category_id`, `created_at`
  - Composite indexes: `(user_id, created_at)`, `(user_id, category_id, created_at)`
  - See detailed performance results in [indexing-performance-results.docx](indexing-performance-results.docx)
- **Query Optimization**: Custom queries for complex operations
- **Batch Processing**: Hibernate batch inserts for bulk operations

## 🛠️ Installation & Setup

### Prerequisites

- Java 17 or higher
- MySQL 8.0 or higher
- Maven 3.6+

### Step 1: Database Setup

Create the database:

```sql
CREATE DATABASE expense_manager2;
```

### Step 2: Application Configuration

1. Copy the example configuration:

```bash
cp src/main/resources/application.properties.example src/main/resources/application.properties
```

2. Edit `application.properties` with your settings:

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/expense_manager2
spring.datasource.username=your_username
spring.datasource.password=your_password

# JWT Configuration - Generate new secret key
jwt.signerKey=your_secret_key_here_minimum_256_bits
jwt.expirationInMs=3600000          # 1 hour
jwt.refreshExpirationInMs=604800000 # 7 days

# Admin Account
spring.security.user.name=admin
spring.security.user.password=your_secure_password

# Security
security.password.encoder.strength=10
```

### Step 3: Generate JWT Secret Key

Generate a secure JWT key:

```bash
openssl rand -base64 64
```

### Step 4: Run the Application

```bash
# Using Maven
mvn spring-boot:run

# Or build and run JAR
mvn clean package
java -jar target/QLCT-0.0.1-SNAPSHOT.jar
```

The API will be available at: `http://localhost:8080`

## 🌐 API Endpoints

### Authentication

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh access token
- `POST /auth/introspect` - Validate token

### User Management

- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile
- `PUT /api/users/password` - Change password

### Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/{id}` - Get category by ID
- `POST /api/categories` - Create new category
- `PUT /api/categories/{id}` - Update category
- `DELETE /api/categories/{id}` - Delete category
- `GET /api/categories/by-type` - Filter by type and date range

### Transactions (Items)

- `GET /api/items` - Get all items
- `GET /api/items/{id}` - Get item by ID
- `POST /api/items` - Create new item
- `PUT /api/items/{id}` - Update item
- `DELETE /api/items/{id}` - Delete item
- `GET /api/items/by-range` - Filter by date range
- `GET /api/items/by-category` - Filter by category and date

### Savings

- `GET /api/savings` - Get all savings goals
- `POST /api/savings` - Create savings goal
- `PUT /api/savings/{id}` - Update savings goal
- `DELETE /api/savings/{id}` - Delete savings goal

### Admin (ADMIN role required)

- `GET /api/admin/users` - List all users
- `GET /api/admin/users/{id}` - Get user details
- `PUT /api/admin/users/{id}/role` - Update user role
- `DELETE /api/admin/users/{id}` - Delete user

## 🔒 Security Features

### JWT Implementation

- **Access Token**: Short-lived (1 hour) for API authentication
- **Refresh Token**: Long-lived (7 days) for obtaining new access tokens
- **Token Invalidation**: Logout mechanism with token blacklist

### Password Security

- BCrypt hashing with configurable strength (default: 10)
- Password validation rules
- Secure password change flow

### API Security

- CORS configuration for frontend integration
- CSRF protection disabled for stateless JWT
- Protected endpoints with method-level security
- Input validation and sanitization

## 📊 Database Schema

### Main Tables

- `users` - User accounts with roles
- `roles` - User roles (USER, ADMIN)
- `categories` - Expense/Income categories
- `items` - Financial transactions
- `savings` - Savings goals
- `invalidate_tokens` - Blacklisted JWT tokens

### Indexes (Performance Optimization)

See [DATABASE_INDEXING_GUIDE.md](DATABASE_INDEXING_GUIDE.md) for detailed information about:

- Index strategy and rationale
- Performance benchmarks
- Query optimization examples
- Before/after comparison results

**Key Performance Improvements:**

- Items query by user: **~1000x faster** with indexing
- Date range queries: **Significant speedup** for large datasets
- Composite queries: **Optimized** for real-world usage patterns

## 🧪 Testing

Run unit tests:

```bash
mvn test
```

Run with coverage:

```bash
mvn test jacoco:report
```

Coverage report will be in: `target/site/jacoco/index.html`

## 📦 Build for Production

### Build JAR file

```bash
mvn clean package -DskipTests
```

### Run production build

```bash
java -jar target/QLCT-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
```

### Docker Support (Optional)

```dockerfile
FROM openjdk:17-jdk-slim
COPY target/QLCT-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```

## 🔧 Configuration Options

### Database Connection Pool

```properties
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=30000
```

### JPA/Hibernate

```properties
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
spring.jpa.properties.hibernate.jdbc.batch_size=50
spring.jpa.properties.hibernate.order_inserts=true
```

### Logging

```properties
logging.level.com=DEBUG
logging.level.org.springframework.security=DEBUG
```

## 📚 Additional Documentation

- [DATABASE_INDEXING_GUIDE.md](DATABASE_INDEXING_GUIDE.md) - Comprehensive database indexing guide
- [QUICK_START_ADMIN.md](QUICK_START_ADMIN.md) - Admin features quick start
- [README_ADMIN_FEATURE.md](README_ADMIN_FEATURE.md) - Admin functionality details
- [indexing-performance-results.docx](indexing-performance-results.docx) - Performance benchmark results

## 🐛 Troubleshooting

### Common Issues

**Database Connection Failed**

- Check MySQL is running: `systemctl status mysql`
- Verify credentials in `application.properties`
- Ensure database exists: `CREATE DATABASE expense_manager2;`

**JWT Token Errors**

- Ensure JWT secret key is properly set (minimum 256 bits)
- Check token expiration times
- Verify CORS configuration for frontend

**Port Already in Use**

- Change port: `server.port=8081` in application.properties
- Or kill process: `netstat -ano | findstr :8080` then `taskkill /PID <pid> /F`

## 📞 Contact & Support

For questions or issues related to this backend service:

- Check existing documentation files
- Review API endpoint documentation
- Examine database indexing guide for performance issues

---

**Note**: This is a learning project developed for internship applications. It demonstrates:

- RESTful API design
- Spring Boot best practices
- Security implementation with JWT
- Database optimization techniques
- Clean architecture principles
