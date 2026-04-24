using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace QLCT.Entities;

[Table("savings")]
[Index(nameof(Status), Name = "idx_saving_status")]
[Index(nameof(ViewInReport), Name = "idx_saving_view_report")]
[Index(nameof(StartDate), nameof(EndDate), Name = "idx_saving_dates")]
public class Saving : Category
{
    [Column("start_date")]
    public DateTime StartDate { get; set; }

    [Column("end_date")]
    public DateTime EndDate { get; set; }

    [Column("status")]
    public bool Status { get; set; } = true;

    [Column("view_in_report")]
    public bool ViewInReport { get; set; } = false;
}