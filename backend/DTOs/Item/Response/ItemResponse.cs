using System;

namespace QLCT.DTOs.Item.Response;

public record ItemResponse
{
    public string Id { get; init; } = string.Empty;
    public string CategoryID { get; init; } = string.Empty;
    public string UserID { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public double Amount { get; init; }
    public DateTime CreatedAt { get; init; }
}
