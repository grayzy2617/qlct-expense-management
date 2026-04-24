using System;

namespace QLCT.DTOs.MonthRange.Response;

public record MonthRangeResponse
{
    public int Month { get; init; }
    public DateTime Start { get; init; }
    public DateTime End { get; init; }
}
