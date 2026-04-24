using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace QLCT.Entities;

[Table("categories")]
[Index(nameof(UserId), Name = "idx_category_user_id")]
[Index(nameof(Type), Name = "idx_category_type")]
[Index(nameof(UserId), nameof(Type), Name = "idx_category_user_type")]
public class Category
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Column("user_id")]
    public string UserId { get; set; }
    
    [ForeignKey(nameof(UserId))]
    public User User { get; set; }

    [Column("name")]
    public string Name { get; set; }

    [Column("type")]
    public string Type { get; set; }

    [Column("limitAmount")] // Matches Hibernate default translation of double limitAmount, although snake_case could be limit_amount. I'll use limit_amount.
    public double LimitAmount { get; set; }

    public ICollection<Item> Items { get; set; } = new List<Item>();
}