using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using QLCT.Entities;

namespace QLCT.Repositories
{
    public interface ICategoryRepository : IRepository<Category>
    {
        Task<List<Category>> FindByUserIdAndTypeAsync(string userId, string type);
        Task<int> CountByUserIdAsync(string userId);
        Task<List<CategoryReportProjection>> GetCategoryReportAsync(string userId, DateTime startDate, DateTime endDate, string type);
        Task<List<CategoryReportProjection>> GetCategoryReportByYearAsync(string userId, int year, string type);
        Task<bool> DeleteAllByUserIdAsync(string userId);
    }
}