using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using QLCT.Data;
using QLCT.Entities;

namespace QLCT.Repositories
{
    public class ItemRepository : Repository<Item>, IItemRepository
    {
        public ItemRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<List<Item>> FindByCategoryIdAsync(string categoryId)
        {
            // Assuming CategoryId exists
            return await _dbSet.Where(i => i.CategoryId == categoryId).ToListAsync();
        }

        public async Task<int> DeleteAllByUserIdAsync(string userId)
        {
            var items = await _dbSet.Where(i => i.UserId == userId).ToListAsync();
            int count = items.Count;
            if (count > 0)
            {
                _dbSet.RemoveRange(items);
            }
            return count;
        }

        public async Task<int> CountByUserIdAsync(string userId)
        {
            return await _dbSet.CountAsync(i => i.UserId == userId);
        }

        public async Task<double> GetSumByUserIdAndTypeAsync(string userId, string type)
        {
            var sum = await _dbSet
                .Include(i => i.Category)
                .Where(i => i.UserId == userId && i.Category.Type == type)
                .SumAsync(i => (double?)i.Amount) ?? 0.0;
            return sum;
        }

        public async Task<double> GetSumByTypeAndDateRangeAsync(string userId, string type, DateTime startDate, DateTime endDate)
        {
            var query = from i in _dbSet
                        join c in _context.Set<Category>() on i.CategoryId equals c.Id
                        join s in _context.Set<Saving>() on c.Id equals s.Id into sg
                        from s in sg.DefaultIfEmpty()
                        where i.UserId == userId
                              && i.CreatedAt >= startDate && i.CreatedAt <= endDate
                              && (c.Type == type || (type == "EXPENSE" && c.Type == "SAVING" && s != null && s.ViewInReport == true))
                        select (double?)i.Amount;

            return await query.SumAsync() ?? 0.0;
        }

        public async Task<double> GetSumByCategoryIdAndRangeAsync(string userId, string categoryId, DateTime startDate, DateTime endDate)
        {
            var sum = await _dbSet
                .Where(i => i.UserId == userId && i.CategoryId == categoryId && i.CreatedAt >= startDate && i.CreatedAt <= endDate)
                .SumAsync(i => (double?)i.Amount) ?? 0.0;
            return sum;
        }

        public async Task<List<Item>> FindByUserIdAndCategoryIdAndCreatedAtBetweenOrderByCreatedAtDescAsync(string userId, string categoryId, DateTime startDate, DateTime endDate)
        {
            return await _dbSet
                .Where(i => i.UserId == userId && i.CategoryId == categoryId && i.CreatedAt >= startDate && i.CreatedAt <= endDate)
                .OrderByDescending(i => i.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<Item>> GetItemsByCategoryDateRangeAndTypeAsync(string userId, DateTime startDate, DateTime endDate, string type)
        {
            var query = from i in _dbSet.Include(i => i.Category)
                        join c in _context.Set<Category>() on i.Category.Id equals c.Id
                        join s in _context.Set<Saving>() on c.Id equals s.Id into sg
                        from s in sg.DefaultIfEmpty()
                        where i.UserId == userId
                              && i.CreatedAt >= startDate && i.CreatedAt <= endDate
                              && (c.Type == type || (type == "EXPENSE" && c.Type == "SAVING" && s != null && s.ViewInReport == true))
                        orderby i.CreatedAt descending
                        select i;

            return await query.ToListAsync();
        }

        public async Task<double> GetSumByTypeAndYearAsync(string userId, string type, int year)
        {
            var query = from i in _dbSet
                        join c in _context.Set<Category>() on i.CategoryId equals c.Id
                        join s in _context.Set<Saving>() on c.Id equals s.Id into sg
                        from s in sg.DefaultIfEmpty()
                        where i.UserId == userId
                              && i.CreatedAt.Year == year
                              && (c.Type == type || (type == "EXPENSE" && c.Type == "SAVING" && s != null && s.ViewInReport == true))
                        select (double?)i.Amount;

            return await query.SumAsync() ?? 0.0;
        }
    }
}