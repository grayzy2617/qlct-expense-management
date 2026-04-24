using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace QLCT.Entities;

[Table("items")]
[Index(nameof(UserId), Name = "idx_item_user_id")]
[Index(nameof(CategoryId), Name = "idx_item_category_id")]
[Index(nameof(CreatedAt), Name = "idx_item_created_at")]
[Index(nameof(UserId), nameof(CreatedAt), Name = "idx_item_user_created")]
[Index(nameof(UserId), nameof(CategoryId), nameof(CreatedAt), Name = "idx_item_user_cat_created")]
public class Item
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Column("amount")]
    public double Amount { get; set; }

    [Column("description")]
    public string Description { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; }

    [Column("user_id")]
    public string UserId { get; set; }

    [ForeignKey(nameof(UserId))]
    public User User { get; set; }

    [Column("category_id")]
    public string CategoryId { get; set; }

    [ForeignKey(nameof(CategoryId))]
    public Category Category { get; set; }
}