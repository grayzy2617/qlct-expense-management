using System;
using System.Collections.Generic;

namespace QLCT.DTOs.Admin.Response;

public record UserDetailResponse
{
    public string UserId { get; init; } = string.Empty;
    public string Username { get; init; } = string.Empty;
    public DateTime CreatedAt { get; init; }
    public List<string> Roles { get; init; } = new List<string>();
    public UserStatistics Statistics { get; init; } = new UserStatistics();
}

public record UserListItemResponse
{
    public string UserId { get; init; } = string.Empty;
    public string Username { get; init; } = string.Empty;
    public DateTime CreatedAt { get; init; }
    public int TotalCategories { get; init; }
    public int TotalItems { get; init; }
    public int TotalSavings { get; init; }
}

public record UserStatistics
{
    public int TotalCategories { get; init; }
    public int TotalItems { get; init; }
    public int TotalSavings { get; init; }
    public double TotalIncome { get; init; }
    public double TotalExpense { get; init; }
    public double Balance { get; init; }
}
