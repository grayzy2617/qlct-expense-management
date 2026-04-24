using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using QLCT.Entities;

namespace QLCT.Repositories
{
    public interface IItemRepository : IRepository<Item>
    {
        Task<List<Item>> FindByCategoryIdAsync(string categoryId);
        Task<int> DeleteAllByUserIdAsync(string userId);
        Task<int> CountByUserIdAsync(string userId);
        Task<double> GetSumByUserIdAndTypeAsync(string userId, string type);
        Task<double> GetSumByTypeAndDateRangeAsync(string userId, string type, DateTime startDate, DateTime endDate);
        Task<double> GetSumByCategoryIdAndRangeAsync(string userId, string categoryId, DateTime startDate, DateTime endDate);
        Task<List<Item>> FindByUserIdAndCategoryIdAndCreatedAtBetweenOrderByCreatedAtDescAsync(string userId, string categoryId, DateTime startDate, DateTime endDate);
        Task<List<Item>> GetItemsByCategoryDateRangeAndTypeAsync(string userId, DateTime startDate, DateTime endDate, string type);
        Task<double> GetSumByTypeAndYearAsync(string userId, string type, int year);
    }
}