using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using QLCT.DTOs;
using QLCT.Services;

namespace QLCT.Controllers
{
    [ApiController]
    [Route("admin")]
    [Authorize(Roles = "ADMIN")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;
        private readonly ILogger<AdminController> _logger;

        public AdminController(IAdminService adminService, ILogger<AdminController> logger)
        {
            _adminService = adminService;
            _logger = logger;
        }

        /// <summary>
        /// API: Lấy danh sách tất cả người dùng
        /// Chỉ ADMIN mới có quyền truy cập
        /// </summary>
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            _logger.LogInformation("[ADMIN API] GET /admin/users");
            var users = await _adminService.GetAllUsersAsync();
            return Ok(new ApiResponse { Code = 1000, Message = "Lấy danh sách người dùng thành công", Data = users });
        }

        /// <summary>
        /// API: Xem chi tiết 1 người dùng cụ thể
        /// Chỉ ADMIN mới có quyền truy cập
        /// </summary>
        [HttpGet("users/{userId}")]
        public async Task<IActionResult> GetUserDetail(string userId)
        {
            _logger.LogInformation("[ADMIN API] GET /admin/users/{UserId}", userId);
            var userDetail = await _adminService.GetUserDetailAsync(userId);
            return Ok(new ApiResponse { Code = 1000, Message = "Lấy chi tiết người dùng thành công", Data = userDetail });
        }
    }
}
