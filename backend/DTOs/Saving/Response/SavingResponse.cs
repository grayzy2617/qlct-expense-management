using System;

namespace QLCT.DTOs.Saving.Response;

public record SavingResponse
{
    public string CategoryId { get; init; } = string.Empty;
    public string UserId { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public double LimitAmount { get; init; }
    public double SavedAmount { get; init; }
    public DateTime StartDate { get; init; }
    public DateTime EndDate { get; init; }
    public bool Status { get; init; }
    public bool ViewInReport { get; init; }

    public int GetProgressPercent()
    {
        if (LimitAmount <= 0) return 0;
        
        int p = (int)((SavedAmount / LimitAmount) * 100);
        return p > 100 ? 100 : Math.Max(p, 0);
    }
}
