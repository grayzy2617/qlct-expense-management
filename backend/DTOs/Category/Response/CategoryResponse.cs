namespace QLCT.DTOs.Category.Response;

public record CategoryResponse
{
    public string Id { get; init; } = string.Empty;
    public string UserID { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public string Type { get; init; } = string.Empty;
    public double LimitAmount { get; init; }
    public double SpentSum { get; init; }
}
