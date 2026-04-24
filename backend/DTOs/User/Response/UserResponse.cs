namespace QLCT.DTOs.User.Response;

public record UserResponse
{
    public string Id { get; init; } = string.Empty;
    public string Username { get; init; } = string.Empty;
    public int StartDay { get; init; }
    public bool IsCalcByNextMonth { get; init; }
}
