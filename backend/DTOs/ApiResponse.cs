namespace QLCT.DTOs;

public record ApiResponse
{
    public int Code { get; init; }
    public string Message { get; init; } = string.Empty;
    public object? Data { get; init; }
}
