using System;
using System.ComponentModel.DataAnnotations;

namespace QLCT.DTOs.Item.Request;

public record ItemCreateRequest
{
    public string UserID { get; init; } = string.Empty;
    public string CategoryID { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public double Amount { get; init; }
    public DateTime CreatedAt { get; init; }
}

public record ItemsByCategoryAndRangeRequest
{
    public string CategoryID { get; init; } = string.Empty;
    public int Month { get; init; }
    public int Year { get; init; }
}

public record ItemsByTypeAndRangeRequest
{
    public string Type { get; init; } = string.Empty;
    public int Month { get; init; }
    public int Year { get; init; }
}

public record ItemsByTypeAndYearRequest
{
    public string Type { get; init; } = string.Empty;
    public int Year { get; init; }
}

public record ItemUpdateRequest
{
    public string Description { get; init; } = string.Empty;
    public double Amount { get; init; }
    public DateTime CreatedAt { get; init; }
}
