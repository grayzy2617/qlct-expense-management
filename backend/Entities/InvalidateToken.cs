using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QLCT.Entities;

[Table("invalidate_token_entity")]
public class InvalidateToken
{
    [Key]
    [Column("id")]
    public string Id { get; set; }

    [Column("expirationTime")]
    public DateTime ExpirationTime { get; set; }
}