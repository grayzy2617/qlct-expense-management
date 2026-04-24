using System.ComponentModel.DataAnnotations;

namespace QLCT.DTOs.MonthRange.Request;

public record MonthUpdateBatchRequest
{
    [Range(1, 31)]
    public int StartDay { get; init; }

    public int BaseMonth { get; init; }
    public int TargetMonth { get; init; }
}
