using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace QLCT.Entities;

[Table("users")]
[Index(nameof(Username), IsUnique = true, Name = "idx_user_username")]
public class User
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Column("username")]
    public string Username { get; set; }

    [Column("password")]
    public string Password { get; set; }

    [Column("start_day")]
    public int StartDay { get; set; } = 1;

    [Column("is_calc_by_next_month")]
    public bool IsCalcByNextMonth { get; set; } = false;

    [Column("createdAt")]
    public DateTime CreatedAt { get; set; }

    public ICollection<Role> Roles { get; set; } = new List<Role>();

    public ICollection<Category> Categories { get; set; } = new List<Category>();
}