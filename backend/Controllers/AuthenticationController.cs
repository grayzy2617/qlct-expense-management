using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using QLCT.DTOs;
using QLCT.Services;
using QLCT.DTOs.Authentication.Request;
using Microsoft.AspNetCore.Authorization;

namespace QLCT.Controllers
{
    [ApiController]
    [Route("auth")] // Đường dẫn chung cho cả quán
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthenticationService _authenticationService;

        public AuthenticationController(IAuthenticationService authenticationService)
        {
            _authenticationService = authenticationService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] AuthenticationRequest request)
        {
            var authenticated = await _authenticationService.AuthenticateAsync(request);
            string mess = authenticated.Authenticated ? "Xác thực người dùng thành công" : "Xác thực người dùng thất bại";
            return Ok(new ApiResponse { Code = 1001, Message = mess, Data = authenticated });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromBody] LogoutRequest request)
        {
            await _authenticationService.LogoutAsync(request);
            return Ok(new ApiResponse { Code = 1001, Message = "logout thành công", Data = null });
        }

        [HttpPost("introspect")]
        public async Task<IActionResult> Introspect([FromBody] IntrospectRequest request)
        {
            var introspectResponse = await _authenticationService.IntrospectAsync(request);
            string mess = introspectResponse.Active ? "Token hợp lệ" : "Token không hợp lệ";
            return Ok(new ApiResponse { Code = 1001, Message = mess, Data = introspectResponse });
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh([FromBody] RefreshRequest request)
        {
            var refreshResponse = await _authenticationService.RefreshTokenAsync(request);
            return Ok(new ApiResponse { Code = 1001, Message = "Refresh token thành công", Data = refreshResponse });
        }
    }
}
