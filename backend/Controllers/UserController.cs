using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using QLCT.DTOs;
using QLCT.DTOs.User.Request;
using QLCT.Services;

namespace QLCT.Controllers
{
    [ApiController]
    [Route("users")] // Đường dẫn chung cho cả quán
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<IActionResult> GetMyInfor()
        {
            var userResponse = await _userService.GetCurrentUserAsync();
            return Ok(new ApiResponse { Code = 1001, Message = "Lấy thông tin người dùng thành công", Data = userResponse });
        }

        // đăng kí
        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody] UserRegisterRequest request)
        {
            var response = await _userService.SignUpAsync(request);
            return Ok(new ApiResponse { Code = 1000, Message = "Đăng ký người dùng thành công", Data = response });
        }
    }
}
