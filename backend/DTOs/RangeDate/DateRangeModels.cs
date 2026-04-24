using System;

namespace QLCT.DTOs.RangeDate;

public record DateRangeResponse
{
    public string StartDate { get; init; } = string.Empty;
    public string EndDate { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
}

public record RangeDate
{
    public DateTime Start { get; init; }
    public DateTime End { get; init; }
}
