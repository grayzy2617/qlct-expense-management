using Microsoft.EntityFrameworkCore;
using QLCT.Entities;

namespace QLCT.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Category> Categories { get; set; }
    public DbSet<InvalidateToken> InvalidateTokens { get; set; }
    public DbSet<Item> Items { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<Saving> Savings { get; set; }
    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Category Inheritance (JOINED strategy mapping in Java)
        modelBuilder.Entity<Category>().UseTptMappingStrategy();
        modelBuilder.Entity<Saving>().ToTable("savings");

        // User - Role Many-to-Many Relationship
        modelBuilder.Entity<User>()
            .HasMany(u => u.Roles)
            .WithMany(r => r.Users)
            .UsingEntity<Dictionary<string, object>>(
                "user_roles",
                j => j.HasOne<Role>().WithMany().HasForeignKey("role_id"),
                j => j.HasOne<User>().WithMany().HasForeignKey("user_id")
            );

        // One-to-Many User -> Categories
        modelBuilder.Entity<Category>()
            .HasOne(c => c.User)
            .WithMany(u => u.Categories)
            .HasForeignKey(c => c.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // One-to-Many Category -> Items
        modelBuilder.Entity<Item>()
            .HasOne(i => i.Category)
            .WithMany(c => c.Items)
            .HasForeignKey(i => i.CategoryId)
            .OnDelete(DeleteBehavior.Cascade);

        // Name columns properly
        modelBuilder.Entity<Category>().Property(c => c.LimitAmount).HasColumnName("limitAmount");
        modelBuilder.Entity<InvalidateToken>().Property(i => i.ExpirationTime).HasColumnName("expirationTime");
        modelBuilder.Entity<User>().Property(u => u.CreatedAt).HasColumnName("createdAt");
    }
}