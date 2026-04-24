using System;
using System.ComponentModel.DataAnnotations;

namespace QLCT.DTOs.Saving.Request;

public record SavingCreateRequest
{
    [Required]
    public string Name { get; init; } = string.Empty;
    
    public double LimitAmount { get; init; }
    public DateTime StartDate { get; init; }
    public DateTime EndDate { get; init; }
    public bool ViewInReport { get; init; }
    public bool Status { get; init; }
}

public record SavingUpdateRequest
{
    [Required]
    public string Name { get; init; } = string.Empty;
    
    public double LimitAmount { get; init; }
    public DateTime StartDate { get; init; }
    public DateTime EndDate { get; init; }
    public bool ViewInReport { get; init; }
}
