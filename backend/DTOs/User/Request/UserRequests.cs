using System.ComponentModel.DataAnnotations;

namespace QLCT.DTOs.User.Request;

public record ChangePasswordRequest
{
    [Required]
    public string OldPassword { get; init; } = string.Empty;

    [Required]
    public string NewPassword { get; init; } = string.Empty;

    [Required]
    public string ConfirmNewPassword { get; init; } = string.Empty;
}

public record UpdateUserRequest
{
    public string Name { get; init; } = string.Empty;
}

public record UserRegisterRequest
{
    [Required]
    [StringLength(50, MinimumLength = 2, ErrorMessage = "USERNAME_INVALID")]
    public string Username { get; init; } = string.Empty;

    [Required]
    public string Password { get; init; } = string.Empty;

    [Required]
    public string ConfirmPassword { get; init; } = string.Empty;
}
