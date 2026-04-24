using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using QLCT.Data;
using QLCT.Entities;

namespace QLCT.Repositories
{
    public class CategoryRepository : Repository<Category>, ICategoryRepository
    {
        public CategoryRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<List<Category>> FindByUserIdAndTypeAsync(string userId, string type)
        {
            return await _dbSet.Where(c => c.UserId == userId && c.Type == type).ToListAsync();
        }

        public async Task<int> CountByUserIdAsync(string userId)
        {
            return await _dbSet.CountAsync(c => c.UserId == userId);
        }

        public async Task<List<CategoryReportProjection>> GetCategoryReportAsync(string userId, DateTime startDate, DateTime endDate, string type)
        {
            var query = await (from i in _context.Set<Item>()
                               join c in _dbSet on i.CategoryId equals c.Id
                               join s in _context.Set<Saving>() on c.Id equals s.Id into sg
                               from s in sg.DefaultIfEmpty()
                               where i.UserId == userId
                                     && i.CreatedAt >= startDate && i.CreatedAt <= endDate
                                     && (c.Type == type || (type == "EXPENSE" && c.Type == "SAVING" && s != null && s.ViewInReport == true))
                               group i by new { c.Id, c.Name, c.LimitAmount, ViewInReport = s != null ? s.ViewInReport : (bool?)null } into g
                               select new CategoryReportProjection
                               {
                                   Id = g.Key.Id,
                                   Name = g.Key.Name,
                                   LimitAmount = g.Key.LimitAmount,
                                   SpentSum = g.Sum(x => x.Amount)
                               })
                               .OrderByDescending(x => x.SpentSum)
                               .ToListAsync();

            return query;
        }

        public async Task<List<CategoryReportProjection>> GetCategoryReportByYearAsync(string userId, int year, string type)
        {
            var query = await (from i in _context.Set<Item>()
                               join c in _dbSet on i.CategoryId equals c.Id
                               join s in _context.Set<Saving>() on c.Id equals s.Id into sg
                               from s in sg.DefaultIfEmpty()
                               where i.UserId == userId
                                     && i.CreatedAt.Year == year
                                     && (c.Type == type || (type == "EXPENSE" && c.Type == "SAVING" && s != null && s.ViewInReport == true))
                               group i by new { c.Id, c.Name, c.LimitAmount, ViewInReport = s != null ? s.ViewInReport : (bool?)null } into g
                               select new CategoryReportProjection
                               {
                                   Id = g.Key.Id,
                                   Name = g.Key.Name,
                                   LimitAmount = g.Key.LimitAmount,
                                   SpentSum = g.Sum(x => x.Amount)
                               })
                               .OrderByDescending(x => x.SpentSum)
                               .ToListAsync();

            return query;
        }

        public async Task<bool> DeleteAllByUserIdAsync(string userId)
        {
            var items = await _dbSet.Where(c => c.UserId == userId).ToListAsync();
            if (items.Any())
            {
                _dbSet.RemoveRange(items);
                return true;
            }
            return false;
        }
    }
}