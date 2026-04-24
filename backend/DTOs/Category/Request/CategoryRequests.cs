using System.ComponentModel.DataAnnotations;

namespace QLCT.DTOs.Category.Request;

public record CategoriesByTypeAndRangeRequest
{
    [Required]
    public string Type { get; init; } = string.Empty;

    public int Month { get; init; }
    public int Year { get; init; }
}

public record CategoriesByTypeAndYearRequest
{
    public string Type { get; init; } = string.Empty; // "INCOME" or "EXPENSE"
    public int Year { get; init; }
}

public record CategoryCreateRequest
{
    public string UserID { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public string Type { get; init; } = string.Empty;
    public double LimitAmount { get; init; }
}

public record CategoryUpdateRequest
{
    public string CategoryName { get; init; } = string.Empty;
    public string Type { get; init; } = string.Empty;
    public double LimitAmount { get; init; }
}
