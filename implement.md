## Plan: Spring Boot to .NET 10 Migration

Mục tiêu: Chuyển đổi backend quản lý chi tiêu từ Java (Spring Boot) sang C# (.NET 10), kết nối với CSDL MySQL hiện tại và giữ nguyên toàn bộ dữ liệu. Thể hiện kiến trúc Controller - Service - Repository.

**Phase 1: Project Setup & Cleanup**
- [ ] 1.1 Sao lưu dữ liệu tài liệu (`README.md`, `*.md`, `*.sql`) trong thư mục `backend/`.
- [ ] 1.2 Xóa các file mã nguồn Java, Maven (`src/`, `pom.xml`, `mvnw`, `mvnw.cmd`, `.iml`, `target/`).
- [ ] 1.3 Khởi tạo project .NET 10 dạng Web API vối lệnh `dotnet new webapi -n QLCT -o .` ngay tại thư mục `backend/`.
- [ ] 1.4 Cài đặt các NuGet packages cần thiết:
  - `Pomelo.EntityFrameworkCore.MySql` (Tương tác với MySQL)
  - `Microsoft.EntityFrameworkCore.Tools` (Cấu hình Model cho DbContext)
  - `Mapster` (Mapping Object/DTO giống MapStruct)
  - `Microsoft.AspNetCore.Authentication.JwtBearer` (Thay thế Spring Security)
  - `BCrypt.Net-Next` (Check mật khẩu cũ bằng BCrypt của PwEncoder)

**Phase 2: Database Configuration (MySQL)**
- [ ] 2.1 Cấu hình chuỗi kết nối (Connection String) MySQL trong file `appsettings.json`.
- [ ] 2.2 Tạo thư mục `Entities/` và định nghĩa model C# (User, Role, Category, Item, Note...) tương ứng chuẩn 1-1 với schema hiện tại (dùng Table/Column Attributes hoặc Fluent API để không bị lệch tên bảng so với Java JPA).
- [ ] 2.3 Khởi tạo file `Data/AppDbContext.cs` (Kế thừa DbContext) và khai báo các `DbSet`. Đảm bảo không map sai để tránh ghi đè dữ liệu (Dùng EF Code First ánh xạ Data có sẵn).

**Phase 3: DTOs & Mapping (Mapster)**
- [ ] 3.1 Gộp và tạo thư mục `DTOs/` (Requests, Responses). Chuyển dịch từ `com/dto/` cũ.
- [ ] 3.2 Khởi tạo cấu hình Mapping của Mapster ở mức global (Ví dụ file `MappingConfig.cs`).

**Phase 4: Repositories (Data Access Layer)**
- [ ] 4.1 Tạo thư mục `Repositories/`.
- [ ] 4.2 Viết interface `IUserRepository`, `ICategoryRepository`, `IItemRepository`...
- [ ] 4.3 Implement các interface này với thao tác truy vấn bằng LINQ tới CSDL MySQL.

**Phase 5: Services (Business Logic Layer)**
- [ ] 5.1 Tạo thư mục `Services/`.
- [ ] 5.2 Viết `IAuthService` & `AuthService` thay thế CustomJwtDecoder, PwEncoder, tích hợp validate BCrypt cho dữ liệu user hiện tại.
- [ ] 5.3 Implement `CategoryService`, `ItemService`, `AdminService` với Data Validation bằng C# logic. Xử lý lỗi ném ra tương tự như `exception/` trong Java cũ.

**Phase 6: Controllers & Authentication (API Layer)**
- [ ] 6.1 Gắn dịch vụ `AddAuthentication` (JwtBearer) và `AddAuthorization` trong `Program.cs`.
- [ ] 6.2 Định nghĩa filter phân quyền JWT `[Authorize(Roles = "...")]` tương đương với SecurityConfig cũ.
- [ ] 6.3 Tạo các endpoints trong `Controllers/` (`AuthController`, `CategoryController`, `ItemController`, `AdminController`).
- [ ] 6.4 Chuyển đổi Data Annotations trên DTOs (thay cho `@Valid`/`@NotNull`).

**Phase 7: Finalization, Integration & Verification**
- [ ] 7.1 Đăng ký vòng đời `IoC / Dependency Injection` (`builder.Services.AddScoped...`) trong `Program.cs`.
- [ ] 7.2 Cấu hình CORS để cho phép frontend Vite (React) gọi API từ port mới.
- [ ] 7.3 [Verification] Chạy file `dotnet run` (hoặc `dotnet watch run`).
- [ ] 7.4 [Verification] Bật app frontend React và gọi thông flow từ: Login -> Lấy Token -> Xem thống kê (Report) / Tính tiền gốc (Item/Category).

**Relevant files**
- Khu vực thao tác: thư mục [backend/](backend).
- Các file cấu hình middleware pipeline, builder .NET chính sẽ được gom lại tại [backend/Program.cs](backend/Program.cs).

**Decisions**
- Vẫn dùng CSDL MySQL hiện tại. Sẽ ánh xạ Entity Framework (*Code First theo DB có sẵn*) chính xác tên cột (column names) để không sinh ra bảng rác.
- Mật khẩu: sử dụng `BCrypt.Net-Next` verify để đảm bảo user hiện tại (Java mã hóa bằng `BCryptPasswordEncoder`) vẫn có thể login, không yêu cầu đổi mật khẩu.