using System.ComponentModel.DataAnnotations;

namespace QLCT.DTOs.Authentication.Request;

public record AuthenticationRequest
{
    [Required]
    [StringLength(50, MinimumLength = 2, ErrorMessage = "USERNAME_INVALID")]
    public string Username { get; init; } = string.Empty;

    [Required]
    [StringLength(50, MinimumLength = 2, ErrorMessage = "PASSWORD_INVALID")]
    public string Password { get; init; } = string.Empty;
}

public record IntrospectRequest
{
    [Required(ErrorMessage = "TOKEN_INVALID")]
    [StringLength(500, MinimumLength = 10, ErrorMessage = "TOKEN_INVALID")]
    public string Token { get; init; } = string.Empty;
}

public record LogoutRequest
{
    [Required(ErrorMessage = "TOKEN_INVALID")]
    [StringLength(500, MinimumLength = 10, ErrorMessage = "TOKEN_INVALID")]
    public string Token { get; init; } = string.Empty;
}

public record RefreshRequest
{
    [Required(ErrorMessage = "TOKEN_INVALID")]
    [StringLength(500, MinimumLength = 10, ErrorMessage = "TOKEN_INVALID")]
    public string Token { get; init; } = string.Empty;
}
